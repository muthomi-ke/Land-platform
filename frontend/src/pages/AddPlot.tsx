import React from 'react';
import type { Session } from '@supabase/supabase-js';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

type Props = {
  session: Session | null;
};

type FormState = {
  title: string;
  location: string;
  priceKes: string;
  sizeAcres: string;
  imageFile: File | null;
  category: 'Residential' | 'Agricultural' | 'Commercial' | 'Investment';
};

const defaultState: FormState = {
  title: '',
  location: '',
  priceKes: '',
  sizeAcres: '',
  imageFile: null,
  category: 'Residential'
};

export const AddPlot: React.FC<Props> = ({ session }) => {
  const navigate = useNavigate();

  const [state, setState] = React.useState<FormState>(defaultState);
  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState<string | null>(null);

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

      let publicUrl: string | null = null;

      if (state.imageFile) {
        const fileExt = state.imageFile.name.split('.').pop() ?? 'jpg';
        const filePath = `plots/${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from('plots-media')
          .upload(filePath, state.imageFile);

        if (uploadError) throw uploadError;

        const { data: publicData } = supabase.storage.from('plots-media').getPublicUrl(filePath);
        publicUrl = publicData?.publicUrl ?? null;
      }

      const { error: insertError } = await supabase.from('plots').insert({
        name: state.title,
        location: state.location,
        price,
        size: `${state.sizeAcres} acres`,
        image_url: publicUrl,
        seller_id: session.user.id,
        category: state.category,
        tag: 'New listing',
        is_verified: false
      });

      if (insertError) throw insertError;

      setSuccess('Listing created! Redirecting…');
      setState(defaultState);

      setTimeout(() => {
        navigate('/');
      }, 1200);
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
            <label className="text-xs font-medium text-slate-600 dark:text-slate-300">Image upload</label>
            <input
              type="file"
              accept="image/*"
              onChange={e => onChange('imageFile')(e.target.files?.[0] ?? null)}
              className="mt-2 w-full text-xs text-slate-500 file:mr-3 file:rounded-full file:border-0 file:bg-white/10 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-slate-900 hover:file:bg-white/15 dark:text-slate-300 dark:file:text-slate-100"
            />
            {state.imageFile && (
              <p className="mt-1 text-[11px] text-slate-600 dark:text-slate-400">
                Selected: <span className="font-medium">{state.imageFile.name}</span>
              </p>
            )}
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
    </section>
  );
};

export default AddPlot;


