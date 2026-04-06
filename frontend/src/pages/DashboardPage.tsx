import { Tag, Shield, Compass, FileText, GitBranch, ArrowRight, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';
import { MOCK_MODERATION_EVENTS, MOCK_REPOSITORIES, MOCK_TRIAGED_ISSUES } from '../data/mockData';
import type { Page } from '../types';
import { cn } from '../utils/cn';

interface DashboardPageProps {
  navigate: (page: Page) => void;
}

const DECISION_ICON = {
  PASS: CheckCircle,
  FLAG: AlertTriangle,
  BLOCK: XCircle,
};

const DECISION_COLOR = {
  PASS: 'text-emerald-400',
  FLAG: 'text-amber-400',
  BLOCK: 'text-red-400',
};

function timeAgo(ts: string) {
  const diff = Date.now() - new Date(ts).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export function DashboardPage({ navigate }: DashboardPageProps) {
  const monitoredRepos = MOCK_REPOSITORIES.filter((r) => r.isMonitored);
  const issuesAnalyzed = MOCK_TRIAGED_ISSUES.length;
  const blockedPRs = MOCK_MODERATION_EVENTS.filter((e) => e.decision === 'BLOCK').length;

  const stats = [
    {
      label: 'Issues Analysed',
      value: issuesAnalyzed,
      icon: Tag,
      color: 'text-violet-400',
      bg: 'bg-violet-500/10',
      page: 'triage' as Page,
    },
    {
      label: 'PRs Moderated',
      value: MOCK_MODERATION_EVENTS.length,
      icon: Shield,
      color: 'text-red-400',
      bg: 'bg-red-500/10',
      page: 'moderation' as Page,
    },
    {
      label: 'Blocked PRs',
      value: blockedPRs,
      icon: XCircle,
      color: 'text-orange-400',
      bg: 'bg-orange-500/10',
      page: 'moderation' as Page,
    },
    {
      label: 'Active Repos',
      value: monitoredRepos.length,
      icon: GitBranch,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10',
      page: 'repositories' as Page,
    },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(({ label, value, icon: Icon, color, bg, page }) => (
          <button
            key={label}
            onClick={() => navigate(page)}
            className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 text-left hover:border-zinc-700 transition-colors group"
          >
            <div className={cn('w-9 h-9 rounded-lg flex items-center justify-center mb-3', bg)}>
              <Icon className={cn('w-4 h-4', color)} />
            </div>
            <div className="text-2xl font-bold text-white">{value}</div>
            <div className="text-xs text-zinc-500 mt-0.5">{label}</div>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent moderation events */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl">
          <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-800">
            <h2 className="text-sm font-semibold text-zinc-200">Recent Moderation</h2>
            <button
              onClick={() => navigate('moderation')}
              className="text-xs text-violet-400 hover:text-violet-300 flex items-center gap-1"
            >
              View all <ArrowRight className="w-3 h-3" />
            </button>
          </div>
          <div className="divide-y divide-zinc-800">
            {MOCK_MODERATION_EVENTS.slice(0, 4).map((event) => {
              const Icon = DECISION_ICON[event.decision];
              return (
                <div key={event.id} className="px-5 py-3 flex items-start gap-3">
                  <Icon className={cn('w-4 h-4 mt-0.5 flex-shrink-0', DECISION_COLOR[event.decision])} />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-zinc-300 truncate">{event.title}</p>
                    <p className="text-xs text-zinc-600 mt-0.5">{event.repo} · {timeAgo(event.timestamp)}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick actions */}
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-zinc-200 px-1">Quick Actions</h2>
          {[
            { page: 'triage' as Page, icon: Tag, label: 'Triage an Issue', desc: 'Classify and prioritise with AI', color: 'text-violet-400', bg: 'bg-violet-500/10' },
            { page: 'readme' as Page, icon: FileText, label: 'Generate README', desc: 'Point at any repo, get a full README', color: 'text-amber-400', bg: 'bg-amber-500/10' },
            { page: 'recommender' as Page, icon: Compass, label: 'Find First Issues', desc: 'Issues matched to your skills', color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
          ].map(({ page, icon: Icon, label, desc, color, bg }) => (
            <button
              key={page}
              onClick={() => navigate(page)}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-5 py-4 flex items-center gap-4 hover:border-zinc-700 transition-colors text-left"
            >
              <div className={cn('w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0', bg)}>
                <Icon className={cn('w-4 h-4', color)} />
              </div>
              <div>
                <div className="text-sm font-medium text-zinc-200">{label}</div>
                <div className="text-xs text-zinc-500 mt-0.5">{desc}</div>
              </div>
              <ArrowRight className="w-4 h-4 text-zinc-600 ml-auto" />
            </button>
          ))}
        </div>
      </div>

      {/* Monitored repos */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl">
        <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-800">
          <h2 className="text-sm font-semibold text-zinc-200">Monitored Repositories</h2>
          <button
            onClick={() => navigate('repositories')}
            className="text-xs text-violet-400 hover:text-violet-300 flex items-center gap-1"
          >
            Manage <ArrowRight className="w-3 h-3" />
          </button>
        </div>
        <div className="divide-y divide-zinc-800">
          {monitoredRepos.map((repo) => (
            <div key={repo.id} className="px-5 py-3 flex items-center justify-between">
              <div>
                <p className="text-sm text-zinc-200 font-medium">{repo.fullName}</p>
                <p className="text-xs text-zinc-500 mt-0.5">{repo.openIssues} open issues · {repo.language}</p>
              </div>
              <span className={cn(
                'text-xs px-2 py-0.5 rounded-full',
                repo.webhookActive
                  ? 'bg-emerald-500/10 text-emerald-400'
                  : 'bg-zinc-700/30 text-zinc-500'
              )}>
                {repo.webhookActive ? 'Active' : 'Webhook off'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
