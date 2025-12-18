import React from 'react';
import { MapPin, Search } from 'lucide-react';

export type PlotCategory = 'All' | 'Residential' | 'Agricultural' | 'Commercial' | 'Investment';

export type PlotFilters = {
  location: string;
  minPriceKes: string;
  maxPriceKes: string;
  category: PlotCategory;
};

type Props = {
  filters: PlotFilters;
  onChange: (partial: Partial<PlotFilters>) => void;
  onReset?: () => void;
};

export const FilterBar: React.FC<Props> = ({ filters, onChange, onReset }) => {
  return (
    <div className="mt-8 w-full rounded-3xl border border-white/15 bg-white/10 p-4 shadow-soft-2xl backdrop-blur-xl sm:p-5">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400 sm:text-sm">
          <MapPin className="h-4 w-4 text-brand-400" />
          <span className="font-medium">Search & filter plots</span>
        </div>
        <div className="flex items-center justify-between gap-3 sm:justify-end">
          <span className="rounded-full bg-white/10 px-2 py-1 text-[10px] text-slate-600 dark:text-slate-400 ring-1 ring-white/10 sm:text-[11px]">
            KES · Category · Location
          </span>
          {onReset && (
            <button
              type="button"
              onClick={onReset}
              className="text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      <div className="mt-4 grid gap-3 rounded-2xl bg-white/10 p-3 ring-1 ring-white/10 sm:grid-cols-6 sm:items-end sm:gap-4 sm:p-3.5">
        <div className="sm:col-span-2">
          <label className="text-[11px] font-medium uppercase tracking-[0.12em] text-slate-400">
            Location
          </label>
          <div className="mt-1 flex items-center gap-2 rounded-xl bg-white/10 px-3 py-2 ring-1 ring-white/10 focus-within:ring-brand-400">
            <Search className="h-3.5 w-3.5 text-slate-500" />
            <input
              value={filters.location}
              onChange={e => onChange({ location: e.target.value })}
              placeholder="City, region or coordinates"
              className="w-full bg-transparent text-sm text-slate-900 dark:text-white placeholder:text-slate-500 focus:outline-none"
            />
          </div>
        </div>

        <div className="sm:col-span-2">
          <label className="text-[11px] font-medium uppercase tracking-[0.12em] text-slate-400">
            Category
          </label>
          <select
            value={filters.category}
            onChange={e => onChange({ category: e.target.value as PlotCategory })}
            className="mt-1 w-full rounded-xl bg-white/10 px-3 py-2 text-sm text-slate-900 dark:text-white ring-1 ring-white/10 focus:outline-none focus:ring-2 focus:ring-brand-400/70"
          >
            <option value="All">All</option>
            <option value="Residential">Residential</option>
            <option value="Agricultural">Agricultural</option>
            <option value="Commercial">Commercial</option>
            <option value="Investment">Investment</option>
          </select>
        </div>

        <div>
          <label className="text-[11px] font-medium uppercase tracking-[0.12em] text-slate-400">
            Min (KES)
          </label>
          <input
            inputMode="numeric"
            value={filters.minPriceKes}
            onChange={e => onChange({ minPriceKes: e.target.value })}
            placeholder="Enter amount in KES"
            className="mt-1 w-full rounded-xl bg-white/10 px-3 py-2 text-sm text-slate-900 dark:text-white placeholder:text-slate-500 ring-1 ring-white/10 focus:outline-none focus:ring-2 focus:ring-brand-400/70"
          />
        </div>

        <div>
          <label className="text-[11px] font-medium uppercase tracking-[0.12em] text-slate-400">
            Max (KES)
          </label>
          <input
            inputMode="numeric"
            value={filters.maxPriceKes}
            onChange={e => onChange({ maxPriceKes: e.target.value })}
            placeholder="Enter amount in KES"
            className="mt-1 w-full rounded-xl bg-white/10 px-3 py-2 text-sm text-slate-900 dark:text-white placeholder:text-slate-500 ring-1 ring-white/10 focus:outline-none focus:ring-2 focus:ring-brand-400/70"
          />
        </div>
      </div>
    </div>
  );
};


