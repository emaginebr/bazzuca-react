import { LoginForm } from 'nauth-react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from 'nauth-react';
import { toast } from 'sonner';
import { ROUTES } from '../lib/constants';
import { Zap } from 'lucide-react';

export function LoginPage() {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-primary to-brand-secondary animate-pulse" />
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to={ROUTES.DASHBOARD} replace />;
  }

  const handleSuccess = () => {
    toast.success('Welcome back!');
    const redirectTo = sessionStorage.getItem('redirectAfterLogin');
    if (redirectTo) {
      sessionStorage.removeItem('redirectAfterLogin');
      navigate(redirectTo);
    } else {
      navigate(ROUTES.DASHBOARD);
    }
  };

  const handleError = (error: Error) => {
    toast.error(error.message || 'Login failed. Please try again.');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center animate-fade-up">
      <div className="w-full max-w-md">
        <div className="glass rounded-2xl p-8 shadow-2xl shadow-black/10">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-brand-primary to-brand-secondary shadow-lg shadow-brand-primary/25 mb-4">
              <Zap className="w-6 h-6 text-white" strokeWidth={2.5} />
            </div>
            <h1 className="text-2xl font-bold text-foreground">Welcome back</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Sign in to your Bazzuca account
            </p>
          </div>

          <LoginForm
            onSuccess={handleSuccess}
            onError={handleError}
            showRememberMe={true}
            className="space-y-4"
          />
        </div>
      </div>
    </div>
  );
}
