import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeftRight, BarChart3, Mail, MessageCircle, ShieldAlert, Sparkles } from 'lucide-react';

const WHATSAPP_CONSULT =
  'https://wa.me/254722877046?text=' +
  encodeURIComponent("I'm_interested_in_the_MMF/Mansa-X_investment_options");
const WHATSAPP_LENDING =
  'https://wa.me/254722877046?text=' +
  encodeURIComponent('I_want_to_join_the_Leverage_Ventures_30%25_Lending_Pool');
const EMAIL_CONTACT = 'mailto:gkiriga01@gmail.com';

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

type TabKey = 'wealth' | 'ventures';

function clampNumber(n: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, n));
}

function formatKes(n: number): string {
  return `KES ${Math.round(n).toLocaleString()}`;
}

function futureValue({
  initial,
  monthly,
  annualReturnPct,
  years
}: {
  initial: number;
  monthly: number;
  annualReturnPct: number;
  years: number;
}): number {
  const r = annualReturnPct / 100 / 12;
  const n = Math.max(0, Math.round(years * 12));
  let fv = initial;
  for (let i = 0; i < n; i++) {
    fv = fv * (1 + r) + monthly;
  }
  return fv;
}

const MiniChart: React.FC<{ points: number[] }> = ({ points }) => {
  const w = 420;
  const h = 120;
  const pad = 10;
  const max = Math.max(...points, 1);
  const min = Math.min(...points, 0);
  const span = Math.max(1, max - min);

  const toX = (i: number) => pad + (i * (w - pad * 2)) / (points.length - 1);
  const toY = (v: number) => h - pad - ((v - min) * (h - pad * 2)) / span;
  const d = points
    .map((v, i) => `${i === 0 ? 'M' : 'L'} ${toX(i).toFixed(1)} ${toY(v).toFixed(1)}`)
    .join(' ');

  return (
    <div className="overflow-hidden rounded-2xl border border-[#FFD37A]/20 bg-black/30 p-3 ring-1 ring-white/10">
      <svg width="100%" viewBox={`0 0 ${w} ${h}`} aria-label="ROI projection chart">
        <defs>
          <linearGradient id="goldLine" x1="0" x2="1">
            <stop offset="0%" stopColor="#FFD37A" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#34D399" stopOpacity="0.9" />
          </linearGradient>
          <linearGradient id="goldFill" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#FFD37A" stopOpacity="0.22" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={`${d} L ${toX(points.length - 1)} ${h - pad} L ${toX(0)} ${h - pad} Z`} fill="url(#goldFill)" />
        <path d={d} fill="none" stroke="url(#goldLine)" strokeWidth="3" />
      </svg>
    </div>
  );
};

