import { useAuth } from 'nauth-react';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut, User } from 'lucide-react';
import { ROUTES } from '../lib/constants';

export function UserMenu() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate(ROUTES.LOGIN);
  };

  if (!user) return null;

  return (
    <div className="relative group">
      <button className="flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-white/[0.05] transition-all duration-200">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-primary to-brand-secondary flex items-center justify-center text-white text-sm font-bold shadow-md shadow-brand-primary/20">
          {user.name?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase()}
        </div>
        <span className="text-sm font-medium hidden md:block text-foreground">
          {user.name || user.email}
        </span>
      </button>

      <div className="absolute right-0 mt-2 w-60 glass rounded-xl shadow-2xl shadow-black/20 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 animate-slide-down z-50 overflow-hidden">
        <div className="px-4 pt-4 pb-3 border-b border-white/[0.06]">
          <p className="text-sm font-semibold text-foreground">{user.name}</p>
          <p className="text-xs text-muted-foreground truncate mt-0.5">{user.email}</p>
        </div>

        <div className="p-1.5">
          <Link
            to={ROUTES.PROFILE}
            className="flex items-center gap-2.5 px-3 py-2 text-sm rounded-lg hover:bg-white/[0.06] text-foreground transition-colors"
          >
            <User className="w-4 h-4 text-muted-foreground" />
            Profile
          </Link>
        </div>

        <div className="border-t border-white/[0.06] p-1.5">
          <button
            onClick={handleLogout}
            className="flex items-center gap-2.5 w-full px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign out
          </button>
        </div>
      </div>
    </div>
  );
}
