import { LayoutDashboard, GitBranch, Tag, Shield, Compass, FileText, Zap } from 'lucide-react';
import { cn } from '../utils/cn';
import type { Page } from '../types';

const NAV_ITEMS: { page: Page; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { page: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { page: 'repositories', label: 'Repositories', icon: GitBranch },
  { page: 'triage', label: 'Issue Triage', icon: Tag },
  { page: 'moderation', label: 'Moderation', icon: Shield },
  { page: 'recommender', label: 'Recommender', icon: Compass },
  { page: 'readme', label: 'README Gen', icon: FileText },
];

interface SidebarProps {
  currentPage: Page;
  navigate: (page: Page) => void;
}

export function Sidebar({ currentPage, navigate }: SidebarProps) {
  return (
    <aside className="w-56 bg-zinc-950 border-r border-zinc-800 flex flex-col flex-shrink-0">
      {/* Logo */}
      <div className="h-14 flex items-center gap-2.5 px-5 border-b border-zinc-800">
        <div className="w-7 h-7 rounded-lg bg-violet-600 flex items-center justify-center">
          <Zap className="w-3.5 h-3.5 text-white" />
        </div>
        <span className="font-bold text-white text-sm tracking-tight">GitWise AI</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {NAV_ITEMS.map(({ page, label, icon: Icon }) => (
          <button
            key={page}
            onClick={() => navigate(page)}
            className={cn(
              'w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors text-left',
              currentPage === page
                ? 'bg-violet-600/20 text-violet-300 font-medium'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60'
            )}
          >
            <Icon className="w-4 h-4 flex-shrink-0" />
            {label}
          </button>
        ))}
      </nav>
    </aside>
  );
}
