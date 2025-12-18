import { motion } from 'framer-motion';
import {
  BadgeCheck,
  Edit3,
  Instagram,
  Leaf,
  Lock,
  Mail,
  MapPin,
  MessageCircle,
  Search,
  Sparkles,
  Trash2,
  TrendingUp,
  Twitter,
  Menu as MenuIcon,
  X as XIcon
} from 'lucide-react';
import { supabase } from './lib/supabaseClient';
import { Link, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import React from 'react';
import Auth from './pages/Auth';
import type { Session } from '@supabase/supabase-js';
import Home from './pages/Home';
import Investments from './pages/Investments';
import AddPlot from './pages/AddPlot';
import PlotDetails from './pages/PlotDetails';
import Team from './pages/Team';
import FAQ from './pages/FAQ';
import Legal from './pages/Legal';
import Footer from './components/Footer';

type Plot = {
  id: number;
  name: string;
  location: string;
  size: string;
  price: string;
  tag?: string;
  image_url?: string;
   is_verified?: boolean;
};

type SellFormState = {
  // Step 1
  ownerName: string;
  ownerEmail: string;
  ownerPhone: string;
  parcelName: string;
  location: string;
  size: string;
  // Step 2
  description: string;
  neighborhoodScore: number;
  // Step 3
  mediaFile: File | null;
};

const App: React.FC = () => {
  const location = useLocation();
  const [session, setSession] = React.useState<Session | null>(null);

  React.useEffect(() => {
    let mounted = true;

    const init = async () => {
      if (!supabase) return;
      const { data } = await supabase.auth.getSession();
      if (!mounted) return;
      setSession(data.session ?? null);
    };

    void init();

    if (!supabase) {
      return () => {
        mounted = false;
      };
    }

    const { data: sub } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (!mounted) return;
      setSession(nextSession);
    });

    return () => {
      mounted = false;
      sub?.subscription?.unsubscribe?.();
    };
  }, []);

  return (
    <div className="min-h-screen text-slate-900 dark:text-white bg-white dark:bg-slate-950 transition-colors duration-300">
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="pointer-events-none absolute -left-40 top-[-10rem] h-[28rem] w-[28rem] rounded-full bg-brand-500/20 blur-3xl" />
        <div className="pointer-events-none absolute bottom-[-12rem] right-[-5rem] h-[26rem] w-[26rem] rounded-full bg-emerald-500/10 blur-3xl" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-slate-900 via-slate-950/40 to-transparent dark:from-slate-900 dark:via-slate-950/40 dark:to-transparent from-slate-100 via-white to-transparent" />
      </div>

      <div className="relative mx-auto flex min-h-screen max-w-6xl flex-col px-4 pb-16 pt-6 sm:px-6 lg:px-10">
        <NavBar session={session} />

        <main className="mt-10 flex-1">
          <Routes location={location}>
            <Route path="/" element={<Home />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/investments" element={<Investments />} />
            <Route path="/team" element={<Team />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/legal" element={<Legal />} />
            <Route path="/add-plot" element={<AddPlot session={session} />} />
            <Route path="/plots/:id" element={<PlotDetails />} />
            <Route path="/get-started" element={<GetStartedPage />} />
            <Route path="/sell" element={<SellForm />} />
            <Route path="/admin" element={<AdminPage />} />
          </Routes>
        </main>

        {location.pathname === '/' && (
          <>
            <ContactGrid />
            <FloatingCloud />
          </>
        )}

        <Footer />
      </div>
    </div>
  );
};

import { ThemeToggle } from './components/ThemeToggle';

const NavBar: React.FC<{ session: Session | null }> = ({ session }) => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const isAuthed = Boolean(session?.user);

  const handleLogout = async () => {
    if (!supabase) return;
    await supabase.auth.signOut();
  };

  return (
    <>
      <motion.header
        initial={{ y: -16, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-50 flex items-center justify-between rounded-full border border-slate-800/70 bg-slate-900/80 px-4 py-2 shadow-lg shadow-slate-950/40 backdrop-blur-xl sm:px-5 dark:border-slate-800/70 dark:bg-slate-900/80 bg-white/80 border-slate-200/70"
      >
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-tr from-brand-500 to-emerald-400 shadow-md shadow-emerald-500/40">
            <Leaf className="h-4 w-4 text-slate-950" />
          </div>
          <div className="leading-tight">
            <span className="text-sm font-semibold tracking-tight sm:text-base">LandPortal</span>
            <p className="text-[10px] text-slate-400 sm:text-xs">Curated land, anywhere.</p>
          </div>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-6 text-xs text-slate-600 dark:text-slate-400 sm:flex sm:text-sm">
          <Link
            to="/"
            className={`transition hover:text-slate-900 dark:hover:text-slate-50 ${
              location.pathname === '/' ? 'text-slate-900 dark:text-slate-50' : ''
            }`}
          >
            Discover
          </Link>
          <Link
            to="/investments"
            className={`transition hover:text-slate-900 dark:hover:text-slate-50 ${
              location.pathname === '/investments' ? 'text-slate-900 dark:text-slate-50' : ''
            }`}
          >
            Investment
          </Link>
          <Link
            to="/team"
            className={`transition hover:text-slate-900 dark:hover:text-slate-50 ${
              location.pathname === '/team' ? 'text-slate-900 dark:text-slate-50' : ''
            }`}
          >
            Team
          </Link>
          <Link
            to="/faq"
            className={`transition hover:text-slate-900 dark:hover:text-slate-50 ${
              location.pathname === '/faq' ? 'text-slate-900 dark:text-slate-50' : ''
            }`}
          >
            FAQ
          </Link>
          {isAuthed && (
            <Link
              to="/add-plot"
              className={`transition hover:text-slate-900 dark:hover:text-slate-50 ${
                location.pathname === '/add-plot' ? 'text-slate-900 dark:text-slate-50' : ''
              }`}
            >
              Add Listing
            </Link>
          )}
          <Link
            to="/sell"
            className={`transition hover:text-slate-900 dark:hover:text-slate-50 ${
              location.pathname === '/sell' ? 'text-slate-900 dark:text-slate-50' : ''
            }`}
          >
            Sell land
          </Link>
          <Link
            to="/admin"
            className={`transition hover:text-slate-900 dark:hover:text-slate-50 ${
              location.pathname === '/admin' ? 'text-slate-900 dark:text-slate-50' : ''
            }`}
          >
            Admin
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <div className="hidden sm:block">
            <ThemeToggle />
          </div>
          {!isAuthed ? (
            <Link
              to="/auth"
              className="hidden rounded-full border border-slate-300 dark:border-slate-700 px-3 py-1 text-xs font-medium text-slate-900 dark:text-slate-200 transition hover:bg-slate-100 dark:hover:bg-slate-800 sm:inline-flex sm:px-4 sm:py-1.5 sm:text-sm"
            >
              Login
            </Link>
          ) : (
            <button
              type="button"
              onClick={handleLogout}
              className="hidden rounded-full border border-slate-300 dark:border-slate-700 px-3 py-1 text-xs font-medium text-slate-900 dark:text-slate-200 transition hover:bg-slate-100 dark:hover:bg-slate-800 sm:inline-flex sm:px-4 sm:py-1.5 sm:text-sm"
            >
              Logout
            </button>
          )}
          <Link
            to="/get-started"
            className="hidden items-center gap-1.5 rounded-full bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-950 shadow-md shadow-slate-950/40 transition hover:bg-slate-200 sm:inline-flex sm:px-4 sm:text-sm"
          >
            Get started
            <Sparkles className="h-3.5 w-3.5 text-amber-500" />
          </Link>

          {/* Mobile Menu Toggle */}
          <button
            className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-slate-200 sm:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <XIcon className="h-4 w-4" /> : <MenuIcon className="h-4 w-4" />}
          </button>
        </div>
      </motion.header>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="absolute inset-x-0 top-20 z-40 mx-4 rounded-3xl border border-slate-200 dark:border-slate-800/70 bg-white dark:bg-slate-900/95 p-6 shadow-2xl backdrop-blur-xl sm:hidden"
        >
          <nav className="flex flex-col gap-4 text-sm text-slate-600 dark:text-slate-400">
            <Link
              to="/"
              onClick={() => setIsMenuOpen(false)}
              className={`flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2 ${
                location.pathname === '/' ? 'text-emerald-400 font-medium' : ''
              }`}
            >
              Discover
              <TrendingUp className="h-4 w-4" />
            </Link>
            <Link
              to="/investments"
              onClick={() => setIsMenuOpen(false)}
              className={`flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2 ${
                location.pathname === '/investments' ? 'text-emerald-400 font-medium' : ''
              }`}
            >
              Investment
              <span className="text-[10px] uppercase tracking-wider text-slate-500">KES</span>
            </Link>
            <Link
              to="/team"
              onClick={() => setIsMenuOpen(false)}
              className={`flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2 ${
                location.pathname === '/team' ? 'text-emerald-400 font-medium' : ''
              }`}
            >
              Team
              <span className="text-[10px] uppercase tracking-wider text-slate-500">Elite</span>
            </Link>
            <Link
              to="/faq"
              onClick={() => setIsMenuOpen(false)}
              className={`flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2 ${
                location.pathname === '/faq' ? 'text-emerald-400 font-medium' : ''
              }`}
            >
              FAQ
              <span className="text-[10px] uppercase tracking-wider text-slate-500">Help</span>
            </Link>
            {isAuthed && (
              <Link
                to="/add-plot"
                onClick={() => setIsMenuOpen(false)}
                className={`flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2 ${
                  location.pathname === '/add-plot' ? 'text-emerald-400 font-medium' : ''
                }`}
              >
                Add Listing
                <Edit3 className="h-4 w-4" />
              </Link>
            )}
            <Link
              to="/sell"
              onClick={() => setIsMenuOpen(false)}
              className={`flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2 ${
                location.pathname === '/sell' ? 'text-emerald-400 font-medium' : ''
              }`}
            >
              Sell land
              <Edit3 className="h-4 w-4" />
            </Link>
            <Link
              to="/admin"
              onClick={() => setIsMenuOpen(false)}
              className={`flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2 ${
                location.pathname === '/admin' ? 'text-emerald-400 font-medium' : ''
              }`}
            >
              Admin
              <Lock className="h-4 w-4" />
            </Link>
            <div className="flex items-center justify-between py-2">
              <span className="text-slate-400">Theme</span>
              <ThemeToggle />
            </div>
            <div className="mt-2 grid grid-cols-2 gap-3">
              {!isAuthed ? (
                <Link
                  to="/auth"
                  onClick={() => setIsMenuOpen(false)}
                  className="rounded-xl border border-slate-300 dark:border-slate-700 py-2.5 text-center font-medium text-slate-900 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Login
                </Link>
              ) : (
                <button
                  type="button"
                  onClick={async () => {
                    await handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="rounded-xl border border-slate-300 dark:border-slate-700 py-2.5 text-center font-medium text-slate-900 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Logout
                </button>
              )}
              <Link
                to="/get-started"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center justify-center gap-2 rounded-xl bg-slate-50 py-2.5 font-semibold text-slate-950"
              >
                Get started
              </Link>
            </div>
          </nav>
        </motion.div>
      )}
    </>
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
          LandPortal surfaces vetted plots across fast-growing regions—zoned, titled, and ready for
          your next home, farm, or long-term hold. Explore like Airbnb. Invest like an insider.
        </p>
      </motion.div>

      <SearchCard />

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

const SearchCard: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
      className="mt-8 max-w-xl rounded-3xl border border-slate-200 dark:border-slate-800/70 bg-white dark:bg-slate-900/80 p-4 shadow-soft-2xl backdrop-blur-xl sm:p-5"
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400 sm:text-sm">
          <MapPin className="h-4 w-4 text-brand-400" />
          <span className="font-medium">Search plots by location</span>
        </div>
        <span className="rounded-full bg-slate-100 dark:bg-slate-800 px-2 py-1 text-[10px] text-slate-600 dark:text-slate-400 sm:text-[11px]">
          Zoned, titled & verified
        </span>
      </div>

      <div className="mt-4 flex flex-col gap-3 rounded-2xl bg-white dark:bg-slate-950/60 p-3 ring-1 ring-slate-300 dark:ring-slate-800 sm:flex-row sm:items-center sm:gap-4 sm:p-3.5">
        <div className="flex-1">
          <label className="text-[11px] font-medium uppercase tracking-[0.12em] text-slate-400">
            Location
          </label>
          <div className="mt-1 flex items-center gap-2 rounded-xl bg-white dark:bg-slate-900/80 px-3 py-2 ring-1 ring-slate-300 dark:ring-slate-700 focus-within:ring-brand-400">
            <Search className="h-3.5 w-3.5 text-slate-500" />
            <input
              placeholder="City, region or coordinates"
              className="w-full bg-transparent text-sm text-slate-900 dark:text-white placeholder:text-slate-500 focus:outline-none"
            />
          </div>
        </div>

        <div className="grid flex-1 grid-cols-2 gap-3 sm:grid-cols-1">
          <div>
            <label className="text-[11px] font-medium uppercase tracking-[0.12em] text-slate-400">
              Use case
            </label>
            <select className="mt-1 w-full rounded-xl bg-white dark:bg-slate-900/80 px-3 py-2 text-base text-slate-900 dark:text-slate-200 ring-1 ring-slate-300 dark:ring-slate-700 focus:outline-none focus:ring-brand-400 sm:text-sm">
              <option>Homestead</option>
              <option>Investment</option>
              <option>Farm & ranch</option>
              <option>Recreation</option>
            </select>
          </div>
          <div>
            <label className="text-[11px] font-medium uppercase tracking-[0.12em] text-slate-400">
              Budget
            </label>
            <select className="mt-1 w-full rounded-xl bg-white dark:bg-slate-900/80 px-3 py-2 text-base text-slate-900 dark:text-slate-200 ring-1 ring-slate-300 dark:ring-slate-700 focus:outline-none focus:ring-brand-400 sm:text-sm">
              <option>Up to $150k</option>
              <option>$150k – $350k</option>
              <option>$350k – $750k</option>
              <option>$750k+</option>
            </select>
          </div>
        </div>

        <button className="mt-1 inline-flex items-center justify-center rounded-2xl bg-gradient-to-tr from-brand-500 to-emerald-400 px-4 py-2 text-sm font-semibold text-slate-950 shadow-md shadow-emerald-500/40 transition hover:brightness-105 sm:mt-6 sm:h-11 sm:min-w-[7rem]">
          Explore plots
        </button>
      </div>

      <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500 sm:text-xs">
        <span>Smart filters for zoning, access, utilities & soil.</span>
        <button className="hidden text-emerald-300 hover:text-emerald-200 sm:inline">
          Advanced search →
        </button>
      </div>
    </motion.div>
  );
};

const FeaturedPlots: React.FC = () => {
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

        const { data, error: supabaseError } = await supabase
          .from('plots')
          .select('id, name, location, size, price, tag, image_url')
          .limit(4);

        if (supabaseError) {
          throw supabaseError;
        }

        setPlots((data as Plot[]) ?? []);
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error('Error fetching plots from Supabase', err);
        setError('Unable to load featured plots right now.');
      } finally {
        setLoading(false);
      }
    };

    fetchPlots();
  }, []);

  return (
    <section id="featured-plots" className="mt-10 w-full max-w-md lg:mt-0 lg:max-w-sm">
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.25 }}
      >
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-sm font-medium uppercase tracking-[0.18em] text-slate-400">
            Featured plots
          </h2>
          <button className="text-xs text-slate-400 hover:text-slate-200">View all</button>
        </div>

        <div className="mt-3 grid gap-3">
          {loading && (
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-900/80 p-4 text-xs text-slate-600 dark:text-slate-400">
              Loading featured plots...
            </div>
          )}

          {!loading && error && (
            <div className="rounded-2xl border border-rose-500/40 bg-rose-950/40 p-4 text-xs text-rose-100">
              {error}
            </div>
          )}

          {!loading &&
            !error &&
            plots.map((plot, index) => (
              <motion.article
                key={plot.id}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 + index * 0.08, duration: 0.5 }}
                className="group flex flex-col cursor-pointer overflow-hidden rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900/80 shadow-md shadow-slate-950/60 backdrop-blur-xl transition hover:border-brand-400/70 hover:bg-slate-900 sm:flex-row"
              >
                <div className="relative h-48 w-full flex-none overflow-hidden sm:h-28 sm:w-28">
                  <img
                    src={
                      plot.image_url ||
                      'https://images.pexels.com/photos/5726888/pexels-photo-5726888.jpeg?auto=compress&cs=tinysrgb&w=1200'
                    }
                    alt={plot.name}
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-110 group-hover:brightness-110"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-slate-900/60 via-transparent to-transparent" />
                  {plot.tag && (
                    <span className="absolute left-2 top-2 rounded-full bg-slate-950/75 px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.16em] text-slate-200 backdrop-blur">
                      {plot.tag}
                    </span>
                  )}
                </div>

                <div className="flex flex-1 flex-col justify-between px-3 py-2.5 sm:px-3.5 sm:py-3">
                  <div className="space-y-1">
                    <h3 className="line-clamp-1 text-sm font-semibold text-slate-900 dark:text-white">
                      {plot.name}
                    </h3>
                    <p className="mt-0.5 flex items-center gap-1 text-[11px] text-slate-600 dark:text-slate-400">
                      <MapPin className="h-3 w-3 text-slate-500" />
                      {plot.location}
                    </p>
                  </div>

                  <div className="mt-1 flex items-center justify-between gap-2 text-xs">
                    <div className="flex flex-col">
                      <span className="text-slate-400">Size</span>
                      <span className="font-medium text-slate-100">{plot.size}</span>
                    </div>
                    <div className="flex flex-1 items-center justify-end gap-2">
                      <div className="inline-flex items-center gap-1 rounded-full border border-sky-300/60 bg-gradient-to-r from-sky-100 via-sky-50 to-indigo-100 px-2 py-0.5 text-[10px] font-semibold text-sky-900 shadow-sm shadow-sky-200/60">
                        <div className="relative flex items-center">
                          <BadgeCheck className="h-3.5 w-3.5 text-sky-500" />
                          <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/60 to-transparent opacity-70 mix-blend-screen animate-shimmer" />
                        </div>
                        <span className="inline">Verified</span>
                      </div>
                      <div className="flex flex-col text-right">
                        <span className="text-slate-600 dark:text-slate-400">From</span>
                        <span className="text-sm font-semibold text-emerald-300">
                          {plot.price}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.article>
            ))}
        </div>

        <p className="mt-4 text-[11px] text-slate-600 dark:text-slate-500 sm:text-xs">
          All plots undergo title, zoning and access checks by our in-house land team before being
          listed.
        </p>
      </motion.div>
    </section>
  );
};

