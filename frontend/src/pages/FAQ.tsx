import React from 'react';
import { motion } from 'framer-motion';
import { Mail, MessageCircle, Plus, Search } from 'lucide-react';

type FAQItem = {
  category: string;
  question: string;
  answer: React.ReactNode;
};

const WHATSAPP_HELP =
  'https://wa.me/254722877046?text=' +
  encodeURIComponent('Hi! I have a question about Land Leverage.');
const EMAIL_HELP = 'mailto:gkiriga01@gmail.com';

const items: FAQItem[] = [
  {
    category: 'The Buying Process (Safety First)',
    question: 'How do I verify a title deed?',
    answer: (
      <>
        Use official searches and verification tools before paying. In Kenya, start with an official search through the
        relevant land registry and use platforms like <span className="font-semibold">ArdhiSasa</span> where applicable.
        We strongly recommend engaging a licensed surveyor and an advocate during the process.
      </>
    )
  },
  {
    category: 'The Buying Process (Safety First)',
    question: 'What is the difference between Freehold and Leasehold?',
    answer: (
      <>
        <span className="font-semibold">Freehold</span> typically grants ownership without a fixed term, while{' '}
        <span className="font-semibold">Leasehold</span> grants rights for a defined period (commonly 99 years). For
        foreigners/non-citizens, ownership is generally structured under leasehold arrangements (often the{' '}
        <span className="font-semibold">99-year rule</span>).
      </>
    )
  },
  {
    category: 'The Buying Process (Safety First)',
    question: 'Do I need a lawyer?',
    answer: (
      <>
        It’s highly recommended. A licensed advocate helps with conveyancing: reviewing documents, conducting searches,
        drafting agreements, and ensuring transfer and payments follow Kenyan law.
      </>
    )
  },
  {
    category: 'Payments & Fees',
    question: "How does the 'Verify Plot' payment work?",
    answer: (
      <>
        Verification is initiated via an M-Pesa STK Push through <span className="font-semibold">IntaSend</span>. You
        will receive a prompt on your phone to authorize payment. Once confirmed, the listing can be marked as verified
        (subject to platform checks and payment confirmation).
      </>
    )
  },
  {
    category: 'Payments & Fees',
    question: 'What are the hidden costs of buying land?',
    answer: (
      <ul className="list-disc pl-5">
        <li>
          <span className="font-semibold">Stamp Duty</span>: ~4% urban / 2% rural (Kenya standard guidance)
        </li>
        <li>
          <span className="font-semibold">Legal fees</span>: ~1–2% (varies by advocate and complexity)
        </li>
        <li>
          <span className="font-semibold">Valuation fees</span>: required for certain transfers and tax purposes
        </li>
      </ul>
    )
  },
  {
    category: 'Payments & Fees',
    question: 'Is my payment secure?',
    answer: (
      <>
        Payments are handled through regulated gateways (e.g., M-Pesa via IntaSend). Always confirm paybill/till details
        and avoid off-platform transfers unless guided through verified, documented processes.
      </>
    )
  },
  {
    category: 'Diaspora Special',
    question: 'Can I buy land without being in Kenya?',
    answer: (
      <>
        Yes. Many diaspora buyers use remote verification tools (virtual visits like drone/360 media) and appoint a
        trusted representative using a <span className="font-semibold">Power of Attorney</span> for signing and
        follow-through. Always use official searches and professional support.
      </>
    )
  },
  {
    category: 'Diaspora Special',
    question: 'How do I send money securely for a purchase?',
    answer: (
      <>
        Use formal banking channels and regulated payment rails (bank transfers, M-Pesa, and verified gateways). For
        planning, use the currency converter tools for KES-to-USD/GBP/EUR comparisons and keep clear documentation for
        each transaction step.
      </>
    )
  },
  {
    category: 'Leverage Ventures (The 30% Pool)',
    question: 'Is the 30% return guaranteed?',
    answer: (
      <>
        No. The 30% APR refers to private venture debt participation (e.g., LPO financing and invoice discounting) with
        risk mitigation steps like diversification and collateral, but <span className="font-semibold">capital is at risk</span>.
      </>
    )
  },
  {
    category: 'Leverage Ventures (The 30% Pool)',
    question: 'What is the minimum investment?',
    answer: <>The suggested entry point is <span className="font-semibold text-[#FFD37A]">KES 50,000</span>.</>
  }
];

