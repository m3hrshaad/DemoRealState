import { ButtonLink } from '../components/ui/Button';
import { ArrowLeftIcon } from '../icons';

export function NotFoundPage() {
  return (
    <section className="flex min-h-[75vh] flex-col items-center justify-center bg-ivory px-6 pb-16 pt-32 text-center">
      <p className="text-[10px] text-champagne-600">خطای ۴۰۴</p>
      <h1 className="display-2 mt-5 max-w-xl text-balance">صفحه‌ای که دنبال آن بودید پیدا نشد</h1>
      <p className="body-text mt-4 max-w-md">
        ممکن است آدرس تغییر کرده باشد یا این صفحه حذف شده باشد. از میان آگهی‌های فعال جست‌وجو کنید.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <ButtonLink to="/">
          بازگشت به خانه
          <ArrowLeftIcon className="h-4 w-4" />
        </ButtonLink>
        <ButtonLink to="/buy" variant="outline">
          مشاهده آگهی‌ها
        </ButtonLink>
      </div>
    </section>
  );
}
