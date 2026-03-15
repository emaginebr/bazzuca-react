import { useAuth } from 'nauth-react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../lib/constants';
import { Users, MessageSquare, CalendarDays, User, Mail, Shield, Activity, ArrowRight } from 'lucide-react';

export function DashboardPage() {
  const { user } = useAuth();

  const quickActions = [
    {
      icon: <Users className="w-5 h-5" />,
      title: 'Clients',
      description: 'Manage social media clients',
      to: ROUTES.CLIENTS,
      gradient: 'from-brand-primary to-violet-600',
      shadow: 'shadow-brand-primary/20',
    },
    {
      icon: <MessageSquare className="w-5 h-5" />,
      title: 'Posts',
      description: 'Create and schedule posts',
      to: ROUTES.POSTS,
      gradient: 'from-brand-secondary to-rose-500',
      shadow: 'shadow-brand-secondary/20',
    },
    {
      icon: <CalendarDays className="w-5 h-5" />,
      title: 'Calendar',
      description: 'View scheduled content',
      to: ROUTES.CALENDAR,
      gradient: 'from-brand-accent to-cyan-400',
      shadow: 'shadow-brand-accent/20',
    },
    {
      icon: <User className="w-5 h-5" />,
      title: 'Profile',
      description: 'Account settings',
      to: ROUTES.PROFILE,
      gradient: 'from-amber-500 to-orange-500',
      shadow: 'shadow-amber-500/20',
    },
  ];

  const stats = [
    { icon: <Mail className="w-4 h-4" />, label: 'Email', value: user?.email || 'N/A' },
    {
      icon: <Shield className="w-4 h-4" />,
      label: 'Status',
      value: 'Active',
      badge: true,
    },
    {
      icon: <Activity className="w-4 h-4" />,
      label: 'User ID',
      value: user?.userId ? String(user.userId).substring(0, 12) + '...' : 'N/A',
      mono: true,
    },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Welcome banner */}
      <div className="animate-fade-up relative overflow-hidden rounded-2xl">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-primary via-brand-secondary to-brand-accent opacity-90" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.06%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-40" />
        <div className="relative px-8 py-8">
          <p className="text-white/60 text-sm font-medium tracking-wide uppercase mb-1">Dashboard</p>
          <h1 className="text-3xl font-bold text-white">
            Welcome, {user?.name || user?.email}
          </h1>
        </div>
      </div>

      {/* Quick actions */}
      <div>
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4 animate-fade-up stagger-1">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {quickActions.map((action, index) => (
            <Link
              key={action.to}
              to={action.to}
              className={`animate-fade-up stagger-${index + 2} group glass rounded-xl p-5 hover:bg-white/[0.08] transition-all duration-200`}
            >
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${action.gradient} flex items-center justify-center text-white shadow-lg ${action.shadow} mb-4 group-hover:scale-110 transition-transform duration-200`}>
                {action.icon}
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-foreground">{action.title}</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">{action.description}</p>
                </div>
                <ArrowRight className="w-4 h-4 text-muted-foreground opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Account info */}
      <div className="animate-fade-up stagger-6 glass rounded-2xl p-6">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-5">
          Account
        </h2>
        <div className="space-y-4">
          <div className="flex items-center gap-4 pb-4 border-b border-white/[0.06]">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-primary to-brand-secondary flex items-center justify-center text-white text-lg font-bold shadow-lg shadow-brand-primary/20">
              {user?.name?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="font-semibold text-foreground">{user?.name || 'Not set'}</p>
              <p className="text-sm text-muted-foreground">
                Member since{' '}
                {user?.createAt
                  ? new Date(user.createAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
                  : 'N/A'}
              </p>
            </div>
          </div>

          {stats.map((stat, i) => (
            <div key={i} className="flex items-center justify-between py-2">
              <div className="flex items-center gap-2.5 text-muted-foreground">
                {stat.icon}
                <span className="text-sm">{stat.label}</span>
              </div>
              {stat.badge ? (
                <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  {stat.value}
                </span>
              ) : (
                <span className={`text-sm font-medium text-foreground ${stat.mono ? 'font-mono text-xs' : ''}`}>
                  {stat.value}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