export const FAQ: React.FC = () => {
  const [query, setQuery] = React.useState('');
  const [openKey, setOpenKey] = React.useState<string | null>(null);

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter(i => {
      const hay = `${i.category} ${i.question}`.toLowerCase();
      return hay.includes(q);
    });
  }, [query]);

  const grouped = React.useMemo(() => {
    const map = new Map<string, FAQItem[]>();
    for (const item of filtered) {
      map.set(item.category, [...(map.get(item.category) ?? []), item]);
    }
    return Array.from(map.entries());
  }, [filtered]);

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6">
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="rounded-3xl border border-white/15 bg-white/10 p-6 shadow-soft-2xl backdrop-blur-xl sm:p-8"
      >
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
          Support
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
          Frequently Asked Questions
        </h1>
        <p className="mt-3 max-w-3xl text-sm text-slate-600 dark:text-slate-400">
          Search answers across buying safety, fees, diaspora workflows, and Leverage Ventures.
        </p>

        <div className="mt-6 flex items-center gap-2 rounded-2xl border border-white/15 bg-white/10 px-3 py-2 ring-1 ring-white/10 focus-within:ring-emerald-400/60">
          <Search className="h-4 w-4 text-slate-500" />
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search FAQs…"
            className="w-full bg-transparent text-sm text-slate-900 placeholder:text-slate-500 focus:outline-none dark:text-white"
          />
        </div>
      </motion.section>

      <div className="space-y-6">
        {grouped.length === 0 && (
          <div className="rounded-3xl border border-white/15 bg-white/10 p-6 text-sm text-slate-600 shadow-soft-2xl backdrop-blur-xl dark:text-slate-300">
            No results for “{query}”.
          </div>
        )}

        {grouped.map(([category, catItems]) => (
          <section key={category} className="rounded-3xl border border-white/15 bg-white/10 p-6 shadow-soft-2xl backdrop-blur-xl sm:p-8">
            <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-[#FFD37A]">
              {category}
            </h2>

            <div className="mt-4 space-y-3">
              {catItems.map(item => {
                const key = `${item.category}::${item.question}`;
                const isOpen = openKey === key;
                return (
                  <div
                    key={key}
                    className="rounded-2xl border border-white/10 bg-white/10 ring-1 ring-white/10"
                  >
                    <button
                      type="button"
                      onClick={() => setOpenKey(isOpen ? null : key)}
                      className="flex w-full items-center justify-between gap-3 px-4 py-4 text-left"
                    >
                      <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                        {item.question}
                      </span>
                      <Plus
                        className={`h-4 w-4 flex-none text-slate-500 transition ${isOpen ? 'rotate-45' : ''}`}
                      />
                    </button>
                    {isOpen && (
                      <div className="px-4 pb-4 text-sm text-slate-600 dark:text-slate-400">
                        {item.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        ))}
      </div>

      <section className="rounded-3xl border border-emerald-400/20 bg-emerald-500/10 p-6 shadow-soft-2xl backdrop-blur-xl sm:p-8">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Still have questions?</h3>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
          Reach out and we’ll guide you through the safest next step.
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <a
            href={WHATSAPP_HELP}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-emerald-500 px-4 py-2 text-xs font-semibold text-slate-950 shadow-md shadow-emerald-500/25 hover:bg-emerald-400"
          >
            <MessageCircle className="h-4 w-4" />
            WhatsApp
          </a>
          <a
            href={EMAIL_HELP}
            className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-semibold text-slate-900 shadow-soft-2xl backdrop-blur-xl transition hover:bg-white/15 dark:text-slate-100"
          >
            <Mail className="h-4 w-4 text-[#FFD37A]" />
            Email
          </a>
        </div>
      </section>
    </div>
  );
};

export default FAQ;


