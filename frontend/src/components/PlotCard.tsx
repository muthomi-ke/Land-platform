import React from 'react';
import { MessageCircle, MapPin } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

export type Plot = {
  id: number;
  name: string;
  location: string;
  size: string;
  price: number | string;
  tag?: string;
  image_url?: string;
  category?: string;
  seller_id?: string | null;
};

type Props = {
  plot: Plot;
  whatsappPhone?: string; // easy to override later per-seller
};

const DEFAULT_WHATSAPP_PHONE = '+254700000000';

export const PlotCard: React.FC<Props> = ({ plot, whatsappPhone = DEFAULT_WHATSAPP_PHONE }) => {
  const onWhatsApp = async () => {
    try {
      if (supabase) {
        // Record lead first
        await supabase.from('leads').insert({
          plot_id: plot.id,
          seller_id: plot.seller_id ?? null
        });
      }
    } catch {
      // ignore lead tracking failures; still open WhatsApp
    } finally {
      const phoneDigits = whatsappPhone.replace(/[^\d]/g, '');
      const msg = `I_am_interested_in_your_plot:_[${plot.name}]`;
      const href = `https://wa.me/${phoneDigits}?text=${encodeURIComponent(msg)}`;
      window.open(href, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <article className="group flex cursor-pointer flex-col overflow-hidden rounded-2xl border border-white/15 bg-white/10 shadow-md shadow-slate-950/40 backdrop-blur-xl transition hover:border-emerald-400/40">
      <div className="relative h-48 w-full overflow-hidden">
        <img
          src={
            plot.image_url ||
            'https://images.pexels.com/photos/5726888/pexels-photo-5726888.jpeg?auto=compress&cs=tinysrgb&w=1200'
          }
          alt={plot.name}
          className="h-full w-full object-cover transition duration-700 group-hover:scale-110 group-hover:brightness-110"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-slate-950/70 via-transparent to-transparent" />
        {(plot.tag || plot.category) && (
          <div className="absolute left-2 top-2 flex flex-wrap gap-2">
            {plot.tag && (
              <span className="rounded-full bg-slate-950/70 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-100 backdrop-blur">
                {plot.tag}
              </span>
            )}
            {plot.category && (
              <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-emerald-100 ring-1 ring-emerald-400/25 backdrop-blur">
                {plot.category}
              </span>
            )}
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="space-y-1">
          <h3 className="line-clamp-1 text-sm font-semibold text-slate-900 dark:text-white">
            {plot.name}
          </h3>
          <p className="flex items-center gap-1 text-[11px] text-slate-600 dark:text-slate-400">
            <MapPin className="h-3 w-3 text-slate-500" />
            {plot.location}
          </p>
        </div>

        <div className="flex items-end justify-between gap-3">
          <div className="text-xs text-slate-500">
            <div className="text-[11px]">Size</div>
            <div className="font-semibold text-slate-900 dark:text-slate-100">{plot.size}</div>
          </div>
          <div className="text-right">
            <div className="text-[11px] text-slate-500">Price (KES)</div>
            <div className="text-sm font-semibold text-emerald-300">
              {typeof plot.price === 'number' ? plot.price.toLocaleString() : plot.price}
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={onWhatsApp}
          className="relative inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-500/15 px-4 py-2 text-sm font-semibold text-emerald-100 ring-1 ring-emerald-400/30 transition hover:bg-emerald-500/25"
        >
          <span className="pointer-events-none absolute inset-0 rounded-2xl opacity-70 blur-md bg-emerald-400/20 animate-pulse" />
          <span className="relative inline-flex items-center gap-2">
            <MessageCircle className="h-4 w-4" />
            Chat on WhatsApp
          </span>
        </button>
        <p className="text-[10px] text-slate-500">
          WhatsApp lead tracking enabled · default number {DEFAULT_WHATSAPP_PHONE}
        </p>
      </div>
    </article>
  );
};


