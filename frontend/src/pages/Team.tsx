import React from 'react';
import { motion } from 'framer-motion';
import { Linkedin, Twitter } from 'lucide-react';

type Member = {
  name: string;
  title: string;
  highlight: string;
  linkedin?: string;
  twitter?: string;
};

const members: Member[] = [
  {
    name: 'Gideon Kiriga',
    title: 'Managing Director (MD)',
    highlight:
      'Strategic leadership and vision for Land Leverage. Focused on partnership growth and market expansion.',
    linkedin: '#',
    twitter: '#'
  },
  {
    name: 'Rohi Muthomi',
    title: 'Lead Developer',
    highlight:
      'Architecture and frontend innovation. Ensuring a seamless, glassmorphic user experience across all platforms.',
    linkedin: '#',
    twitter: '#'
  },
  {
    name: 'Caleb Micheni',
    title: 'Senior Backend Engineer',
    highlight:
      'Data security, API integrations, and robust system architecture. Managing the Supabase and payment backend.',
    linkedin: '#',
    twitter: '#'
  },
  {
    name: 'Barnabas',
    title: 'Lead Backend Consultant',
    highlight:
      'Specialist in high-scale system architecture and secure database management. Providing strategic technical oversight for thousands of concurrent listings and secure due-diligence transfers.',
    linkedin: '#',
    twitter: '#'
  }
];

const SocialIconLink: React.FC<{ href?: string; label: string; children: React.ReactNode }> = ({
  href,
  label,
  children
}) => {
  const disabled = !href || href === '#';
  return (
    <a
      href={disabled ? undefined : href}
      aria-label={label}
      target={disabled ? undefined : '_blank'}
      rel={disabled ? undefined : 'noopener noreferrer'}
      className={`inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-white/15 bg-white/10 text-slate-900 shadow-soft-2xl backdrop-blur-xl transition hover:bg-white/15 dark:text-slate-100 ${
        disabled ? 'opacity-50 pointer-events-none' : ''
      }`}
    >
      {children}
    </a>
  );
};

export const Team: React.FC = () => {
  return (
    <div className="mx-auto w-full max-w-6xl space-y-6">
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="rounded-3xl border border-white/15 bg-white/10 p-6 shadow-soft-2xl backdrop-blur-xl sm:p-8"
      >
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
          Land Leverage · Team
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
          Leadership & Engineering
        </h1>
        <p className="mt-3 max-w-3xl text-sm text-slate-600 dark:text-slate-400">
          A compact team built for trust: strategic leadership, premium product craft, and secure backend execution.
        </p>
      </motion.section>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {members.map((m, idx) => (
          <motion.article
            key={m.name}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 + idx * 0.05, duration: 0.55 }}
            className="group overflow-hidden rounded-3xl border border-white/15 bg-white/10 shadow-soft-2xl backdrop-blur-xl"
          >
            {/* Headshot placeholder */}
            <div className="relative h-48 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-tr from-slate-950/70 via-slate-950/20 to-emerald-500/10" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.14),_transparent_55%)]" />
              <div className="absolute inset-0 scale-100 transition duration-700 ease-out group-hover:scale-110">
                <div className="h-full w-full bg-[linear-gradient(120deg,rgba(255,255,255,0.08),rgba(255,255,255,0.02),rgba(52,211,153,0.06))]" />
              </div>
              <div className="absolute bottom-3 left-3 rounded-full bg-white/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-200 ring-1 ring-white/15 backdrop-blur">
                Headshot
              </div>
            </div>

            <div className="p-5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-emerald-300">
                {m.title}
              </p>
              <h2 className="mt-2 text-lg font-semibold tracking-tight text-slate-900 dark:text-white">
                {m.name}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">{m.highlight}</p>

              <div className="mt-4 flex items-center gap-2">
                <SocialIconLink href={m.linkedin} label={`${m.name} LinkedIn`}>
                  <Linkedin className="h-4 w-4" />
                </SocialIconLink>
                <SocialIconLink href={m.twitter} label={`${m.name} Twitter/X`}>
                  <Twitter className="h-4 w-4" />
                </SocialIconLink>
              </div>
            </div>
          </motion.article>
        ))}
      </section>
    </div>
  );
};

export default Team;