export const Investments: React.FC = () => {
  const [tab, setTab] = React.useState<TabKey>('wealth');

  // ROI calculator inputs
  const [initial, setInitial] = React.useState(250_000);
  const [monthly, setMonthly] = React.useState(10_000);
  const [expectedReturn, setExpectedReturn] = React.useState(12.5);

  // Converter inputs
  const [kesAmount, setKesAmount] = React.useState(100_000);
  const rates = React.useMemo(
    () => ({
      USD: 156, // simple “live-style” hardcoded rates (KES per 1 unit)
      GBP: 198,
      EUR: 171
    }),
    []
  );

  return (
    <div className="mx-auto w-full max-w-6xl">
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="rounded-3xl border border-[#FFD37A]/20 bg-white/10 p-6 shadow-soft-2xl backdrop-blur-xl sm:p-8"
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#FFD37A]">
              Land Leverage · Wealth Management
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
              Premium dashboard for KES-first wealth building.
            </h1>
            <p className="mt-3 max-w-2xl text-sm text-slate-600 dark:text-slate-400">
              Compare funds, project your portfolio growth, and book a consultation. All figures and tools default to
              <span className="font-semibold text-slate-900 dark:text-slate-100"> KES</span>.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <a
              href={WHATSAPP_CONSULT}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-tr from-[#FFD37A] to-emerald-300 px-4 py-2 text-xs font-semibold text-slate-950 shadow-md shadow-amber-500/20 transition hover:brightness-105"
            >
              <Sparkles className="h-4 w-4" />
              Book a Consultation
            </a>
            <a
              href={EMAIL_CONTACT}
              className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-semibold text-slate-900 shadow-soft-2xl backdrop-blur-xl transition hover:bg-white/15 dark:text-slate-100"
            >
              <Mail className="h-4 w-4 text-[#FFD37A]" />
              Email
            </a>
          </div>
        </div>

        <div className="mt-6 inline-flex rounded-full bg-black/30 p-1 ring-1 ring-white/10 backdrop-blur">
          <button
            type="button"
            onClick={() => setTab('wealth')}
            className={[
              'rounded-full px-4 py-2 text-xs font-semibold transition',
              tab === 'wealth'
                ? 'bg-white/15 text-slate-900 dark:text-white ring-1 ring-[#FFD37A]/25'
                : 'text-slate-600 hover:bg-white/10 dark:text-slate-300'
            ].join(' ')}
          >
            Wealth Dashboard
          </button>
          <button
            type="button"
            onClick={() => setTab('ventures')}
            className={[
              'rounded-full px-4 py-2 text-xs font-semibold transition',
              tab === 'ventures'
                ? 'bg-white/15 text-slate-900 dark:text-white ring-1 ring-emerald-400/25'
                : 'text-slate-600 hover:bg-white/10 dark:text-slate-300'
            ].join(' ')}
          >
            Leverage Ventures
          </button>
        </div>
      </motion.section>

      {tab === 'wealth' ? (
        <div className="mt-8 grid gap-6">
          {/* Comparative fund review */}
          <div className="grid gap-6 lg:grid-cols-2">
            <GlassCard className="p-6 sm:p-7">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#FFD37A]">
                    Featured Fund
                  </p>
                  <h2 className="mt-2 text-xl font-semibold text-slate-900 dark:text-white">Mansa‑X (Special Fund)</h2>
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                    Global multi-asset strategy (Equities, Forex, Commodities).
                  </p>
                </div>
                <span className="rounded-full bg-[#FFD37A]/10 px-3 py-1 text-[10px] font-semibold text-[#FFD37A] ring-1 ring-[#FFD37A]/25">
                  Aggressive
                </span>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl border border-white/10 bg-white/10 p-4 ring-1 ring-white/10">
                  <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">Return</p>
                  <p className="mt-1 text-lg font-semibold text-emerald-200">~19.56%</p>
                  <p className="mt-1 text-[11px] text-slate-500">Annualized net · Q1 2025</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/10 p-4 ring-1 ring-white/10">
                  <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">Min</p>
                  <p className="mt-1 text-lg font-semibold text-slate-900 dark:text-slate-100">KES 250,000</p>
                  <p className="mt-1 text-[11px] text-slate-500">Minimum investment</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/10 p-4 ring-1 ring-white/10">
                  <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">Vibe</p>
                  <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-slate-100">
                    High-yield global exposure
                  </p>
                  <p className="mt-1 text-[11px] text-slate-500">For the aggressive investor</p>
                </div>
              </div>
            </GlassCard>

            <GlassCard className="p-6 sm:p-7">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#FFD37A]">
                    Featured Fund
                  </p>
                  <h2 className="mt-2 text-xl font-semibold text-slate-900 dark:text-white">Moran Capital (MMF)</h2>
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                    Low-risk, high-liquidity local fund focused on capital preservation.
                  </p>
                </div>
                <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-[10px] font-semibold text-emerald-200 ring-1 ring-emerald-400/25">
                  Conservative
                </span>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl border border-white/10 bg-white/10 p-4 ring-1 ring-white/10">
                  <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">Yield</p>
                  <p className="mt-1 text-lg font-semibold text-emerald-200">~12.5%</p>
                  <p className="mt-1 text-[11px] text-slate-500">Avg effective · mid‑2025</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/10 p-4 ring-1 ring-white/10">
                  <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">Min</p>
                  <p className="mt-1 text-lg font-semibold text-slate-900 dark:text-slate-100">KES 5,000</p>
                  <p className="mt-1 text-[11px] text-slate-500">Provider-dependent (5k–10k)</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/10 p-4 ring-1 ring-white/10">
                  <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">Vibe</p>
                  <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-slate-100">
                    Safe, steady growth
                  </p>
                  <p className="mt-1 text-[11px] text-slate-500">Daily compounding focus</p>
                </div>
              </div>
            </GlassCard>
          </div>

          {/* Tools */}
          <div className="grid gap-6 lg:grid-cols-5">
            <GlassCard className="p-6 sm:p-7 lg:col-span-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                    ROI Calculator
                  </p>
                  <h3 className="mt-2 text-lg font-semibold text-slate-900 dark:text-white">
                    Projected wealth (KES)
                  </h3>
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                    Adjust inputs to model 1, 5 and 10-year projections.
                  </p>
                </div>
                <BarChart3 className="h-5 w-5 text-[#FFD37A]" />
              </div>

              <div className="mt-5 grid gap-4 sm:grid-cols-3">
                <div>
                  <label className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                    Initial (KES)
                  </label>
                  <input
                    type="range"
                    min={5_000}
                    max={5_000_000}
                    step={5_000}
                    value={initial}
                    onChange={e => setInitial(Number(e.target.value))}
                    className="mt-2 w-full"
                  />
                  <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-slate-100">
                    {formatKes(initial)}
                  </p>
                </div>
                <div>
                  <label className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                    Monthly top‑up (KES)
                  </label>
                  <input
                    type="range"
                    min={0}
                    max={500_000}
                    step={1_000}
                    value={monthly}
                    onChange={e => setMonthly(Number(e.target.value))}
                    className="mt-2 w-full"
                  />
                  <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-slate-100">
                    {formatKes(monthly)}
                  </p>
                </div>
                <div>
                  <label className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                    Expected return (%)
                  </label>
                  <input
                    type="range"
                    min={5}
                    max={30}
                    step={0.25}
                    value={expectedReturn}
                    onChange={e => setExpectedReturn(Number(e.target.value))}
                    className="mt-2 w-full"
                  />
                  <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-slate-100">
                    {expectedReturn.toFixed(2)}%
                  </p>
                </div>
              </div>

              {(() => {
                const v1 = futureValue({ initial, monthly, annualReturnPct: expectedReturn, years: 1 });
                const v5 = futureValue({ initial, monthly, annualReturnPct: expectedReturn, years: 5 });
                const v10 = futureValue({ initial, monthly, annualReturnPct: expectedReturn, years: 10 });
                const points = [0, 1, 2, 3, 4, 5, 7, 10].map(y =>
                  futureValue({ initial, monthly, annualReturnPct: expectedReturn, years: y })
                );

                return (
                  <div className="mt-6 grid gap-4">
                    <MiniChart points={points} />
                    <div className="grid gap-3 sm:grid-cols-3">
                      <div className="rounded-2xl border border-white/10 bg-white/10 p-4 ring-1 ring-white/10">
                        <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">1 year</p>
                        <p className="mt-1 text-lg font-semibold text-emerald-200">{formatKes(v1)}</p>
                      </div>
                      <div className="rounded-2xl border border-white/10 bg-white/10 p-4 ring-1 ring-white/10">
                        <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">5 years</p>
                        <p className="mt-1 text-lg font-semibold text-emerald-200">{formatKes(v5)}</p>
                      </div>
                      <div className="rounded-2xl border border-white/10 bg-white/10 p-4 ring-1 ring-white/10">
                        <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">10 years</p>
                        <p className="mt-1 text-lg font-semibold text-emerald-200">{formatKes(v10)}</p>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </GlassCard>

            <GlassCard className="p-6 sm:p-7 lg:col-span-2">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                    Currency Converter
                  </p>
                  <h3 className="mt-2 text-lg font-semibold text-slate-900 dark:text-white">
                    KES → USD/GBP/EUR
                  </h3>
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                    Simple reference rates (hardcoded) for planning.
                  </p>
                </div>
                <ArrowLeftRight className="h-5 w-5 text-[#FFD37A]" />
              </div>

              <div className="mt-5 space-y-3">
                <div>
                  <label className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                    Amount (KES)
                  </label>
                  <input
                    inputMode="numeric"
                    value={kesAmount}
                    onChange={e => setKesAmount(clampNumber(Number(e.target.value || 0), 0, 1_000_000_000))}
                    placeholder="Enter amount in KES"
                    className="mt-2 w-full rounded-2xl border border-white/10 bg-white/10 px-3 py-2 text-sm text-slate-900 ring-1 ring-white/10 focus:outline-none focus:ring-2 focus:ring-[#FFD37A]/40 dark:text-white"
                  />
                </div>

                <div className="grid gap-3">
                  {(['USD', 'GBP', 'EUR'] as const).map(code => (
                    <div key={code} className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/10 p-4 ring-1 ring-white/10">
                      <div>
                        <p className="text-xs font-semibold text-slate-900 dark:text-slate-100">{code}</p>
                        <p className="text-[11px] text-slate-500">Rate: {rates[code]} KES</p>
                      </div>
                      <p className="text-sm font-semibold text-emerald-200">
                        {(kesAmount / rates[code]).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </GlassCard>
          </div>
        </div>
      ) : (
        <div className="mt-8 grid gap-6">
          <GlassCard className="p-6 sm:p-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-emerald-300">
                  Leverage Ventures
                </p>
                <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900 dark:text-white">
                  Earn <span className="text-emerald-300">30% APR</span> through Venture Debt
                </h2>
                <p className="mt-3 max-w-3xl text-sm text-slate-600 dark:text-slate-400">
                  Funds are pooled to provide short-term working capital (LPO financing and Invoice Discounting) to verified Kenyan SMEs.
                  Interest is paid quarterly or at the end of the 12‑month term.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <a
                  href={WHATSAPP_LENDING}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-emerald-500 px-4 py-2 text-xs font-semibold text-slate-950 shadow-md shadow-emerald-500/25 hover:bg-emerald-400"
                >
                  <MessageCircle className="h-4 w-4" />
                  Join the Lending Group
                </a>
                <a
                  href={EMAIL_CONTACT}
                  className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-semibold text-slate-900 shadow-soft-2xl backdrop-blur-xl transition hover:bg-white/15 dark:text-slate-100"
                >
                  <Mail className="h-4 w-4 text-[#FFD37A]" />
                  Email
                </a>
              </div>
            </div>
          </GlassCard>

          <div className="grid gap-6 lg:grid-cols-3">
            <GlassCard className="p-6 sm:p-7 lg:col-span-2">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                The Math
              </p>
              <h3 className="mt-2 text-xl font-semibold text-slate-900 dark:text-white">
                Fixed 30% annualized return (KES)
              </h3>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                Select an amount to see a simple 12‑month projection.
              </p>

              {(() => {
                const [amt, setAmt] = React.useState(250_000);
                const gain = amt * 0.3;
                const total = amt + gain;
                return (
                  <div className="mt-5 space-y-4">
                    <div>
                      <label className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                        Amount (KES)
                      </label>
                      <input
                        type="range"
                        min={50_000}
                        max={5_000_000}
                        step={10_000}
                        value={amt}
                        onChange={e => setAmt(Number(e.target.value))}
                        className="mt-2 w-full"
                      />
                      <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-sm">
                        <span className="font-semibold text-slate-900 dark:text-slate-100">{formatKes(amt)}</span>
                        <span className="font-semibold text-emerald-300">+{formatKes(gain)} (30%)</span>
                        <span className="font-semibold text-slate-900 dark:text-slate-100">={formatKes(total)}</span>
                      </div>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-3">
                      <div className="rounded-2xl border border-white/10 bg-white/10 p-4 ring-1 ring-white/10">
                        <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">Term</p>
                        <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-slate-100">12 months</p>
                      </div>
                      <div className="rounded-2xl border border-white/10 bg-white/10 p-4 ring-1 ring-white/10">
                        <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">Payout</p>
                        <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-slate-100">
                          Quarterly or end-term
                        </p>
                      </div>
                      <div className="rounded-2xl border border-white/10 bg-white/10 p-4 ring-1 ring-white/10">
                        <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">APR</p>
                        <p className="mt-1 text-sm font-semibold text-emerald-300">30%</p>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </GlassCard>

            <GlassCard className="p-6 sm:p-7">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                    Trust &amp; Security
                  </p>
                  <h3 className="mt-2 text-xl font-semibold text-slate-900 dark:text-white">
                    Risk mitigation
                  </h3>
                </div>
                <ShieldAlert className="h-5 w-5 text-[#FFD37A]" />
              </div>

              <div className="mt-5 space-y-3">
                <div className="rounded-2xl border border-white/10 bg-white/10 p-4 ring-1 ring-white/10">
                  <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">Diversification</p>
                  <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
                    Funds are spread across 10+ different lending groups.
                  </p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/10 p-4 ring-1 ring-white/10">
                  <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">Collateral</p>
                  <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
                    Loans backed by government LPOs or verified corporate invoices.
                  </p>
                </div>
                <div className="rounded-2xl border border-rose-500/20 bg-rose-500/10 p-4 ring-1 ring-white/10">
                  <p className="text-sm font-semibold text-rose-100">Disclaimer</p>
                  <p className="mt-1 text-xs text-rose-100/90">
                    High-yield investments carry higher risk. Not regulated by the CMA. Capital at risk.
                  </p>
                </div>
              </div>
            </GlassCard>
          </div>
        </div>
      )}
    </div>
  );
};

export default Investments;


