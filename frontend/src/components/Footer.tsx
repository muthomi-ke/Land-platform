import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, MessageCircle, Scale } from 'lucide-react';

const WHATSAPP_HELP =
  'https://wa.me/254722877046?text=' + encodeURIComponent('Hi! I have a question about Land Leverage.');
const EMAIL_HELP = 'mailto:gkiriga01@gmail.com';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-10 rounded-3xl border border-white/15 bg-white/10 p-5 shadow-soft-2xl backdrop-blur-xl sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-slate-900 dark:text-white">Land Leverage</p>
          <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
            Safety-first land discovery, due diligence, and premium investor tooling.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Link
            to="/faq"
            className="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-semibold text-slate-900 shadow-soft-2xl backdrop-blur-xl transition hover:bg-white/15 dark:text-slate-100"
          >
            FAQ
          </Link>
          <Link
            to="/legal"
            className="inline-flex items-center gap-2 rounded-full border border-[#FFD37A]/25 bg-black/30 px-4 py-2 text-xs font-semibold text-[#FFD37A] shadow-soft-2xl backdrop-blur-xl transition hover:bg-black/40"
          >
            <Scale className="h-4 w-4" />
            Disclaimer
          </Link>
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
      </div>

      <div className="mt-4 flex flex-col gap-2 border-t border-white/10 pt-4 text-[11px] text-slate-500 sm:flex-row sm:items-center sm:justify-between">
        <p>© {new Date().getFullYear()} Land Leverage. All rights reserved.</p>
        <p className="text-slate-500">
          <span className="text-[#FFD37A]">Capital at risk</span> · Leverage Ventures is a private lending group.
        </p>
      </div>
    </footer>
  );
};

export default Footer;


