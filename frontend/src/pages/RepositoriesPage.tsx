import { useState } from 'react';
import { Star, GitFork, ExternalLink, Zap, ZapOff } from 'lucide-react';
import { MOCK_REPOSITORIES } from '../data/mockData';
import type { Repository } from '../types';
import { cn } from '../utils/cn';

function formatNumber(n: number) {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return String(n);
}

const LANGUAGE_COLORS: Record<string, string> = {
  TypeScript: 'bg-blue-500',
  JavaScript: 'bg-yellow-400',
  Python: 'bg-blue-400',
  Rust: 'bg-orange-600',
  Go: 'bg-cyan-500',
  CSS: 'bg-purple-500',
};

export function RepositoriesPage() {
  const [repos, setRepos] = useState<Repository[]>(MOCK_REPOSITORIES);

  const toggleMonitor = (id: string) => {
    setRepos((prev) =>
      prev.map((r) =>
        r.id === id
          ? { ...r, isMonitored: !r.isMonitored, webhookActive: !r.isMonitored }
          : r
      )
    );
  };

  const monitored = repos.filter((r) => r.isMonitored);
  const unmonitored = repos.filter((r) => !r.isMonitored);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-zinc-100">Repositories</h2>
          <p className="text-sm text-zinc-500 mt-0.5">
            {monitored.length} of {repos.length} repositories monitored
          </p>
        </div>
      </div>

      {/* Monitored */}
      {monitored.length > 0 && (
        <section>
          <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-3">
            Monitored
          </h3>
          <div className="space-y-3">
            {monitored.map((repo) => (
              <RepoCard key={repo.id} repo={repo} onToggle={toggleMonitor} />
            ))}
          </div>
        </section>
      )}

      {/* Not monitored */}
      {unmonitored.length > 0 && (
        <section>
          <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-3">
            Not Monitored
          </h3>
          <div className="space-y-3">
            {unmonitored.map((repo) => (
              <RepoCard key={repo.id} repo={repo} onToggle={toggleMonitor} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function RepoCard({ repo, onToggle }: { repo: Repository; onToggle: (id: string) => void }) {
  const dotColor = LANGUAGE_COLORS[repo.language] ?? 'bg-zinc-500';

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl px-5 py-4 flex items-start justify-between gap-4">
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2 flex-wrap">
          <a
            href={repo.url}
            target="_blank"
            rel="noreferrer"
            className="text-sm font-semibold text-zinc-100 hover:text-violet-300 transition-colors flex items-center gap-1"
          >
            {repo.fullName}
            <ExternalLink className="w-3 h-3 text-zinc-600" />
          </a>
          {repo.webhookActive && (
            <span className="text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full">
              Webhook active
            </span>
          )}
        </div>

        {repo.description && (
          <p className="text-xs text-zinc-500 mt-1 line-clamp-2">{repo.description}</p>
        )}

        <div className="flex items-center gap-4 mt-2 text-xs text-zinc-600">
          <span className="flex items-center gap-1">
            <span className={cn('w-2 h-2 rounded-full', dotColor)} />
            {repo.language}
          </span>
          <span className="flex items-center gap-1">
            <Star className="w-3 h-3" />
            {formatNumber(repo.stars)}
          </span>
          <span className="flex items-center gap-1">
            <GitFork className="w-3 h-3" />
            {formatNumber(repo.forks)}
          </span>
          <span>{repo.openIssues} open issues</span>
        </div>
      </div>

      <button
        onClick={() => onToggle(repo.id)}
        className={cn(
          'flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg border transition-colors flex-shrink-0',
          repo.isMonitored
            ? 'bg-violet-600/10 text-violet-400 border-violet-500/30 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/30'
            : 'bg-zinc-800 text-zinc-400 border-zinc-700 hover:bg-violet-600/10 hover:text-violet-400 hover:border-violet-500/30'
        )}
      >
        {repo.isMonitored ? (
          <><ZapOff className="w-3.5 h-3.5" /> Stop monitoring</>
        ) : (
          <><Zap className="w-3.5 h-3.5" /> Monitor</>  
        )}
      </button>
    </div>
  );
}
