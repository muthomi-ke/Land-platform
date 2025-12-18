import React from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabaseClient';
import { FilterBar, type PlotFilters } from '../components/FilterBar';
import { PlotCard, type Plot } from '../components/PlotCard';
import { BadgeCheck, MapPin, Search, Sparkles, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Home: React.FC = () => {
  return (
    <div className="flex flex-col gap-14 lg:flex-row lg:mt-6">
      <Hero />
      <PlotsGrid />
    </div>
  );
};

const Hero: React.FC = () => {
  return (
    <section className="flex-1">
      <motion.div
        initial={{ y: 24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-xl"
      >
        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-[11px] font-medium text-emerald-200 shadow shadow-emerald-500/20">
          <span className="flex h-4 w-4 items-center justify-center rounded-full bg-emerald-400/90">
            <TrendingUp className="h-2.5 w-2.5 text-emerald-950" />
          </span>
          Land-backed yields from 6–12% in growth markets.
        </div>

        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-900 dark:text-white sm:text-4xl lg:text-5xl">
          Own the ground where the next decade is built.
        </h1>

        <p className="mt-4 text-sm leading-relaxed text-slate-600 dark:text-slate-400 sm:text-base">
          Land Leverage surfaces vetted plots across fast-growing regions—zoned, titled, and ready
          for your next home, farm, or long-term hold.
        </p>

        <div className="mt-5 flex flex-wrap items-center gap-3">
          <Link
            to="/get-started"
            className="inline-flex items-center gap-1.5 rounded-full bg-slate-50 px-4 py-2 text-xs font-semibold text-slate-950 shadow-md shadow-slate-950/40 transition hover:bg-slate-200"
          >
            Get started
            <Sparkles className="h-3.5 w-3.5 text-amber-500" />
          </Link>
          <Link
            to="/investments"
            className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-semibold text-slate-900 dark:text-slate-100 shadow-soft-2xl backdrop-blur-xl transition hover:bg-white/15"
          >
            Explore investments →
          </Link>
        </div>
      </motion.div>

      <PlotsFilters />

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="mt-4 flex flex-wrap items-center gap-4 text-xs text-slate-400 sm:text-sm"
      >
        <div className="flex items-center gap-2">
          <div className="h-5 w-5 rounded-full border border-emerald-400/40 bg-emerald-500/20" />
          12,000+ acres available today
        </div>
        <div className="flex items-center gap-2">
          <div className="flex -space-x-2">
            <div className="h-6 w-6 rounded-full border border-slate-950 bg-cover bg-center bg-[url('https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&w=120')]"></div>
            <div className="h-6 w-6 rounded-full border border-slate-950 bg-cover bg-center bg-[url('https://images.pexels.com/photos/1181519/pexels-photo-1181519.jpeg?auto=compress&cs=tinysrgb&w=120')]"></div>
            <div className="flex h-6 w-6 items-center justify-center rounded-full border border-slate-950 bg-slate-800 text-[10px]">
              +9k
            </div>
          </div>
          Trusted by landowners and buyers worldwide
        </div>
      </motion.div>
    </section>
  );
};

// Shared filter state for homepage (Hero + list)
const FiltersContext = React.createContext<{
  filters: PlotFilters;
  setFilters: React.Dispatch<React.SetStateAction<PlotFilters>>;
} | null>(null);

const defaultFilters: PlotFilters = {
  location: '',
  minPriceKes: '',
  maxPriceKes: '',
  category: 'All'
};

const PlotsFilters: React.FC = () => {
  const ctx = React.useContext(FiltersContext);
  if (!ctx) return null;

  const { filters, setFilters } = ctx;

  return (
    <FilterBar
      filters={filters}
      onChange={partial => setFilters(prev => ({ ...prev, ...partial }))}
      onReset={() => setFilters(defaultFilters)}
    />
  );
};

const PlotsGrid: React.FC = () => {
  const [filters, setFilters] = React.useState<PlotFilters>(defaultFilters);

  return (
    <FiltersContext.Provider value={{ filters, setFilters }}>
      <FeaturedPlots />
    </FiltersContext.Provider>
  );
};

const FeaturedPlots: React.FC = () => {
  const ctx = React.useContext(FiltersContext);
  const filters = ctx?.filters ?? defaultFilters;

  const [plots, setPlots] = React.useState<Plot[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchPlots = async () => {
      try {
        setLoading(true);
        setError(null);

        if (!supabase) {
          setError('Data is not available – Supabase is not configured yet.');
          return;
        }

        let query = supabase
          .from('plots')
          .select('id, name, location, size, price, tag, image_url, category, seller_id')
          .limit(24);

        const locationTerm = filters.location.trim();
        if (locationTerm) {
          query = query.ilike('location', `%${locationTerm}%`);
        }

        if (filters.category !== 'All') {
          query = query.eq('category', filters.category);
        }

        const min = Number(filters.minPriceKes);
        if (filters.minPriceKes.trim() !== '' && !Number.isNaN(min)) {
          query = query.gte('price', min);
        }

        const max = Number(filters.maxPriceKes);
        if (filters.maxPriceKes.trim() !== '' && !Number.isNaN(max)) {
          query = query.lte('price', max);
        }

        const { data, error: supabaseError } = await query;
        if (supabaseError) throw supabaseError;

        setPlots((data as Plot[]) ?? []);
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error('Error fetching plots from Supabase', err);
        setError('Unable to load plots right now.');
      } finally {
        setLoading(false);
      }
    };

    void fetchPlots();
  }, [filters.location, filters.minPriceKes, filters.maxPriceKes, filters.category]);

  return (
    <section id="featured-plots" className="mt-10 w-full lg:mt-0">
      <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.25 }}>
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-sm font-medium uppercase tracking-[0.18em] text-slate-400">
            Listings
          </h2>
          <span className="text-xs text-slate-400">
            {loading ? 'Loading…' : `${plots.length} result${plots.length === 1 ? '' : 's'}`}
          </span>
        </div>

        <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
          {loading && (
            <div className="rounded-2xl border border-white/15 bg-white/10 p-4 text-xs text-slate-600 dark:text-slate-400 backdrop-blur-xl">
              Loading plots...
            </div>
          )}

          {!loading && error && (
            <div className="rounded-2xl border border-rose-500/40 bg-rose-500/10 p-4 text-xs text-rose-100 backdrop-blur-xl">
              {error}
            </div>
          )}

          {!loading && !error && plots.length === 0 && (
            <div className="rounded-2xl border border-white/15 bg-white/10 p-4 text-xs text-slate-600 dark:text-slate-400 backdrop-blur-xl">
              No plots match your filters yet.
            </div>
          )}

          {!loading &&
            !error &&
            plots.map((plot, index) => (
              <motion.div
                key={plot.id}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 + index * 0.05, duration: 0.5 }}
              >
                <PlotCard plot={plot} />
              </motion.div>
            ))}
        </div>

        <div className="mt-4 flex items-center gap-2 text-[11px] text-slate-500">
          <div className="inline-flex items-center gap-1 rounded-full bg-sky-500/10 px-2 py-0.5 text-[10px] font-semibold text-sky-100 ring-1 ring-sky-400/20">
            <BadgeCheck className="h-3.5 w-3.5 text-sky-400" />
            Verified-first sourcing
          </div>
          <span>Use filters above to refine by location, category, and KES budget.</span>
        </div>
      </motion.div>
    </section>
  );
};

export default Home;


