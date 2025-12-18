import React from 'react';
import type { Session } from '@supabase/supabase-js';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { GoogleMap, MarkerF, useJsApiLoader } from '@react-google-maps/api';

type Props = {
  session: Session | null;
};

type FormState = {
  title: string;
  location: string;
  priceKes: string;
  sizeAcres: string;
  images: File[];
  videoFile: File | null;
  sellerPhone: string;
  lat: number | null;
  lng: number | null;
  category: 'Residential' | 'Agricultural' | 'Commercial' | 'Investment';
};

const defaultState: FormState = {
  title: '',
  location: '',
  priceKes: '',
  sizeAcres: '',
  images: [],
  videoFile: null,
  sellerPhone: '+254700000000',
  lat: null,
  lng: null,
  category: 'Residential'
};

export const AddPlot: React.FC<Props> = ({ session }) => {
  const navigate = useNavigate();

  const [state, setState] = React.useState<FormState>(defaultState);
  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState<string | null>(null);
  const [waitingVerify, setWaitingVerify] = React.useState(false);
  const [verifiedCelebration, setVerifiedCelebration] = React.useState(false);

  const googleMapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string | undefined;
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: googleMapsApiKey ?? ''
  });

  React.useEffect(() => {
    if (!session?.user) {
      navigate('/auth');
    }
  }, [navigate, session?.user]);

  const onChange =
    <K extends keyof FormState>(key: K) =>
    (value: FormState[K]) => {
      setState(prev => ({ ...prev, [key]: value }));
    };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!session?.user) {
      navigate('/auth');
      return;
    }
    if (!supabase) {
      setError('Supabase is not configured.');
      return;
    }

    const price = Number(state.priceKes);
    if (state.priceKes.trim() === '' || Number.isNaN(price)) {
      setError('Please enter a valid price in KES.');
      return;
    }

    try {
      setSubmitting(true);

      const uploads: Array<Promise<string | null>> = [];

      const uploadOne = async (file: File, prefix: 'images' | 'video'): Promise<string | null> => {
        const fileExt = file.name.split('.').pop() ?? 'bin';
        const filePath = `plots/${prefix}/${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`;
        const { error: uploadError } = await supabase.storage.from('plots-media').upload(filePath, file);
        if (uploadError) throw uploadError;
        const { data: publicData } = supabase.storage.from('plots-media').getPublicUrl(filePath);
        return publicData?.publicUrl ?? null;
      };

      // Multi-media upload: multiple images + optional one video (Promise.all)
      for (const img of state.images) uploads.push(uploadOne(img, 'images'));
      if (state.videoFile) uploads.push(uploadOne(state.videoFile, 'video'));

      const uploadedUrls = uploads.length ? await Promise.all(uploads) : [];
      const mediaUrls = uploadedUrls.filter(Boolean) as string[];
      const heroImageUrl = mediaUrls[0] ?? null;

      const { data: insertData, error: insertError } = await supabase
        .from('plots')
        .insert({
        name: state.title,
        location: state.location,
        price,
        size: `${state.sizeAcres} acres`,
        image_url: heroImageUrl,
        media_urls: mediaUrls,
        seller_id: session.user.id,
        seller_phone: state.sellerPhone,
        lat: state.lat,
        lng: state.lng,
        category: state.category,
        tag: 'New listing',
        is_verified: false
      })
        .select('id')
        .single();

      if (insertError) throw insertError;

      setSuccess('Listing created! You can verify it below (500 KES), or we will redirect shortly.');
      setState(defaultState);

      setTimeout(() => {
        navigate('/');
      }, 1800);

      // Keep plot id around for verification (best effort)
      if (insertData?.id) {
        // eslint-disable-next-line no-console
        console.log('Created plot id:', insertData.id);
      }
    } catch (err: any) {
      // eslint-disable-next-line no-console
      console.error('Error creating plot', err);
      setError(err?.message ?? 'Failed to create listing.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="mx-auto w-full max-w-3xl rounded-3xl border border-white/15 bg-white/10 p-6 text-sm text-slate-900 shadow-soft-2xl backdrop-blur-xl dark:text-slate-100 sm:p-8">
      <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
        Add listing
      </p>
      <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">
        Create a new plot
      </h1>
      <p className="mt-2 text-xs text-slate-600 dark:text-slate-400">
        Pricing is in <span className="font-semibold">KES</span>. Upload a hero image to improve conversion.
      </p>

      <form onSubmit={onSubmit} className="mt-6 space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="text-xs font-medium text-slate-600 dark:text-slate-300">Title</label>
            <input
              required
              value={state.title}
              onChange={e => onChange('title')(e.target.value)}
              placeholder="e.g. Ridgeview 2-Acre Plot"
              className="mt-1 w-full rounded-xl bg-white/10 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-500 ring-1 ring-white/10 focus:outline-none focus:ring-2 focus:ring-brand-400/70 dark:text-white"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="text-xs font-medium text-slate-600 dark:text-slate-300">Location</label>
            <input
              required
              value={state.location}
              onChange={e => onChange('location')(e.target.value)}
              placeholder="City, county, or landmark"
              className="mt-1 w-full rounded-xl bg-white/10 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-500 ring-1 ring-white/10 focus:outline-none focus:ring-2 focus:ring-brand-400/70 dark:text-white"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="text-xs font-medium text-slate-600 dark:text-slate-300">
              WhatsApp Number
            </label>
            <input
              required
              value={state.sellerPhone}
              onChange={e => onChange('sellerPhone')(e.target.value)}
              placeholder="+254700000000"
              className="mt-1 w-full rounded-xl bg-white/10 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-500 ring-1 ring-white/10 focus:outline-none focus:ring-2 focus:ring-emerald-400/60 dark:text-white"
            />
            <p className="mt-1 text-[11px] text-slate-600 dark:text-slate-400">
              This will be used for the “Chat on WhatsApp” button.
            </p>
          </div>

          <div>
            <label className="text-xs font-medium text-slate-600 dark:text-slate-300">Price (KES)</label>
            <input
              required
              inputMode="numeric"
              value={state.priceKes}
              onChange={e => onChange('priceKes')(e.target.value)}
              placeholder="Enter amount in KES"
              className="mt-1 w-full rounded-xl bg-white/10 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-500 ring-1 ring-white/10 focus:outline-none focus:ring-2 focus:ring-brand-400/70 dark:text-white"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-slate-600 dark:text-slate-300">Size (Acres)</label>
            <input
              required
              inputMode="decimal"
              value={state.sizeAcres}
              onChange={e => onChange('sizeAcres')(e.target.value)}
              placeholder="e.g. 2.5"
              className="mt-1 w-full rounded-xl bg-white/10 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-500 ring-1 ring-white/10 focus:outline-none focus:ring-2 focus:ring-brand-400/70 dark:text-white"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="text-xs font-medium text-slate-600 dark:text-slate-300">Category</label>
            <select
              value={state.category}
              onChange={e => onChange('category')(e.target.value as FormState['category'])}
              className="mt-1 w-full rounded-xl bg-white/10 px-3 py-2 text-sm text-slate-900 ring-1 ring-white/10 focus:outline-none focus:ring-2 focus:ring-brand-400/70 dark:text-white"
            >
              <option value="Residential">Residential</option>
              <option value="Agricultural">Agricultural</option>
              <option value="Commercial">Commercial</option>
              <option value="Investment">Investment</option>
            </select>
          </div>

          <div className="sm:col-span-2">
            <label className="text-xs font-medium text-slate-600 dark:text-slate-300">
              Images (multiple)
            </label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={e => onChange('images')(Array.from(e.target.files ?? []))}
              className="mt-2 w-full text-xs text-slate-500 file:mr-3 file:rounded-full file:border-0 file:bg-white/10 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-slate-900 hover:file:bg-white/15 dark:text-slate-300 dark:file:text-slate-100"
            />
            {state.images.length > 0 && (
              <p className="mt-1 text-[11px] text-slate-600 dark:text-slate-400">
                Selected: <span className="font-medium">{state.images.length}</span> image(s)
              </p>
            )}
          </div>

          <div className="sm:col-span-2">
            <label className="text-xs font-medium text-slate-600 dark:text-slate-300">Video (one)</label>
            <input
              type="file"
              accept="video/*"
              onChange={e => onChange('videoFile')(e.target.files?.[0] ?? null)}
              className="mt-2 w-full text-xs text-slate-500 file:mr-3 file:rounded-full file:border-0 file:bg-white/10 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-slate-900 hover:file:bg-white/15 dark:text-slate-300 dark:file:text-slate-100"
            />
            {state.videoFile && (
              <p className="mt-1 text-[11px] text-slate-600 dark:text-slate-400">
                Selected: <span className="font-medium">{state.videoFile.name}</span>
              </p>
            )}
          </div>

          <div className="sm:col-span-2">
            <label className="text-xs font-medium text-slate-600 dark:text-slate-300">
              Pin location on map
            </label>
            <div className="mt-2 overflow-hidden rounded-3xl border border-emerald-400/25 bg-white/10 ring-1 ring-emerald-400/20 shadow-soft-2xl backdrop-blur-xl">
              <div className="h-72 w-full">
                {!googleMapsApiKey ? (
                  <div className="flex h-full items-center justify-center p-4 text-xs text-slate-600 dark:text-slate-400">
                    Set <code className="mx-1 rounded bg-white/10 px-1.5 py-0.5 font-mono">VITE_GOOGLE_MAPS_API_KEY</code> to enable maps.
                  </div>
                ) : !isLoaded ? (
                  <div className="flex h-full items-center justify-center p-4 text-xs text-slate-600 dark:text-slate-400">
                    Loading map…
                  </div>
                ) : (
                  <GoogleMap
                    mapContainerStyle={{ width: '100%', height: '100%' }}
                    center={{
                      lat: state.lat ?? -1.286389,
                      lng: state.lng ?? 36.817223
                    }}
                    zoom={state.lat && state.lng ? 14 : 11}
                    onClick={e => {
                      const lat = e.latLng?.lat();
                      const lng = e.latLng?.lng();
                      if (lat == null || lng == null) return;
                      setState(prev => ({ ...prev, lat, lng }));
                    }}
                    options={{
                      disableDefaultUI: true,
                      clickableIcons: false
                    }}
                  >
                    {state.lat != null && state.lng != null && (
                      <MarkerF position={{ lat: state.lat, lng: state.lng }} />
                    )}
                  </GoogleMap>
                )}
              </div>
            </div>
            <p className="mt-2 text-[11px] text-slate-600 dark:text-slate-400">
              Click on the map to drop a pin. Current: {state.lat?.toFixed(6) ?? '—'}, {state.lng?.toFixed(6) ?? '—'}
            </p>
          </div>
        </div>

        {error && (
          <div className="rounded-2xl border border-rose-500/40 bg-rose-500/10 p-3 text-xs text-rose-100">
            {error}
          </div>
        )}

        {success && (
          <div className="rounded-2xl border border-emerald-400/30 bg-emerald-500/10 p-3 text-xs text-emerald-100">
            {success}
          </div>
        )}

        <div className="flex items-center justify-between gap-3 pt-2">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="h-10 px-2 text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex h-10 items-center gap-2 rounded-full bg-gradient-to-tr from-brand-500 to-emerald-400 px-6 text-xs font-semibold text-slate-950 shadow-md shadow-emerald-500/30 transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {submitting ? 'Publishing…' : 'Publish listing'}
          </button>
        </div>
      </form>

      {/* Verification payment placeholder */}
      <div className="mt-8 rounded-3xl border border-emerald-400/20 bg-emerald-500/10 p-5 shadow-soft-2xl backdrop-blur-xl">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-emerald-200">
          Verify Listing (500 KES)
        </p>
        <p className="mt-2 text-xs text-slate-600 dark:text-slate-300">
          STK Push verification requires a secure server endpoint (so your IntaSend SECRET_KEY never ships to the browser).
        </p>

        {waitingVerify && (
          <div className="mt-3 rounded-2xl border border-white/15 bg-white/10 p-3 text-xs text-slate-200">
            Waiting for M-Pesa Confirmation…
          </div>
        )}

        {verifiedCelebration && (
          <div className="mt-3 rounded-2xl border border-emerald-400/30 bg-emerald-500/10 p-3 text-xs text-emerald-100">
            Verified! 🎉
          </div>
        )}

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => {
              // UI hook only for now; wired once server endpoint is added.
              setWaitingVerify(true);
              setTimeout(() => {
                setWaitingVerify(false);
                setVerifiedCelebration(true);
              }, 1200);
            }}
            className="inline-flex items-center justify-center rounded-full bg-emerald-500/20 px-4 py-2 text-xs font-semibold text-emerald-100 ring-1 ring-emerald-400/30 hover:bg-emerald-500/25"
          >
            Pay & Verify (500 KES)
          </button>
          <span className="text-[11px] text-slate-600 dark:text-slate-300">
            Environment: Test · Currency: KES
          </span>
        </div>
      </div>
    </section>
  );
};

export default AddPlot;


