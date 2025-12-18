import React from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { GoogleMap, MarkerF, useJsApiLoader } from '@react-google-maps/api';
import { Car, ExternalLink, MapPin } from 'lucide-react';

type RideMetrics = {
  distanceKm: number;
  durationMins: number;
};

const BASE_FARE_KES = 220;
const PER_KM_KES = 35;
const PER_MIN_KES = 5;
const MIN_FARE_KES = 250;

function calculateFareKes(distanceKm: number, durationMins: number): number {
  const raw = BASE_FARE_KES + distanceKm * PER_KM_KES + durationMins * PER_MIN_KES;
  return Math.max(MIN_FARE_KES, Math.round(raw));
}

export function calculateFareRange(distanceKm: number, durationMins: number): { low: number; high: number } {
  const calc = calculateFareKes(distanceKm, durationMins);
  return { low: Math.max(MIN_FARE_KES, calc - 50), high: calc + 50 };
}

type Plot = {
  id: number;
  name: string;
  location: string;
  size: string;
  price: number | string;
  image_url?: string | null;
  media_urls?: string[] | null;
  category?: string | null;
  seller_id?: string | null;
  seller_phone?: string | null;
  lat?: number | null;
  lng?: number | null;
  is_verified?: boolean | null;
};

export const PlotDetails: React.FC = () => {
  const { id } = useParams();
  const plotId = Number(id);

  const [plot, setPlot] = React.useState<Plot | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [ride, setRide] = React.useState<RideMetrics | null>(null);
  const [rideError, setRideError] = React.useState<string | null>(null);

  const googleMapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string | undefined;
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script-details',
    googleMapsApiKey: googleMapsApiKey ?? ''
  });

  // Fetch distance + duration from user's current location to plot (for ride & fare insights).
  React.useEffect(() => {
    const run = async () => {
      setRide(null);
      setRideError(null);

      if (!isLoaded) return;
      if (!plot?.lat || !plot?.lng) return;
      if (!navigator.geolocation) {
        setRideError('Geolocation not available to estimate ride distance.');
        return;
      }

      navigator.geolocation.getCurrentPosition(
        pos => {
          try {
            const origin = new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude);
            const destination = new google.maps.LatLng(plot.lat as number, plot.lng as number);
            const svc = new google.maps.DistanceMatrixService();

            svc.getDistanceMatrix(
              {
                origins: [origin],
                destinations: [destination],
                travelMode: google.maps.TravelMode.DRIVING
              },
              (resp, status) => {
                if (status !== 'OK' || !resp?.rows?.[0]?.elements?.[0]) {
                  setRideError('Unable to estimate distance right now.');
                  return;
                }
                const el = resp.rows[0].elements[0];
                if (el.status !== 'OK' || !el.distance?.value || !el.duration?.value) {
                  setRideError('Distance estimate unavailable for this location.');
                  return;
                }
                const distanceKm = el.distance.value / 1000;
                const durationMins = el.duration.value / 60;
                setRide({ distanceKm, durationMins });
              }
            );
          } catch {
            setRideError('Distance estimate failed.');
          }
        },
        () => setRideError('Enable location access to estimate fares.'),
        { enableHighAccuracy: true, timeout: 7000 }
      );
    };

    void run();
  }, [isLoaded, plot?.lat, plot?.lng]);

  React.useEffect(() => {
    const fetchPlot = async () => {
      try {
        setLoading(true);
        setError(null);
        if (!supabase) {
          setError('Supabase is not configured.');
          return;
        }
        if (!Number.isFinite(plotId)) {
          setError('Invalid plot id.');
          return;
        }

        const { data, error: qErr } = await supabase
          .from('plots')
          .select('id, name, location, size, price, image_url, media_urls, category, seller_id, seller_phone, lat, lng, is_verified')
          .eq('id', plotId)
          .single();

        if (qErr) throw qErr;
        setPlot((data as Plot) ?? null);
      } catch (err: any) {
        // eslint-disable-next-line no-console
        console.error('Error loading plot details', err);
        setError(err?.message ?? 'Failed to load plot.');
      } finally {
        setLoading(false);
      }
    };

    void fetchPlot();
  }, [plotId]);

  const waHref = React.useMemo(() => {
    if (!plot?.seller_phone) return null;
    const digits = String(plot.seller_phone).replace(/[^\d]/g, '');
    const msg = `I_am_interested_in_[${plot.name}]`;
    return `https://wa.me/${digits}?text=${encodeURIComponent(msg)}`;
  }, [plot?.name, plot?.seller_phone]);

  const uberHref =
    plot?.lat != null && plot?.lng != null
      ? `https://m.uber.com/ul/?action=setPickup&dropoff[latitude]=${plot.lat}&dropoff[longitude]=${plot.lng}&dropoff[nickname]=${encodeURIComponent(
          plot.name
        )}`
      : null;

  const boltHref = plot?.lat != null && plot?.lng != null
    ? `https://bolt.eu/ride/?lat=${plot.lat}&lng=${plot.lng}`
    : null;

  if (loading) {
    return (
      <section className="mx-auto w-full max-w-5xl rounded-3xl border border-white/15 bg-white/10 p-6 text-sm text-slate-900 shadow-soft-2xl backdrop-blur-xl dark:text-slate-100 sm:p-8">
        <p className="text-xs text-slate-600 dark:text-slate-400">Loading plot…</p>
      </section>
    );
  }

  if (error || !plot) {
    return (
      <section className="mx-auto w-full max-w-5xl rounded-3xl border border-rose-500/30 bg-rose-500/10 p-6 text-sm text-rose-100 shadow-soft-2xl backdrop-blur-xl sm:p-8">
        {error ?? 'Plot not found.'}
      </section>
    );
  }

  const gallery = (plot.media_urls?.length ? plot.media_urls : plot.image_url ? [plot.image_url] : []).filter(
    Boolean
  ) as string[];

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6">
      <section className="rounded-3xl border border-white/15 bg-white/10 p-6 shadow-soft-2xl backdrop-blur-xl sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
              Listing {plot.is_verified ? '· Verified' : '· Pending'}
            </p>
            <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
              {plot.name}
            </h1>
            <p className="mt-2 flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
              <MapPin className="h-4 w-4 text-brand-400" />
              {plot.location}
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-slate-500">
              <span className="rounded-full bg-white/10 px-3 py-1 ring-1 ring-white/10">
                Price (KES):{' '}
                <span className="font-semibold text-emerald-200">
                  {typeof plot.price === 'number' ? plot.price.toLocaleString() : plot.price}
                </span>
              </span>
              <span className="rounded-full bg-white/10 px-3 py-1 ring-1 ring-white/10">
                Size: <span className="font-semibold text-slate-200">{plot.size}</span>
              </span>
              {plot.category && (
                <span className="rounded-full bg-emerald-500/10 px-3 py-1 ring-1 ring-emerald-400/20 text-emerald-100">
                  {plot.category}
                </span>
              )}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <a
              href={waHref ?? '#'}
              onClick={async e => {
                if (!waHref) {
                  e.preventDefault();
                  return;
                }
                // Log lead before opening WhatsApp
                try {
                  if (supabase) {
                    await supabase.from('leads').insert({ plot_id: plot.id, seller_id: plot.seller_id ?? null });
                  }
                } finally {
                  // no-op
                }
              }}
              target={waHref ? '_blank' : undefined}
              rel={waHref ? 'noopener noreferrer' : undefined}
              className="relative inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-500/15 px-4 py-2 text-sm font-semibold text-emerald-100 ring-1 ring-emerald-400/30 transition hover:bg-emerald-500/25"
            >
              <span className="pointer-events-none absolute inset-0 rounded-2xl opacity-70 blur-md bg-emerald-400/20 animate-pulse" />
              <span className="relative inline-flex items-center gap-2">
                <ExternalLink className="h-4 w-4" />
                Chat on WhatsApp
              </span>
            </a>
          </div>
        </div>

        {gallery.length > 0 && (
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {gallery.slice(0, 4).map(url => (
              <div key={url} className="overflow-hidden rounded-3xl border border-white/15 bg-white/10 ring-1 ring-white/10">
                <img src={url} alt={plot.name} className="h-56 w-full object-cover" />
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="rounded-3xl border border-white/15 bg-white/10 p-6 shadow-soft-2xl backdrop-blur-xl sm:p-8">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
              Transport &amp; Logistics
            </p>
            <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
              Estimated fares based on standard rates. Real-time prices may vary in-app due to traffic or surge.
            </p>
          </div>
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <div className="rounded-3xl border border-emerald-400/20 bg-emerald-500/10 p-5 ring-1 ring-emerald-400/10">
            <div className="flex items-center gap-2 text-xs text-emerald-100">
              <Car className="h-4 w-4" />
              Fare estimate (KES)
            </div>
            <div className="mt-2 text-2xl font-semibold tracking-tight text-emerald-100">
              {ride ? (
                <>
                  {calculateFareRange(ride.distanceKm, ride.durationMins).low.toLocaleString()}–{calculateFareRange(ride.distanceKm, ride.durationMins).high.toLocaleString()}
                </>
              ) : (
                <span className="text-slate-200">{rideError ? '—' : 'Calculating…'}</span>
              )}
            </div>
            <div className="mt-2 text-xs text-slate-600 dark:text-slate-300">
              {ride ? (
                <>
                  ~{ride.distanceKm.toFixed(1)} km · ~{Math.round(ride.durationMins)} mins
                </>
              ) : rideError ? (
                rideError
              ) : (
                'Using your current location'
              )}
            </div>
          </div>

          <div className="sm:col-span-2 rounded-3xl border border-white/15 bg-white/10 p-5 ring-1 ring-white/10">
            <div className="grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                disabled={!uberHref}
                onClick={() => {
                  if (!uberHref) return;
                  window.open(uberHref, '_blank', 'noopener,noreferrer');
                }}
                className="inline-flex items-center justify-center rounded-2xl bg-black px-4 py-2 text-sm font-semibold text-white hover:bg-black/90 disabled:opacity-60"
              >
                Book on Uber
              </button>
              <button
                type="button"
                disabled={!boltHref}
                onClick={() => {
                  if (!boltHref) return;
                  window.open(boltHref, '_blank', 'noopener,noreferrer');
                }}
                className="inline-flex items-center justify-center rounded-2xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-500 disabled:opacity-60"
              >
                Book on Bolt
              </button>
            </div>
            <p className="mt-3 text-[11px] text-slate-600 dark:text-slate-400">
              Uber uses pickup from your current location. Bolt opens a direct ride deep link to the plot pin.
            </p>
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-emerald-400/25 bg-white/10 p-6 shadow-soft-2xl backdrop-blur-xl sm:p-8">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
          Map
        </p>
        <div className="mt-4 overflow-hidden rounded-3xl border border-emerald-400/25 bg-white/10 ring-1 ring-emerald-400/20 shadow-soft-2xl backdrop-blur-xl">
          <div className="h-80 w-full">
            {!googleMapsApiKey ? (
              <div className="flex h-full items-center justify-center p-4 text-xs text-slate-600 dark:text-slate-400">
                Set <code className="mx-1 rounded bg-white/10 px-1.5 py-0.5 font-mono">VITE_GOOGLE_MAPS_API_KEY</code> to enable maps.
              </div>
            ) : !isLoaded ? (
              <div className="flex h-full items-center justify-center p-4 text-xs text-slate-600 dark:text-slate-400">
                Loading map…
              </div>
            ) : plot.lat == null || plot.lng == null ? (
              <div className="flex h-full items-center justify-center p-4 text-xs text-slate-600 dark:text-slate-400">
                No coordinates saved for this plot yet.
              </div>
            ) : (
              <GoogleMap
                mapContainerStyle={{ width: '100%', height: '100%' }}
                center={{ lat: plot.lat, lng: plot.lng }}
                zoom={14}
                options={{ disableDefaultUI: true, clickableIcons: false }}
              >
                <MarkerF position={{ lat: plot.lat, lng: plot.lng }} />
              </GoogleMap>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default PlotDetails;


