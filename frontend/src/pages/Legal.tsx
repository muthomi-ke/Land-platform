import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Scale } from 'lucide-react';

export const Legal: React.FC = () => {
  return (
    <div className="mx-auto w-full max-w-5xl space-y-6">
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="rounded-3xl border border-[#FFD37A]/20 bg-slate-950/60 p-6 shadow-soft-2xl backdrop-blur-xl sm:p-8"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#FFD37A]">
              Legal &amp; Terms
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              Legal Disclaimer &amp; Terms of Service
            </h1>
            <p className="mt-3 max-w-3xl text-sm text-slate-300">
              This page contains important disclosures for Land Leverage and Leverage Ventures. Please read carefully.
            </p>
          </div>
          <div className="hidden sm:flex h-12 w-12 items-center justify-center rounded-3xl bg-white/5 ring-1 ring-white/10">
            <Scale className="h-5 w-5 text-[#FFD37A]" />
          </div>
        </div>
      </motion.section>

      <section className="rounded-3xl border border-white/15 bg-slate-950/40 p-6 shadow-soft-2xl backdrop-blur-xl sm:p-8">
        <div className="flex items-center gap-2">
          <Shield className="h-4 w-4 text-[#FFD37A]" />
          <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-[#FFD37A]">
            Essential 2025-ready clauses
          </h2>
        </div>

        <div className="mt-4 space-y-4 text-sm text-slate-200">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 ring-1 ring-white/10">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
              User Responsibility for Due Diligence
            </p>
            <p className="mt-2">
              “Land Leverage is a listing platform. Users are strictly advised to conduct independent searches via
              Ardhisasa and engage licensed surveyors (Standard fees in 2025 range from KES 20,000 – 60,000) before
              payments.”
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 ring-1 ring-white/10">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
              Non-CMA Regulation Disclosure for Ventures
            </p>
            <p className="mt-2">
              “The 30% APR offered under Leverage Ventures refers to private venture debt participation. It is not a
              regulated collective investment scheme under the Capital Markets Authority (CMA).”
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 ring-1 ring-white/10">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
              Accuracy of Listings
            </p>
            <p className="mt-2">
              Land Leverage does not guarantee the completeness or accuracy of listing details. Buyers must confirm
              boundaries, ownership, zoning, rates/rent status, and any encumbrances through official channels before
              making commitments.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 ring-1 ring-white/10">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
              Dispute Resolution via Kenyan Law
            </p>
            <p className="mt-2">
              Any disputes relating to the platform, listings, or user interactions shall be governed by Kenyan law and
              resolved through the appropriate courts/tribunals in Kenya, unless otherwise agreed in writing.
            </p>
          </div>

          <div className="rounded-2xl border border-rose-500/25 bg-rose-500/10 p-4 ring-1 ring-white/10">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-rose-200">
              Seller liability (fraud)
            </p>
            <p className="mt-2 text-rose-100">
              “Sellers warrant that all title documents uploaded to the Due Diligence Vault are authentic. Fraudulent
              listings will be referred to the Directorate of Criminal Investigations (DCI).”
            </p>
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-white/15 bg-slate-950/40 p-6 shadow-soft-2xl backdrop-blur-xl sm:p-8">
        <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-[#FFD37A]">Legal disclaimer</h2>
        <div className="mt-4 space-y-4 text-sm text-slate-200">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 ring-1 ring-white/10">
            <p className="font-semibold text-white">1. No Investment Advice</p>
            <p className="mt-2 text-slate-200">
              The information provided on Land Leverage and Leverage Ventures, including but not limited to investment
              returns (e.g., the 30% APR Lending Pool), is for informational purposes only. It does not constitute
              financial, investment, or legal advice. We recommend that all investors consult with a certified
              financial advisor before committing capital.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 ring-1 ring-white/10">
            <p className="font-semibold text-white">2. Risk of Loss</p>
            <p className="mt-2 text-slate-200">
              High-yield investments, including private lending and venture debt, carry a high level of risk. Past
              performance of funds like Mansa-X or Moran Capital is not indicative of future results. Capital is at
              risk, and you may lose some or all of your invested principal.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 ring-1 ring-white/10">
            <p className="font-semibold text-white">3. Regulatory Disclosure</p>
            <p className="mt-2 text-slate-200">
              Leverage Ventures operates as a private lending group and is not a collective investment scheme regulated
              by the Capital Markets Authority (CMA) of Kenya. By participating, you acknowledge that you are entering
              into a private agreement.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 ring-1 ring-white/10">
            <p className="font-semibold text-white">4. Property Verification</p>
            <p className="mt-2 text-slate-200">
              While Land Leverage provides a “Due Diligence Vault,” the platform does not guarantee the authenticity of
              title deeds or the accuracy of land boundaries. It is the sole responsibility of the buyer to conduct
              independent searches at the relevant Land Registries and engage a licensed surveyor before any
              transaction.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 ring-1 ring-white/10">
            <p className="font-semibold text-white">5. Third-Party Links</p>
            <p className="mt-2 text-slate-200">
              Our site contains links to external services (e.g., Uber, Bolt, IntaSend). Land Leverage is not
              responsible for the content, privacy policies, or service delivery of these third-party providers.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Legal;


