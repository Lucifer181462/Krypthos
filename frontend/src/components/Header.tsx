import { LogOut } from 'lucide-react';

interface HeaderProps {
  user: { login: string; avatarUrl: string };
  onLogout: () => void;
  title: string;
}

export function Header({ user, onLogout, title }: HeaderProps) {
  return (
    <header className="h-14 border-b border-zinc-800 bg-zinc-950 flex items-center justify-between px-6 flex-shrink-0">
      <h1 className="text-sm font-semibold text-zinc-200">{title}</h1>
      <div className="flex items-center gap-3">
        <img
          src={user.avatarUrl}
          alt={user.login}
          className="w-7 h-7 rounded-full border border-zinc-700"
        />
        <span className="text-sm text-zinc-300 hidden sm:block">{user.login}</span>
        <button
          onClick={onLogout}
          className="flex items-center gap-1.5 text-zinc-500 hover:text-zinc-200 transition-colors text-xs"
          title="Sign out"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}
