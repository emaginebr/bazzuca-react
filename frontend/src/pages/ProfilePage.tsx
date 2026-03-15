import { useAuth } from 'nauth-react';
import { User, Mail, Calendar, Shield, KeyRound, Trash2, AlertTriangle } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

export function ProfilePage() {
  const { user } = useAuth();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleDeleteAccount = async () => {
    toast.error('Account deletion is not yet implemented');
    setShowDeleteConfirm(false);
  };

  const infoItems = [
    {
      icon: <User className="w-4 h-4" />,
      label: 'Full Name',
      value: user?.name || 'Not set',
      gradient: 'from-brand-primary to-violet-600',
    },
    {
      icon: <Mail className="w-4 h-4" />,
      label: 'Email Address',
      value: user?.email,
      gradient: 'from-brand-secondary to-rose-500',
    },
    {
      icon: <Shield className="w-4 h-4" />,
      label: 'Account Status',
      value: 'Active',
      badge: true,
      gradient: 'from-emerald-500 to-green-500',
    },
    {
      icon: <Calendar className="w-4 h-4" />,
      label: 'Member Since',
      value: user?.createAt
        ? new Date(user.createAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
        : 'N/A',
      gradient: 'from-amber-500 to-orange-500',
    },
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="animate-fade-up glass rounded-2xl p-8">
        <div className="flex items-start gap-5">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-primary to-brand-secondary flex items-center justify-center text-white text-2xl font-bold shadow-xl shadow-brand-primary/25">
            {user?.name?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-foreground mb-1">
              {user?.name || 'User Profile'}
            </h1>
            <p className="text-sm text-muted-foreground mb-4">{user?.email}</p>
            <button
              disabled
              className="inline-flex items-center gap-2 px-4 py-2 text-sm glass rounded-lg text-muted-foreground cursor-not-allowed opacity-50"
            >
              <KeyRound className="w-3.5 h-3.5" />
              Change Password
            </button>
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="animate-fade-up stagger-1 glass rounded-2xl p-6">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-5">
          Account Information
        </h2>
        <div className="space-y-5">
          {infoItems.map((item, i) => (
            <div key={i} className="flex items-center gap-4">
              <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${item.gradient} flex items-center justify-center text-white shadow-md`}>
                {item.icon}
              </div>
              <div className="flex-1">
                <p className="text-xs text-muted-foreground">{item.label}</p>
                {item.badge ? (
                  <span className="inline-block mt-0.5 px-2.5 py-0.5 text-xs font-semibold rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    {item.value}
                  </span>
                ) : (
                  <p className="text-sm font-semibold text-foreground">{item.value}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Danger zone */}
      <div className="animate-fade-up stagger-2 rounded-2xl p-6 border border-red-500/20 bg-red-500/[0.03]">
        <h2 className="text-sm font-semibold text-red-400 uppercase tracking-wider mb-2">
          Danger Zone
        </h2>
        <p className="text-sm text-muted-foreground mb-5">
          Permanently delete your account and all associated data.
        </p>

        {!showDeleteConfirm ? (
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm bg-red-500/10 text-red-400 border border-red-500/20 rounded-lg hover:bg-red-500/20 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Delete Account
          </button>
        ) : (
          <div className="rounded-xl bg-red-500/[0.06] border border-red-500/15 p-4">
            <div className="flex items-start gap-3 mb-4">
              <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-red-300 mb-1">Are you absolutely sure?</p>
                <p className="text-xs text-red-400/70">
                  This action cannot be undone. All your data will be permanently removed.
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleDeleteAccount}
                className="px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Yes, delete my account
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 text-sm glass rounded-lg text-foreground hover:bg-white/[0.08] transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
