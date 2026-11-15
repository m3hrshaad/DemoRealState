import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { api } from '../../lib/api';
import { useSite } from '../../components/SiteProvider';
import { Brand, LogoMark } from '../../components/Brand';
import { Button } from '../../components/ui/Button';
import { EyeIcon, EyeOffIcon, ArrowRightIcon, ShieldIcon } from '../../icons';

export function AdminLoginPage() {
  const { settings } = useSite();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api
      .get('/auth/me')
      .then(() => navigate('/admin', { replace: true }))
      .catch(() => undefined);
  }, [navigate]);

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError('ایمیل را در قالب صحیح وارد کنید.');
      return;
    }
    if (password.length < 6) {
      setError('رمز عبور باید حداقل ۶ کاراکتر باشد.');
      return;
    }

    setLoading(true);
    try {
      await api.post('/auth/login', { email: email.trim(), password });
      const state = location.state as { from?: string } | null;
      navigate(state?.from ?? '/admin', { replace: true });
    } catch (loginError) {
      setError(loginError instanceof Error ? loginError.message : 'ورود انجام نشد.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid min-h-screen bg-white lg:grid-cols-[1fr_1.05fr]">
      <div className="relative hidden overflow-hidden bg-navy-950 p-12 text-white lg:flex lg:flex-col lg:justify-between">
        <img
          src={settings.heroImage || '/images/hero.jpg'}
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-35"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/75 to-navy-950/45" />
        <div className="relative">
          <Brand settings={settings} tone="light" size="md" />
        </div>
        <div className="relative max-w-md">
          <span className="eyebrow text-champagne-300">پنل مدیریت</span>
          <h1 className="mt-4 text-3xl font-bold leading-[1.4] text-white">
            مدیریت آگهی‌ها، محتوا و آمار بازدید در یک مکان
          </h1>
          <p className="mt-4 text-[13px] leading-8 text-white/60">
            دسترسی به این بخش فقط برای مدیران مجاز است. اطلاعات ورود از طریق تنظیمات محیطی مدیریت می‌شود.
          </p>
        </div>
        <p className="relative text-[11px] text-white/40">© {new Intl.DateTimeFormat('fa-IR', { year: 'numeric' }).format(new Date())} — {settings.brandName}</p>
      </div>

      <div className="flex items-center justify-center px-5 py-12 sm:px-10">
        <div className="w-full max-w-sm">
          <div className="mb-8 flex flex-col items-center text-center lg:hidden">
            <span className="text-champagne-600">
              <LogoMark className="h-12 w-12" />
            </span>
            <p className="mt-3 text-[15px] font-bold text-navy-900">{settings.brandName}</p>
            <p className="mt-1 text-[10.5px] text-navy-400">{settings.brandDescriptor}</p>
          </div>

          <span className="eyebrow hidden lg:inline-flex">ورود مدیر</span>
          <h1 className="mt-3 text-2xl font-bold text-navy-900">ورود به حساب مدیریت</h1>
          <p className="mt-2 text-[12px] leading-6 text-navy-400">
            برای مدیریت آگهی‌ها و محتوای سایت وارد شوید.
          </p>

          <form onSubmit={submit} noValidate className="mt-8 space-y-4">
            <div>
              <label htmlFor="admin-email" className="field-label">
                ایمیل
              </label>
              <input
                id="admin-email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                autoComplete="username"
                dir="ltr"
                className="field-input"
                placeholder="admin@example.com"
                required
              />
            </div>

            <div>
              <label htmlFor="admin-password" className="field-label">
                رمز عبور
              </label>
              <div className="relative">
                <input
                  id="admin-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  autoComplete="current-password"
                  dir="ltr"
                  className="field-input pl-11"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  aria-label={showPassword ? 'پنهان کردن رمز عبور' : 'نمایش رمز عبور'}
                  aria-pressed={showPassword}
                  className="absolute left-2 top-1/2 -translate-y-1/2 rounded-lg p-2 text-navy-400 transition hover:text-navy-800"
                >
                  {showPassword ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {error ? (
              <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-[12px] leading-6 text-red-700">
                {error}
              </p>
            ) : null}

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? 'در حال ورود…' : 'ورود به پنل'}
            </Button>
          </form>

          <div className="mt-6 rounded-xl border border-champagne-500/30 bg-champagne-100/40 p-3.5">
            <p className="flex items-center gap-1.5 text-[11px] font-medium text-champagne-800">
              <ShieldIcon className="h-3.5 w-3.5" />
              دسترسی نمونه
            </p>
            <p className="mt-1.5 text-[10.5px] leading-5 text-navy-600" dir="ltr">
              admin@amlak.local / admin1234
            </p>
            <p className="mt-1 text-[10px] leading-5 text-navy-400">
              پیش از راه‌اندازی واقعی، رمز عبور و ایمیل مدیر را تغییر دهید.
            </p>
          </div>

          <div className="mt-8 flex items-center justify-between text-[11px]">
            <Link to="/" className="inline-flex items-center gap-1.5 text-navy-500 transition hover:text-navy-900">
              <ArrowRightIcon className="h-3.5 w-3.5" />
              بازگشت به سایت
            </Link>
            <span className="text-navy-300">دسترسی محدود</span>
          </div>
        </div>
      </div>
    </div>
  );
}
