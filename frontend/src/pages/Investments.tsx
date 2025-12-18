import React from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, Sparkles, X } from 'lucide-react';

const WHATSAPP_BOOKING = 'https://wa.me/254700000000?text=' + encodeURIComponent('Hi! I want to book an investment consultation.');

const GlassCard: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
  <div
    className={[
      'rounded-3xl border border-white/15 bg-white/10 shadow-soft-2xl backdrop-blur-xl',
      className ?? ''
    ].join(' ')}
  >
    {children}
  </div>
);

export const Investments: React.FC = () => {
  const [open, setOpen] = React.useState(false);

  return (
    <div className="mx-auto w-full max-w-6xl">
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="rounded-3xl border border-white/15 bg-white/10 p-6 shadow-soft-2xl backdrop-blur-xl sm:p-8"
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-emerald-300">
              Land Leverage · Investments
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
              Premium vehicles for land-backed growth.
            </h1>
            <p className="mt-3 max-w-2xl text-sm text-slate-600 dark:text-slate-400">
              Choose a strategy, match your risk profile, and execute with a partner network built for speed.
              All pricing and projections are communicated in KES.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-tr from-brand-500 to-emerald-400 px-4 py-2 text-xs font-semibold text-slate-950 shadow-md shadow-emerald-500/30 transition hover:brightness-105"
            >
              <Sparkles className="h-4 w-4" />
              Book a Consultation
            </button>
            <a
              href={WHATSAPP_BOOKING}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-emerald-400/25 bg-emerald-500/10 px-4 py-2 text-xs font-semibold text-emerald-100 shadow-soft-2xl backdrop-blur-xl transition hover:bg-emerald-500/15"
            >
              <MessageCircle className="h-4 w-4" />
              WhatsApp booking
            </a>
          </div>
        </div>
      </motion.section>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <GlassCard className="p-6 sm:p-7">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
            Products
          </p>
          <h2 className="mt-2 text-xl font-semibold text-slate-900 dark:text-white">Select an investment product</h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            High-conviction strategies designed for compounding in KES-denominated cashflows.
          </p>

          <div className="mt-5 space-y-3">
            {['Land Flipping', 'Commercial REITs', 'Affordable Housing Projects'].map(item => (
              <div
                key={item}
                className="rounded-2xl border border-white/10 bg-white/10 p-4 ring-1 ring-white/10"
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="font-semibold text-slate-900 dark:text-slate-100">{item}</p>
                  <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-semibold text-slate-600 dark:text-slate-300 ring-1 ring-white/10">
                    KES-first
                  </span>
                </div>
                <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
                  Get matched with a pipeline and underwriting pack. Terms vary by deal.
                </p>
              </div>
            ))}
          </div>
        </GlassCard>

        <GlassCard className="p-6 sm:p-7">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
            Vehicles
          </p>
          <h2 className="mt-2 text-xl font-semibold text-slate-900 dark:text-white">Choose your vehicle</h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            Execution structures for different liquidity needs and timelines.
          </p>

          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            {['Joint Ventures', 'Buy & Hold', 'Fractional Ownership'].map(item => (
              <div
                key={item}
                className="rounded-2xl border border-emerald-400/15 bg-emerald-500/10 p-4 ring-1 ring-white/10"
              >
                <p className="text-sm font-semibold text-emerald-100">{item}</p>
                <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">
                  Structured terms · KES reporting · performance tracking.
                </p>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>

      <div className="mt-8">
        <GlassCard className="p-6 sm:p-7">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
            Testimonials
          </p>
          <h2 className="mt-2 text-xl font-semibold text-slate-900 dark:text-white">Investor stories</h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            A few examples of outcomes from disciplined land strategy execution.
          </p>

          <div className="mt-5 grid gap-3 md:grid-cols-3">
            {[
              {
                name: 'Amina K.',
                story:
                  '“Land Leverage helped me underwrite a buy & hold portfolio. I now track everything in KES with clear milestones.”'
              },
              {
                name: 'Brian M.',
                story:
                  '“We executed a joint venture flip with professional deal docs. The speed and clarity were unmatched.”'
              },
              {
                name: 'Chao W.',
                story:
                  '“Fractional ownership let me start smaller while building confidence. The reporting is clean and consistent.”'
              }
            ].map(t => (
              <div
                key={t.name}
                className="rounded-3xl border border-white/15 bg-white/10 p-5 shadow-soft-2xl backdrop-blur-xl"
              >
                <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{t.story}</p>
                <p className="mt-3 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-300">
                  {t.name}
                </p>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>

      {open && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center px-4">
          <button
            type="button"
            className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
            onClick={() => setOpen(false)}
            aria-label="Close consultation modal"
          />
          <div className="relative w-full max-w-lg rounded-3xl border border-emerald-400/25 bg-white/10 p-6 shadow-2xl shadow-emerald-500/10 backdrop-blur-xl">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                  Consultation
                </p>
                <h3 className="mt-1 text-lg font-semibold text-slate-900 dark:text-white">
                  Book a consultation
                </h3>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                  For now, booking routes to WhatsApp. Swap this link with Calendly anytime.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-white/10 text-slate-200 ring-1 ring-white/10 hover:bg-white/15"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-3">
              <a
                href={WHATSAPP_BOOKING}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-emerald-500/15 px-4 py-2 text-xs font-semibold text-emerald-100 ring-1 ring-emerald-400/30 transition hover:bg-emerald-500/25"
              >
                <MessageCircle className="h-4 w-4" />
                Book via WhatsApp
              </a>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
              >
                Not now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Investments;