const FloatingCloud: React.FC = () => {
  const [visible, setVisible] = React.useState(true);

  if (!visible) {
    return null;
  }

  const handleScrollToFeatured = () => {
    const section = document.getElementById('featured-plots');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: [0, -8, 0] }}
      transition={{
        duration: 0.7,
        delay: 0.5,
        ease: [0.16, 1, 0.3, 1],
        repeat: Infinity,
        repeatType: 'reverse',
        repeatDelay: 1.2
      }}
      className="pointer-events-auto fixed bottom-4 right-4 z-20 max-w-xs rounded-3xl border border-white/60 bg-white/80 p-3 text-slate-900 shadow-soft-2xl backdrop-blur-md sm:bottom-6 sm:right-6 sm:p-4"
    >
      <div className="flex items-start gap-3">
        <div className="mt-0.5 h-7 w-7 flex-none rounded-full bg-gradient-to-tr from-brand-500 to-emerald-400 shadow-md shadow-emerald-400/40" />
        <div className="space-y-2 text-sm">
          <div className="flex items-start justify-between gap-3">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
              Welcome
            </p>
            <button
              type="button"
              onClick={() => setVisible(false)}
              className="ml-2 flex h-5 w-5 items-center justify-center rounded-full bg-slate-900/5 text-[11px] text-slate-500 transition hover:bg-slate-900/10 hover:text-slate-700"
              aria-label="Dismiss welcome"
            >
              ×
            </button>
          </div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
            {/* Spacer for layout when title wraps */}
          </p>
          <p className="text-sm font-medium text-slate-900">
            Explore curated land picks handpicked for growth this decade.
          </p>
          <button
            type="button"
            onClick={handleScrollToFeatured}
            className="inline-flex items-center gap-1.5 rounded-full bg-slate-900 px-3 py-1.5 text-xs font-semibold text-slate-50 shadow-sm shadow-slate-900/40 transition hover:bg-slate-800"
          >
            Jump to featured plots
            <span aria-hidden>↓</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
};

