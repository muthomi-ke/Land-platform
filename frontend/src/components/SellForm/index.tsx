import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { supabase } from '../../lib/supabaseClient';
import { SellFormState, SellerType } from './types';
import { uploadFiles, formatPrice, parsePrice, validateEmail, validatePhone } from './utils';
import { Loader2, MapPin, Upload, X, ArrowLeft, ArrowRight, Check } from 'lucide-react';

// Fix for default marker icons in Next.js
const icon = new L.Icon({
  iconUrl: '/marker-icon.png',
  iconRetinaUrl: '/marker-icon-2x.png',
  shadowUrl: '/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = icon;

// Default center for the map (Nairobi, Kenya)
const DEFAULT_CENTER: [number, number] = [-1.2921, 36.8219];
const DEFAULT_ZOOM = 10;

// Custom marker component
const LocationMarker: React.FC<{
  position: { lat: number; lng: number } | null;
  onPositionChange: (lat: number, lng: number) => void;
}> = ({ position, onPositionChange }) => {
  useMapEvents({
    click(e) {
      onPositionChange(e.latlng.lat, e.latlng.lng);
    },
  });

  return position === null ? null : (
    <Marker position={position}>
      <Popup>Your land location</Popup>
    </Marker>
  );
};

export const SellForm: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [mapReady, setMapReady] = useState(false);
  
  const [state, setState] = useState<SellFormState>({
    sellerType: 'owner',
    agencyName: '',
    ownerName: '',
    ownerEmail: '',
    ownerPhone: '',
    parcelName: '',
    location: '',
    size: '',
    price: '',
    description: '',
    neighborhoodScore: 7,
    latitude: null,
    longitude: null,
    mediaFiles: [],
    aerialViewUrl: ''
  });

  // Set map as ready after component mounts
  useEffect(() => {
    setMapReady(true);
  }, []);

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Special handling for price input to format with commas
    if (name === 'price') {
      const formattedValue = formatPrice(value);
      setState(prev => ({ ...prev, [name]: formattedValue }));
      return;
    }
    
    setState(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setState(prev => ({
        ...prev,
        mediaFiles: [...prev.mediaFiles, ...files].slice(0, 10) // Limit to 10 files
      }));
    }
  };

  // Remove a file from the selection
  const removeFile = (index: number) => {
    setState(prev => ({
      ...prev,
      mediaFiles: prev.mediaFiles.filter((_, i) => i !== index)
    }));
  };

  // Handle map position change
  const handlePositionChange = (lat: number, lng: number) => {
    setState(prev => ({
      ...prev,
      latitude: lat,
      longitude: lng,
      location: `${lat.toFixed(4)}, ${lng.toFixed(4)}`
    }));
  };

  // Validate current step
  const validateStep = (): boolean => {
    switch (step) {
      case 1: // Seller info
        if (!state.ownerName.trim()) {
          setError('Owner name is required');
          return false;
        }
        if (!state.ownerEmail.trim()) {
          setError('Email is required');
          return false;
        }
        if (!validateEmail(state.ownerEmail)) {
          setError('Please enter a valid email address');
          return false;
        }
        if (!state.ownerPhone.trim()) {
          setError('Phone number is required');
          return false;
        }
        if (!validatePhone(state.ownerPhone)) {
          setError('Please enter a valid phone number');
          return false;
        }
        if (state.sellerType === 'broker' && !state.agencyName.trim()) {
          setError('Agency name is required for brokers');
          return false;
        }
        break;
        
      case 2: // Property details
        if (!state.parcelName.trim()) {
          setError('Parcel name is required');
          return false;
        }
        if (!state.location.trim()) {
          setError('Please select a location on the map');
          return false;
        }
        if (!state.size.trim()) {
          setError('Size is required');
          return false;
        }
        if (!state.price.trim()) {
          setError('Price is required');
          return false;
        }
        if (parsePrice(state.price) <= 0) {
          setError('Please enter a valid price');
          return false;
        }
        if (!state.description.trim()) {
          setError('Description is required');
          return false;
        }
        break;
        
      case 3: // Media
        if (state.mediaFiles.length === 0 && !state.aerialViewUrl) {
          setError('Please upload at least one photo or provide an aerial view URL');
          return false;
        }
        break;
    }
    
    setError(null);
    return true;
  };

  // Handle next step
  const nextStep = () => {
    if (validateStep()) {
      setStep(prev => Math.min(prev + 1, 4));
    }
  };

  // Handle previous step
  const prevStep = () => {
    setStep(prev => Math.max(prev - 1, 1));
    setError(null);
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateStep()) return;
    
    setSubmitting(true);
    setError(null);
    
    try {
      // Upload media files if any
      let mediaUrls: string[] = [];
      if (state.mediaFiles.length > 0) {
        mediaUrls = await uploadFiles(state.mediaFiles);
      }
      
      // Sanitize price - handle 'TBD' or empty cases
      const numericPrice = state.price.trim().toLowerCase() === 'tbd' 
        ? 0 
        : parseInt(state.price.toString().replace(/[^0-9]/g, '')) || 0;
      
      // Prepare plot data
      const plotData = {
        name: state.parcelName,
        location: state.location,
        size: state.size,
        price: numericPrice, // Now a number, not a string
        description: state.description,
        neighborhood_score: state.neighborhoodScore,
        owner_name: state.ownerName,
        owner_email: state.ownerEmail,
        owner_phone: state.ownerPhone,
        seller_type: state.sellerType,
        agency_name: state.sellerType === 'broker' ? state.agencyName : null,
        latitude: state.latitude,
        longitude: state.longitude,
        media_urls: mediaUrls,
        aerial_view_url: state.aerialViewUrl || null,
        is_verified: false
      };
      
      // Insert into database
      const { data, error } = await supabase
        .from('plots')
        .insert([plotData])
        .select();
        
      if (error) throw error;
      
      setSuccess('Your listing has been submitted successfully and is pending verification!');
      setStep(4); // Success step
      
    } catch (err) {
      console.error('Error submitting form:', err);
      setError(err instanceof Error ? err.message : 'An error occurred while submitting the form');
    } finally {
      setSubmitting(false);
    }
  };

  // Render step 1: Seller Information
  const renderStep1 = () => (
    <>
      <h2 className="text-xl font-semibold mb-6">Seller Information</h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">I am selling as...</label>
          <div className="flex space-x-4">
            <label className="flex items-center">
              <input
                type="radio"
                name="sellerType"
                value="owner"
                checked={state.sellerType === 'owner'}
                onChange={() => setState(prev => ({ ...prev, sellerType: 'owner' }))}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2">Owner</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="sellerType"
                value="broker"
                checked={state.sellerType === 'broker'}
                onChange={() => setState(prev => ({ ...prev, sellerType: 'broker' }))}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2">Broker</span>
            </label>
          </div>
        </div>
        
        {state.sellerType === 'broker' && (
          <div>
            <label htmlFor="agencyName" className="block text-sm font-medium mb-1">
              Agency Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="agencyName"
              name="agencyName"
              value={state.agencyName}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter agency name"
              required
            />
          </div>
        )}
        
        <div>
          <label htmlFor="ownerName" className="block text-sm font-medium mb-1">
            Full Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="ownerName"
            name="ownerName"
            value={state.ownerName}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="Your full name"
            required
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="ownerEmail" className="block text-sm font-medium mb-1">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              id="ownerEmail"
              name="ownerEmail"
              value={state.ownerEmail}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="your.email@example.com"
              required
            />
          </div>
          
          <div>
            <label htmlFor="ownerPhone" className="block text-sm font-medium mb-1">
              Phone Number <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              id="ownerPhone"
              name="ownerPhone"
              value={state.ownerPhone}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="+254 7XX XXX XXX"
              required
            />
          </div>
        </div>
      </div>
      
      <div className="mt-8 flex justify-end">
        <button
          type="button"
          onClick={nextStep}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Next <ArrowRight className="ml-2 h-4 w-4" />
        </button>
      </div>
    </>
  );

  // Render step 2: Property Details
  const renderStep2 = () => (
    <>
      <h2 className="text-xl font-semibold mb-6">Property Details</h2>
      
      <div className="space-y-4">
        <div>
          <label htmlFor="parcelName" className="block text-sm font-medium mb-1">
            Parcel Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="parcelName"
            name="parcelName"
            value={state.parcelName}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="e.g., Riverside View Estate, Plot 42"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">
            Location <span className="text-red-500">*</span>
          </label>
          <div className="h-64 rounded-md overflow-hidden border border-gray-300">
            {mapReady && (
              <MapContainer
                center={DEFAULT_CENTER}
                zoom={DEFAULT_ZOOM}
                style={{ height: '100%', width: '100%' }}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                <LocationMarker
                  position={state.latitude && state.longitude ? { lat: state.latitude, lng: state.longitude } : null}
                  onPositionChange={handlePositionChange}
                />
              </MapContainer>
            )}
          </div>
          <p className="mt-1 text-xs text-gray-500">
            Click on the map to mark your property location
          </p>
          <input
            type="text"
            readOnly
            value={state.location}
            className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50"
            placeholder="Click on the map to set location"
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="size" className="block text-sm font-medium mb-1">
              Size (acres) <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                id="size"
                name="size"
                value={state.size}
                onChange={handleChange}
                className="w-full pl-3 pr-8 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="0.00"
                required
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">acres</span>
              </div>
            </div>
          </div>
          
          <div>
            <label htmlFor="price" className="block text-sm font-medium mb-1">
              Price (KES) <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">KES</span>
              </div>
              <input
                type="text"
                id="price"
                name="price"
                value={state.price}
                onChange={handleChange}
                className="w-full pl-12 pr-8 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="0"
                required
              />
            </div>
          </div>
        </div>
        
        <div>
          <label htmlFor="neighborhoodScore" className="block text-sm font-medium mb-1">
            Neighborhood Score: <span className="font-normal">{state.neighborhoodScore}/10</span>
          </label>
          <input
            type="range"
            id="neighborhoodScore"
            name="neighborhoodScore"
            min="1"
            max="10"
            step="1"
            value={state.neighborhoodScore}
            onChange={handleChange}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-xs text-gray-500">
            <span>Poor</span>
            <span>Excellent</span>
          </div>
        </div>
        
        <div>
          <label htmlFor="description" className="block text-sm font-medium mb-1">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            id="description"
            name="description"
            rows={4}
            value={state.description}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="Describe the property, nearby amenities, access roads, etc."
            required
          />
        </div>
      </div>
      
      <div className="mt-8 flex justify-between">
        <button
          type="button"
          onClick={prevStep}
          className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </button>
        <button
          type="button"
          onClick={nextStep}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Next <ArrowRight className="ml-2 h-4 w-4" />
        </button>
      </div>
    </>
  );

  // Render step 3: Media Upload
  const renderStep3 = () => (
    <>
      <h2 className="text-xl font-semibold mb-6">Media & Aerial View</h2>
      
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">
            Upload Photos (Max 10) <span className="text-red-500">*</span>
          </label>
          
          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
            <div className="space-y-1 text-center">
              <Upload className="mx-auto h-12 w-12 text-gray-400" />
              <div className="flex text-sm text-gray-600">
                <label
                  htmlFor="file-upload"
                  className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                >
                  <span>Upload files</span>
                  <input
                    id="file-upload"
                    name="file-upload"
                    type="file"
                    className="sr-only"
                    multiple
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                </label>
                <p className="pl-1">or drag and drop</p>
              </div>
              <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
            </div>
          </div>
          
          {state.mediaFiles.length > 0 && (
            <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {state.mediaFiles.map((file, index) => (
                <div key={index} className="relative group">
                  <img
                    src={URL.createObjectURL(file)}
                    alt={`Preview ${index + 1}`}
                    className="h-24 w-full object-cover rounded-md"
                  />
                  <button
                    type="button"
                    onClick={() => removeFile(index)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
          
          <p className="mt-1 text-xs text-gray-500">
            {state.mediaFiles.length} file{state.mediaFiles.length !== 1 ? 's' : ''} selected. {10 - state.mediaFiles.length} remaining.
          </p>
        </div>
        
        <div>
          <label htmlFor="aerialViewUrl" className="block text-sm font-medium mb-1">
            Aerial View / Drone Footage (YouTube/Vimeo Link)
          </label>
          <input
            type="url"
            id="aerialViewUrl"
            name="aerialViewUrl"
            value={state.aerialViewUrl}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="https://youtube.com/... or https://vimeo.com/..."
          />
          <p className="mt-1 text-xs text-gray-500">
            Optional: Add a link to an aerial view or drone footage of the property
          </p>
        </div>
      </div>
      
      <div className="mt-8 flex justify-between">
        <button
          type="button"
          onClick={prevStep}
          className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={submitting}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting ? (
            <>
              <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
              Submitting...
            </>
          ) : (
            'Submit Listing'
          )}
        </button>
      </div>
    </>
  );

  // Render step 4: Success
  const renderSuccess = () => (
    <div className="text-center py-8">
      <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
        <Check className="h-6 w-6 text-green-600" />
      </div>
      <h2 className="mt-3 text-xl font-semibold text-gray-900">Listing Submitted Successfully!</h2>
      <p className="mt-2 text-gray-600">
        Your property listing has been submitted and is pending verification. 
        We'll review your submission and notify you once it's live on our platform.
      </p>
      <div className="mt-6">
        <button
          type="button"
          onClick={() => navigate('/')}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Back to Home
        </button>
      </div>
    </div>
  );

  // Render loading state
  if (!mapReady && step === 2) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin h-8 w-8 text-blue-600" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden">
        <div className="px-6 py-8 sm:p-10">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {step < 4 ? 'List Your Property' : 'Submission Complete'}
            </h1>
            {step < 4 && (
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                Step {step} of 3 - {['Seller Info', 'Property Details', 'Media & Location'][step - 1]}
              </p>
            )}
          </div>
          
          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}
          {step === 4 && renderSuccess()}
          
          {error && (
            <div className="mt-4 p-4 bg-red-50 border-l-4 border-red-500 text-red-700">
              <p>{error}</p>
            </div>
          )}
          
          {success && step !== 4 && (
            <div className="mt-4 p-4 bg-green-50 border-l-4 border-green-500 text-green-700">
              <p>{success}</p>
            </div>
          )}
        </div>
        
        {step < 4 && (
          <div className="px-6 py-4 bg-gray-50 dark:bg-slate-800/50 border-t border-gray-200 dark:border-slate-700">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                All fields marked with <span className="text-red-500">*</span> are required
              </div>
              <div className="flex space-x-2">
                {step > 1 && step < 4 && (
                  <button
                    type="button"
                    onClick={prevStep}
                    className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Back
                  </button>
                )}
                {step < 3 && (
                  <button
                    type="button"
                    onClick={nextStep}
                    className="px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Next
                  </button>
                )}
                {step === 3 && (
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={submitting}
                    className="px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitting ? 'Submitting...' : 'Submit Listing'}
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SellForm;
