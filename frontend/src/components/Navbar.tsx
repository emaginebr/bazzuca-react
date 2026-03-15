import { Link, useLocation } from 'react-router-dom';
import { useAuth } from 'nauth-react';
import { APP_NAME, ROUTES } from '../lib/constants';
import { UserMenu } from './UserMenu';
import { LayoutDashboard, Users, MessageSquare, Calendar, Zap } from 'lucide-react';

export function Navbar() {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const navLink = (to: string, icon: React.ReactNode, label: string) => (
    <Link
      to={to}
      className={`
        relative flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200
        ${isActive(to)
          ? 'text-brand-primary bg-brand-primary/10'
          : 'text-muted-foreground hover:text-foreground hover:bg-black/[0.03]'
        }
      `}
    >
      {icon}
      {label}
      {isActive(to) && (
        <span className="absolute -bottom-[13px] left-1/2 -translate-x-1/2 w-6 h-[2px] rounded-full bg-brand-primary" />
      )}
    </Link>
  );

  return (
    <nav className="glass sticky top-0 z-40 border-b border-white/[0.06]">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-1">
            <Link to={ROUTES.HOME} className="flex items-center gap-2.5 mr-6 group">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-primary via-brand-secondary to-brand-accent flex items-center justify-center shadow-lg shadow-brand-primary/20 group-hover:shadow-brand-primary/40 transition-shadow">
                <Zap className="w-4 h-4 text-white" strokeWidth={2.5} />
              </div>
              <span className="text-lg font-bold tracking-tight text-gradient-subtle">
                {APP_NAME}
              </span>
            </Link>

            {isAuthenticated && (
              <div className="flex items-center gap-0.5">
                {navLink(ROUTES.DASHBOARD, <LayoutDashboard className="w-4 h-4" />, 'Dashboard')}
                {navLink(ROUTES.CLIENTS, <Users className="w-4 h-4" />, 'Clients')}
                {navLink(ROUTES.POSTS, <MessageSquare className="w-4 h-4" />, 'Posts')}
                {navLink(ROUTES.CALENDAR, <Calendar className="w-4 h-4" />, 'Calendar')}
              </div>
            )}
          </div>

          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <UserMenu />
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to={ROUTES.LOGIN}
                  className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  Sign in
                </Link>
                <button
                  disabled
                  className="px-4 py-2 text-sm font-semibold bg-gradient-to-r from-brand-primary to-brand-secondary text-white rounded-lg opacity-50 cursor-not-allowed"
                >
                  Get Started
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
