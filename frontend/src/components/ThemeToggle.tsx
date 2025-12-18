import { Moon, Sun, Monitor } from 'lucide-react';
import { useTheme } from './theme-provider';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex items-center gap-1 rounded-full border border-slate-700 bg-slate-900/50 p-1 backdrop-blur-sm dark:border-slate-800 dark:bg-slate-950/50">
      <button
        onClick={() => setTheme('light')}
        className={`rounded-full p-1.5 transition-colors ${
          theme === 'light'
            ? 'bg-slate-100 text-slate-900 shadow-sm'
            : 'text-slate-400 hover:text-slate-100'
        }`}
        title="Light mode"
      >
        <Sun className="h-3.5 w-3.5" />
        <span className="sr-only">Light</span>
      </button>
      <button
        onClick={() => setTheme('dark')}
        className={`rounded-full p-1.5 transition-colors ${
          theme === 'dark'
            ? 'bg-slate-800 text-slate-100 shadow-sm dark:bg-slate-700'
            : 'text-slate-400 hover:text-slate-100'
        }`}
        title="Dark mode"
      >
        <Moon className="h-3.5 w-3.5" />
        <span className="sr-only">Dark</span>
      </button>
      <button
        onClick={() => setTheme('system')}
        className={`rounded-full p-1.5 transition-colors ${
          theme === 'system'
            ? 'bg-slate-800 text-slate-100 shadow-sm dark:bg-slate-700'
            : 'text-slate-400 hover:text-slate-100'
        }`}
        title="System theme"
      >
        <Monitor className="h-3.5 w-3.5" />
        <span className="sr-only">System</span>
      </button>
    </div>
  );
}