const ContactGrid: React.FC = () => {
  const whatsappMessage =
    "Hi, I saw a listing on your Land Platform and I'd like more details.";
  const whatsappHref = `https://wa.me/?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <section className="mt-10 w-full rounded-3xl border border-slate-800/70 bg-slate-950/60 p-4 text-sm text-slate-200 shadow-soft-2xl backdrop-blur-xl sm:mt-12 sm:p-5">
      <div className="flex items-center justify-between gap-2">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
            Talk to our team
          </p>
          <p className="mt-1 text-xs text-slate-400 sm:text-sm">
            Reach out on your preferred channel for fast answers about any plot.
          </p>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <a
          href={whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center gap-2 rounded-2xl bg-emerald-500/10 px-3 py-2 text-xs font-medium text-emerald-100 ring-1 ring-emerald-500/40 transition hover:bg-emerald-500/20 hover:text-emerald-50 hover:ring-emerald-400 sm:text-sm"
        >
          <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/40">
            <MessageCircle className="h-3.5 w-3.5" />
          </span>
          <span className="flex-1 text-left">WhatsApp</span>
        </a>

        <a
          href="https://instagram.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center gap-2 rounded-2xl bg-pink-500/5 px-3 py-2 text-xs font-medium text-pink-100 ring-1 ring-pink-500/30 transition hover:bg-pink-500/15 hover:text-pink-50 hover:ring-pink-400 sm:text-sm"
        >
          <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-gradient-to-tr from-pink-500 to-amber-400 text-slate-950 shadow-md shadow-pink-500/40">
            <Instagram className="h-3.5 w-3.5" />
          </span>
          <span className="flex-1 text-left">Instagram</span>
        </a>

        <a
          href="https://twitter.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center gap-2 rounded-2xl bg-sky-500/10 px-3 py-2 text-xs font-medium text-sky-100 ring-1 ring-sky-500/40 transition hover:bg-sky-500/20 hover:text-sky-50 hover:ring-sky-400 sm:text-sm"
        >
          <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-sky-500 text-slate-950 shadow-md shadow-sky-500/40">
            <Twitter className="h-3.5 w-3.5" />
          </span>
          <span className="flex-1 text-left">X / Twitter</span>
        </a>

        <a
          href="mailto:hello@landportal.app"
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center gap-2 rounded-2xl bg-slate-800/80 px-3 py-2 text-xs font-medium text-slate-100 ring-1 ring-slate-700 transition hover:bg-slate-700 hover:text-white hover:ring-slate-500 sm:text-sm"
        >
          <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-slate-950 text-slate-50 shadow-md shadow-slate-950/40">
            <Mail className="h-3.5 w-3.5" />
          </span>
          <span className="flex-1 text-left">Email</span>
        </a>
      </div>
    </section>
  );
};

const SellForm: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = React.useState(1);
  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState<string | null>(null);
  const [state, setState] = React.useState<SellFormState>({
    ownerName: '',
    ownerEmail: '',
    ownerPhone: '',
    parcelName: '',
    location: '',
    size: '',
    description: '',
    neighborhoodScore: 7,
    mediaFile: null
  });

  const onChange =
    (field: keyof SellFormState) =>
    (value: string | number | File | null): void => {
      setState(prev => ({
        ...prev,
        [field]: value
      }));
    };

  const handleNext = () => {
    setStep(prev => Math.min(prev + 1, 3));
  };

  const handleBack = () => {
    setStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      if (!supabase) {
        throw new Error('Supabase is not configured.');
      }

      let publicUrl: string | null = null;

      if (state.mediaFile) {
        const fileExt = state.mediaFile.name.split('.').pop() ?? 'jpg';
        const filePath = `plots/${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from('plots-media')
          .upload(filePath, state.mediaFile);

        if (uploadError) {
          throw uploadError;
        }

        const { data: publicData } = supabase.storage.from('plots-media').getPublicUrl(filePath);
        publicUrl = publicData?.publicUrl ?? null;
      }

      const { error: insertError } = await supabase.from('plots').insert({
        name: state.parcelName,
        location: state.location,
        size: state.size,
        price: 'TBD',
        tag: 'New submission',
        description: state.description,
        neighborhood_score: state.neighborhoodScore,
        owner_name: state.ownerName,
        owner_email: state.ownerEmail,
        owner_phone: state.ownerPhone,
        image_url: publicUrl,
        is_verified: false
      });

      if (insertError) {
        throw insertError;
      }

      setSuccess('Thanks! Your land listing was submitted for review.');
      setStep(1);
      setState(prev => ({
        ...prev,
        parcelName: '',
        location: '',
        size: '',
        description: '',
        neighborhoodScore: 7,
        mediaFile: null
      }));

      setTimeout(() => {
        navigate('/');
      }, 1800);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Error submitting land listing', err);
      setError('Something went wrong submitting your land. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="mx-auto max-w-3xl rounded-3xl border border-slate-200 dark:border-slate-800/70 bg-white dark:bg-slate-950/60 p-5 text-sm text-slate-900 dark:text-slate-100 shadow-soft-2xl backdrop-blur-xl sm:p-7">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
            List your land
          </p>
          <h1 className="mt-2 text-xl font-semibold tracking-tight text-slate-900 dark:text-white sm:text-2xl">
            Share your parcel with vetted buyers.
          </h1>
        </div>
        <div className="hidden text-right text-[11px] text-slate-400 sm:block">
          <p>Three quick steps</p>
          <p>
            Step {step} of 3
          </p>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-2 text-[11px] text-slate-400 sm:text-xs">
        {[1, 2, 3].map(idx => (
          <div
            key={idx}
            className={`h-1.5 flex-1 rounded-full bg-slate-800 ${
              idx <= step ? 'bg-emerald-400' : ''
            }`}
          />
        ))}
      </div>

      <form onSubmit={handleSubmit} className="mt-6 space-y-6">
        {step === 1 && (
          <div className="space-y-4">
            <h2 className="text-sm font-semibold text-slate-900 dark:text-white">Step 1 · Basic info</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="text-xs font-medium text-slate-600 dark:text-slate-400">Your name</label>
                <input
                  type="text"
                  required
                  value={state.ownerName}
                  onChange={e => onChange('ownerName')(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900/80 px-3 py-2 text-base text-slate-900 dark:text-white placeholder:text-slate-500 focus:border-brand-400 focus:outline-none sm:text-sm"
                  placeholder="Jane Doe"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-600 dark:text-slate-400">Email</label>
                <input
                  type="email"
                  required
                  value={state.ownerEmail}
                  onChange={e => onChange('ownerEmail')(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900/80 px-3 py-2 text-base text-slate-900 dark:text-white placeholder:text-slate-500 focus:border-brand-400 focus:outline-none sm:text-sm"
                  placeholder="you@example.com"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-600 dark:text-slate-400">Phone / WhatsApp</label>
                <input
                  type="tel"
                  value={state.ownerPhone}
                  onChange={e => onChange('ownerPhone')(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900/80 px-3 py-2 text-base text-slate-900 dark:text-white placeholder:text-slate-500 focus:border-brand-400 focus:outline-none sm:text-sm"
                  placeholder="+1 555 000 0000"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-600 dark:text-slate-400">Parcel name</label>
                <input
                  type="text"
                  required
                  value={state.parcelName}
                  onChange={e => onChange('parcelName')(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900/80 px-3 py-2 text-base text-slate-900 dark:text-white placeholder:text-slate-500 focus:border-brand-400 focus:outline-none sm:text-sm"
                  placeholder="Cedar Ridge Homestead"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-600 dark:text-slate-400">Location</label>
                <input
                  type="text"
                  required
                  value={state.location}
                  onChange={e => onChange('location')(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900/80 px-3 py-2 text-sm text-slate-900 dark:text-white placeholder:text-slate-500 focus:border-brand-400 focus:outline-none"
                  placeholder="City / region"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-600 dark:text-slate-400">Size</label>
                <input
                  type="text"
                  required
                  value={state.size}
                  onChange={e => onChange('size')(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900/80 px-3 py-2 text-sm text-slate-900 dark:text-white placeholder:text-slate-500 focus:border-brand-400 focus:outline-none"
                  placeholder="e.g. 2.5 acres"
                />
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
              Step 2 · Description & neighborhood
            </h2>
            <div>
              <label className="text-xs font-medium text-slate-600 dark:text-slate-400">Describe your land</label>
              <textarea
                required
                value={state.description}
                onChange={e => onChange('description')(e.target.value)}
                rows={4}
                className="mt-1 w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900/80 px-3 py-2 text-base text-slate-900 dark:text-white placeholder:text-slate-500 focus:border-brand-400 focus:outline-none sm:text-sm"
                placeholder="Access, zoning, utilities, topography, nearby landmarks..."
              />
            </div>
            <div>
              <label className="flex items-center justify-between text-xs font-medium text-slate-300">
                Neighborhood score
                <span className="text-[11px] text-slate-400">
                  {state.neighborhoodScore} / 10
                </span>
              </label>
              <input
                type="range"
                min={1}
                max={10}
                value={state.neighborhoodScore}
                onChange={e => onChange('neighborhoodScore')(Number(e.target.value))}
                className="mt-2 w-full"
              />
              <p className="mt-1 text-[11px] text-slate-500">
                Rate access, schools, amenities, and general feel of the area.
              </p>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <h2 className="text-sm font-semibold text-slate-900 dark:text-white">Step 3 · Media upload</h2>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Add a hero image or short drone clip. We&apos;ll store this securely and use it on
              your listing.
            </p>
            <div>
              <label className="text-xs font-medium text-slate-600 dark:text-slate-400">Image / video</label>
              <input
                type="file"
                accept="image/*,video/*"
                onChange={e => onChange('mediaFile')(e.target.files?.[0] ?? null)}
                className="mt-2 w-full text-xs text-slate-300 file:mr-3 file:rounded-full file:border-0 file:bg-slate-800 file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-slate-100 hover:file:bg-slate-700"
              />
              {state.mediaFile && (
                <p className="mt-1 text-[11px] text-slate-600 dark:text-slate-400">
                  Selected: <span className="font-medium">{state.mediaFile.name}</span>
                </p>
              )}
            </div>
          </div>
        )}

        {error && (
          <div className="rounded-2xl border border-rose-500/40 bg-rose-950/40 p-3 text-xs text-rose-100">
            {error}
          </div>
        )}

        {success && (
          <div className="rounded-2xl border border-emerald-500/40 bg-emerald-950/40 p-3 text-xs text-emerald-100">
            {success}
          </div>
        )}

        <div className="mt-4 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={step === 1 ? () => navigate('/') : handleBack}
            className="h-10 px-4 text-xs text-slate-400 hover:text-slate-200"
          >
            {step === 1 ? 'Cancel' : 'Back'}
          </button>
          <div className="flex items-center gap-3">
            {step < 3 && (
              <button
                type="button"
                onClick={handleNext}
                className="h-10 rounded-full border border-slate-700 px-6 text-xs font-semibold text-slate-200 hover:border-slate-500 hover:bg-slate-800"
              >
                Next
              </button>
            )}
            {step === 3 && (
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex h-10 items-center gap-2 rounded-full bg-gradient-to-tr from-brand-500 to-emerald-400 px-6 text-xs font-semibold text-slate-950 shadow-md shadow-emerald-500/40 transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {submitting ? 'Submitting...' : 'Submit for review'}
              </button>
            )}
          </div>
        </div>
      </form>
    </section>
  );
};

const GetStartedPage: React.FC = () => {
  const containerVariants = {
    hidden: { opacity: 0, y: 24, scale: 0.96 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.7,
        ease: [0.16, 1, 0.3, 1],
        when: 'beforeChildren',
        staggerChildren: 0.12
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  return (
    <motion.section
      className="mx-auto max-w-4xl rounded-3xl border border-slate-800/70 bg-slate-950/60 p-5 text-sm text-slate-100 shadow-soft-2xl backdrop-blur-xl sm:p-7"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
            Get started
          </p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-50 sm:text-3xl">
            How do you want to use LandPortal?
          </h1>
          <p className="mt-2 text-xs text-slate-400 sm:text-sm">
            Choose the path that fits you best. You can always switch later.
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <motion.div
          variants={cardVariants}
          whileHover={{ y: -6, scale: 1.01 }}
          className="group flex flex-col justify-between rounded-2xl border border-slate-800/80 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-950 px-4 py-5 shadow-lg shadow-slate-950/50 transition sm:px-5"
        >
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-300">
              I want to buy
            </p>
            <h2 className="mt-2 text-lg font-semibold text-slate-50">Explore land listings</h2>
            <p className="mt-2 text-xs text-slate-400 sm:text-sm">
              Browse vetted plots with verified title, filters for zoning and utilities, and
              investor-grade details.
            </p>
          </div>
          <div className="mt-4 flex items-center justify-between gap-3">
            <div className="flex -space-x-2">
              <div className="h-7 w-7 rounded-full border border-slate-950 bg-cover bg-center bg-[url('https://images.pexels.com/photos/1181519/pexels-photo-1181519.jpeg?auto=compress&cs=tinysrgb&w=120')]"></div>
              <div className="h-7 w-7 rounded-full border border-slate-950 bg-cover bg-center bg-[url('https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&w=120')]"></div>
            </div>
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 rounded-full bg-slate-50 px-4 py-1.5 text-xs font-semibold text-slate-950 shadow-md shadow-slate-950/40 transition group-hover:bg-slate-200"
            >
              Start as buyer
              <span aria-hidden>→</span>
            </Link>
          </div>
        </motion.div>

        <motion.div
          variants={cardVariants}
          whileHover={{ y: -6, scale: 1.01 }}
          className="group flex flex-col justify-between rounded-2xl border border-emerald-500/30 bg-gradient-to-br from-emerald-900/40 via-slate-950 to-slate-950 px-4 py-5 shadow-lg shadow-emerald-500/30 transition sm:px-5"
        >
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-300">
              I want to sell
            </p>
            <h2 className="mt-2 text-lg font-semibold text-slate-50">List my land</h2>
            <p className="mt-2 text-xs text-slate-400 sm:text-sm">
              Submit your parcel with title details, neighborhood context and media. Our team
              reviews every listing.
            </p>
          </div>
          <div className="mt-4 flex items-center justify-between gap-3">
            <span className="text-[11px] text-emerald-200">
              Typically approved within 24–72 hours.
            </span>
            <Link
              to="/sell"
              className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-tr from-brand-500 to-emerald-400 px-4 py-1.5 text-xs font-semibold text-slate-950 shadow-md shadow-emerald-500/40 transition group-hover:brightness-110"
            >
              Start as seller
              <span aria-hidden>→</span>
            </Link>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
};
const AdminPage: React.FC = () => {
  const [authed, setAuthed] = React.useState(false);
  const [authLoading, setAuthLoading] = React.useState(true);
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [authError, setAuthError] = React.useState<string | null>(null);

  const [plots, setPlots] = React.useState<Plot[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [editingPriceId, setEditingPriceId] = React.useState<number | null>(null);
  const [priceDraft, setPriceDraft] = React.useState('');

  const fetchPlots = React.useCallback(async () => {
    if (!supabase) {
      setError('Supabase is not configured.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const { data, error: supabaseError } = await supabase
        .from('plots')
        .select('id, name, location, size, price, tag, image_url, is_verified')
        .order('id', { ascending: false });

      if (supabaseError) throw supabaseError;
      setPlots((data as Plot[]) ?? []);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Error loading admin plots', err);
      setError('Failed to load listings.');
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    const init = async () => {
      if (!supabase) {
        setAuthLoading(false);
        return;
      }
      try {
        const { data } = await supabase.auth.getUser();
        if (data.user) {
          setAuthed(true);
          await fetchPlots();
        }
      } finally {
        setAuthLoading(false);
      }
    };
    void init();
  }, [fetchPlots]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) {
      setAuthError('Supabase is not configured.');
      return;
    }

    try {
      setAuthLoading(true);
      setAuthError(null);
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      if (signInError) throw signInError;
      setAuthed(true);
      await fetchPlots();
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Admin login failed', err);
      setAuthError('Invalid credentials or login failed.');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleToggleVerified = async (plot: Plot) => {
    if (!supabase || plot.id == null) return;
    const next = !plot.is_verified;

    setPlots(prev =>
      prev.map(p => (p.id === plot.id ? { ...p, is_verified: next } : p))
    );

    const { error: updateError } = await supabase
      .from('plots')
      .update({ is_verified: next })
      .eq('id', plot.id);

    if (updateError) {
      // revert on failure
      setPlots(prev =>
        prev.map(p => (p.id === plot.id ? { ...p, is_verified: plot.is_verified } : p))
      );
    }
  };

  const startEditingPrice = (plot: Plot) => {
    setEditingPriceId(plot.id);
    setPriceDraft(plot.price);
  };

  const savePrice = async () => {
    if (!supabase || editingPriceId == null) return;
    const id = editingPriceId;
    const newPrice = priceDraft.trim();
    setEditingPriceId(null);

    const original = plots.find(p => p.id === id);
    setPlots(prev =>
      prev.map(p => (p.id === id ? { ...p, price: newPrice || p.price } : p))
    );

    const { error: updateError } = await supabase
      .from('plots')
      .update({ price: newPrice || original?.price })
      .eq('id', id);

    if (updateError && original) {
      setPlots(prev => prev.map(p => (p.id === id ? original : p)));
    }
  };

  const handleDelete = async (plot: Plot) => {
    if (!supabase || plot.id == null) return;
    const confirmed = window.confirm(
      `Delete listing "${plot.name}"? This action cannot be undone.`
    );
    if (!confirmed) return;

    const original = plots;
    setPlots(prev => prev.filter(p => p.id !== plot.id));

    const { error: deleteError } = await supabase
      .from('plots')
      .delete()
      .eq('id', plot.id);

    if (deleteError) {
      setPlots(original);
    }
  };

  if (authLoading) {
    return (
      <section className="mx-auto max-w-xl rounded-3xl border border-slate-800/70 bg-slate-950/60 p-6 text-sm text-slate-100 shadow-soft-2xl backdrop-blur-xl">
        <p className="text-xs text-slate-400">Checking admin session…</p>
      </section>
    );
  }

  if (!authed) {
    return (
      <section className="mx-auto max-w-xl rounded-3xl border border-slate-800/70 bg-slate-950/60 p-6 text-sm text-slate-100 shadow-soft-2xl backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-slate-900">
            <Lock className="h-4 w-4 text-slate-300" />
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
              Admin
            </p>
            <h1 className="text-lg font-semibold text-slate-50">Sign in to manage listings</h1>
          </div>
        </div>

        <form onSubmit={handleLogin} className="mt-5 space-y-4">
          <div>
            <label className="text-xs font-medium text-slate-300">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-900/80 px-3 py-2 text-sm text-slate-50 placeholder:text-slate-500 focus:border-brand-400 focus:outline-none"
              placeholder="admin@example.com"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-300">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-900/80 px-3 py-2 text-base text-slate-50 placeholder:text-slate-500 focus:border-brand-400 focus:outline-none sm:text-sm"
              placeholder="••••••••"
            />
          </div>
          {authError && (
            <div className="rounded-2xl border border-rose-500/40 bg-rose-950/40 p-3 text-xs text-rose-100">
              {authError}
            </div>
          )}
          <button
            type="submit"
            disabled={authLoading}
            className="inline-flex items-center gap-2 rounded-full bg-slate-50 px-5 py-2 text-xs font-semibold text-slate-950 shadow-md shadow-slate-950/40 transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {authLoading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
        <p className="mt-4 text-[11px] text-slate-500">
          Configure admin users via Supabase Auth. This gate is intentionally simple and should be
          combined with database Row Level Security for production.
        </p>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-5xl rounded-3xl border border-slate-800/70 bg-slate-950/60 p-5 text-sm text-slate-100 shadow-soft-2xl backdrop-blur-xl sm:p-7">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
            Admin · Listings
          </p>
          <h1 className="mt-1 text-xl font-semibold tracking-tight text-slate-50 sm:text-2xl">
            Review and verify plots
          </h1>
        </div>
        <button
          type="button"
          onClick={fetchPlots}
          className="hidden rounded-full border border-slate-700 px-3 py-1.5 text-xs font-semibold text-slate-200 hover:border-slate-500 hover:bg-slate-800 sm:inline-flex"
        >
          Refresh
        </button>
      </div>

      {error && (
        <div className="mt-4 rounded-2xl border border-rose-500/40 bg-rose-950/40 p-3 text-xs text-rose-100">
          {error}
        </div>
      )}

      <div className="mt-5 overflow-x-auto rounded-2xl border border-slate-800/80 bg-slate-950/60">
        <table className="min-w-full text-left text-xs text-slate-300 sm:text-sm">
          <thead className="bg-slate-900/80 text-[11px] uppercase tracking-[0.16em] text-slate-500">
            <tr>
              <th className="px-3 py-2">Parcel</th>
              <th className="px-3 py-2">Location</th>
              <th className="px-3 py-2">Size</th>
              <th className="px-3 py-2">Price</th>
              <th className="px-3 py-2">Verified</th>
              <th className="px-3 py-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={6} className="px-3 py-4 text-xs text-slate-400">
                  Loading listings…
                </td>
              </tr>
            )}

            {!loading &&
              plots.map(plot => (
                <tr key={plot.id} className="border-t border-slate-800/80">
                  <td className="px-3 py-2">
                    <div className="flex flex-col">
                      <span className="font-medium text-slate-100">{plot.name}</span>
                      {plot.tag && (
                        <span className="text-[11px] text-slate-500">{plot.tag}</span>
                      )}
                    </div>
                  </td>
                  <td className="px-3 py-2 text-slate-300">{plot.location}</td>
                  <td className="px-3 py-2 text-slate-300">{plot.size}</td>
                  <td className="px-3 py-2">
                    {editingPriceId === plot.id ? (
                      <input
                        autoFocus
                        value={priceDraft}
                        onChange={e => setPriceDraft(e.target.value)}
                        onBlur={savePrice}
                        onKeyDown={e => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            void savePrice();
                          } else if (e.key === 'Escape') {
                            setEditingPriceId(null);
                          }
                        }}
                        className="w-24 rounded-lg border border-slate-700 bg-slate-900/80 px-2 py-1 text-xs text-slate-50 focus:border-brand-400 focus:outline-none"
                      />
                    ) : (
                      <button
                        type="button"
                        onClick={() => startEditingPrice(plot)}
                        className="inline-flex items-center gap-1 text-xs text-emerald-300 hover:text-emerald-200"
                      >
                        {plot.price}
                        <Edit3 className="h-3 w-3" />
                      </button>
                    )}
                  </td>
                  <td className="px-3 py-2">
                    <button
                      type="button"
                      onClick={() => void handleToggleVerified(plot)}
                      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                        plot.is_verified
                          ? 'bg-emerald-500/10 text-emerald-200 ring-1 ring-emerald-500/40'
                          : 'bg-slate-800 text-slate-300 ring-1 ring-slate-600'
                      }`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          plot.is_verified ? 'bg-emerald-400' : 'bg-slate-500'
                        }`}
                      />
                      {plot.is_verified ? 'Verified' : 'Pending'}
                    </button>
                  </td>
                  <td className="px-3 py-2 text-right">
                    <button
                      type="button"
                      onClick={() => void handleDelete(plot)}
                      className="inline-flex items-center gap-1 rounded-full px-2 py-1 text-[11px] text-rose-300 hover:bg-rose-500/10 hover:text-rose-200"
                    >
                      <Trash2 className="h-3 w-3" />
                      Delete
                    </button>
                  </td>
                </tr>
              ))}

            {!loading && plots.length === 0 && (
              <tr>
                <td colSpan={6} className="px-3 py-4 text-xs text-slate-400">
                  No listings found yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <p className="mt-3 text-[11px] text-slate-500">
        Changes are written directly to the <code className="font-mono">plots</code> table. Make
        sure you protect this route and Supabase project with proper security rules in production.
      </p>
    </section>
  );
};

export default App;
