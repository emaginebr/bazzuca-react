import { Link } from 'react-router-dom';
import { useAuth } from 'nauth-react';
import { ROUTES, APP_NAME } from '../lib/constants';
import { Zap, Users, Globe, CalendarDays, BarChart3, ArrowRight } from 'lucide-react';

export function HomePage() {
  const { isAuthenticated } = useAuth();

  const features = [
    {
      icon: <Users className="w-5 h-5" />,
      title: 'Client Management',
      description: 'Organize all your social media clients in one powerful dashboard.',
      color: 'from-brand-primary to-violet-600',
      shadowColor: 'shadow-brand-primary/20',
    },
    {
      icon: <Globe className="w-5 h-5" />,
      title: 'Multi-Platform',
      description: 'X, Instagram, Facebook, LinkedIn, TikTok, YouTube — all connected.',
      color: 'from-brand-secondary to-rose-500',
      shadowColor: 'shadow-brand-secondary/20',
    },
    {
      icon: <CalendarDays className="w-5 h-5" />,
      title: 'Smart Scheduling',
      description: 'Plan and schedule posts with an interactive calendar view.',
      color: 'from-brand-accent to-cyan-400',
      shadowColor: 'shadow-brand-accent/20',
    },
    {
      icon: <BarChart3 className="w-5 h-5" />,
      title: 'Post Workflow',
      description: 'Draft, schedule, review, and publish — a complete content pipeline.',
      color: 'from-amber-500 to-orange-500',
      shadowColor: 'shadow-amber-500/20',
    },
  ];

  return (
    <div className="max-w-5xl mx-auto">
      {/* Hero */}
      <div className="text-center pt-16 pb-20 animate-fade-up">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-primary/10 border border-brand-primary/20 text-brand-primary text-xs font-semibold tracking-wide uppercase mb-8">
          <Zap className="w-3.5 h-3.5" />
          Social Media Command Center
        </div>

        <h1 className="text-6xl md:text-7xl font-extrabold tracking-tight mb-6 leading-[1.05]">
          <span className="text-foreground">Manage social</span>
          <br />
          <span className="text-gradient">like a pro</span>
        </h1>

        <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-10 leading-relaxed">
          {APP_NAME} gives you a unified command center for all your clients' social media accounts.
          Schedule, publish, and track — effortlessly.
        </p>

        <div className="flex gap-3 justify-center">
          {isAuthenticated ? (
            <Link
              to={ROUTES.DASHBOARD}
              className="group inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-brand-primary to-brand-secondary text-white rounded-xl font-semibold shadow-lg shadow-brand-primary/25 hover:shadow-brand-primary/40 hover:scale-[1.02] transition-all duration-200"
            >
              Open Dashboard
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          ) : (
            <>
              <Link
                to={ROUTES.LOGIN}
                className="group inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-brand-primary to-brand-secondary text-white rounded-xl font-semibold shadow-lg shadow-brand-primary/25 hover:shadow-brand-primary/40 hover:scale-[1.02] transition-all duration-200"
              >
                Sign In
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <button
                disabled
                className="px-6 py-3 glass rounded-xl font-semibold text-muted-foreground cursor-not-allowed opacity-50"
              >
                Create Account
              </button>
            </>
          )}
        </div>
      </div>

      {/* Features grid */}
      <div className="grid md:grid-cols-2 gap-4 mb-20">
        {features.map((feature, index) => (
          <div
            key={index}
            className={`animate-fade-up stagger-${index + 1} group glass rounded-2xl p-6 hover:bg-white/[0.08] transition-all duration-300 cursor-default`}
          >
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center text-white mb-4 shadow-lg ${feature.shadowColor} group-hover:scale-110 transition-transform duration-300`}>
              {feature.icon}
            </div>
            <h3 className="text-base font-bold mb-1.5 text-foreground">{feature.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
          </div>
        ))}
      </div>

      {/* Bottom CTA */}
      <div className="animate-fade-up stagger-5 relative rounded-2xl overflow-hidden mb-10">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-primary via-brand-secondary to-brand-accent opacity-90" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.06%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-50" />
        <div className="relative px-10 py-14 text-center text-white">
          <h2 className="text-3xl font-bold mb-3 tracking-tight">Ready to take control?</h2>
          <p className="text-white/70 mb-8 max-w-md mx-auto">
            Built with TypeScript, React, and Tailwind CSS. Fully type-safe and production-ready.
          </p>
          {!isAuthenticated && (
            <Link
              to={ROUTES.LOGIN}
              className="inline-flex items-center gap-2 px-6 py-3 bg-white/15 backdrop-blur border border-white/20 text-white rounded-xl font-semibold hover:bg-white/25 transition-all"
            >
              Get started now
              <ArrowRight className="w-4 h-4" />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
