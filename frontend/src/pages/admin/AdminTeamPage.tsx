import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../lib/api';
import {
  AdminPageHeader,
  Field,
  Input,
  Panel,
  SingleImageInput,
  Switch,
  Textarea,
} from '../../components/admin/AdminUI';
import { Button } from '../../components/ui/Button';
import { Dialog } from '../../components/ui/Dialog';
import { EmptyState } from '../../components/ui/EmptyState';
import { useToast } from '../../components/ui/Toast';
import { useSite } from '../../components/SiteProvider';
import { ExternalIcon, InstagramIcon, PencilIcon, PlusIcon, TrashIcon, UsersIcon } from '../../icons';
import type { TeamMember } from '../../lib/types';

type Draft = {
  name: string;
  role: string;
  photo: string;
  phone: string;
  email: string;
  instagram: string;
  bio: string;
  sortOrder: string;
  isVisible: boolean;
};

const EMPTY: Draft = {
  name: '',
  role: '',
  photo: '',
  phone: '',
  email: '',
  instagram: '',
  bio: '',
  sortOrder: '0',
  isVisible: true,
};

export function AdminTeamPage() {
  const [team, setTeam] = useState<TeamMember[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<TeamMember | null>(null);
  const [draft, setDraft] = useState<Draft>(EMPTY);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<TeamMember | null>(null);
  const [deleting, setDeleting] = useState(false);
  const { notify } = useToast();
  const { reload } = useSite();

  const load = async () => {
    try {
      const data = await api.get<{ team: TeamMember[] }>('/admin/team');
      setTeam(data.team);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'دریافت تیم انجام نشد.');
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const openNew = () => {
    setEditing(null);
    setDraft({ ...EMPTY, sortOrder: String(team?.length ?? 0) });
    setDialogOpen(true);
  };

  const openEdit = (member: TeamMember) => {
    setEditing(member);
    setDraft({
      name: member.name,
      role: member.role,
      photo: member.photo,
      phone: member.phone,
      email: member.email,
      instagram: member.instagram,
      bio: member.bio,
      sortOrder: String(member.sortOrder ?? 0),
      isVisible: member.isVisible ?? true,
    });
    setDialogOpen(true);
  };

  const update = <K extends keyof Draft>(key: K, value: Draft[K]) => {
    setDraft((current) => ({ ...current, [key]: value }));
  };

  const save = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (draft.name.trim().length < 2 || draft.role.trim().length < 2) {
      notify('نام و سمت عضو تیم را کامل وارد کنید.', 'error');
      return;
    }
    setSaving(true);
    try {
      const payload = { ...draft, sortOrder: Number(draft.sortOrder) || 0 };
      if (editing) {
        await api.put(`/admin/team/${editing.id}`, payload);
        notify('اطلاعات عضو تیم ذخیره شد.');
      } else {
        await api.post('/admin/team', payload);
        notify('عضو تیم اضافه شد.');
      }
      setDialogOpen(false);
      await load();
      await reload();
    } catch (saveError) {
      notify(saveError instanceof Error ? saveError.message : 'ذخیره عضو تیم انجام نشد.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await api.delete(`/admin/team/${deleteTarget.id}`);
      notify('عضو تیم حذف شد.');
      setDeleteTarget(null);
      await load();
      await reload();
    } catch (deleteError) {
      notify(deleteError instanceof Error ? deleteError.message : 'حذف انجام نشد.', 'error');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <AdminPageHeader
        title="مدیریت تیم ما"
        description="اعضای تیم را اضافه، ویرایش یا از نمایش عمومی خارج کنید."
        actions={
          <>
            <Link
              to="/team"
              className="inline-flex items-center gap-1.5 rounded-full border border-navy-900/15 px-4 py-2 text-[11.5px] text-navy-600 transition hover:border-champagne-500"
            >
              مشاهده صفحه
              <ExternalIcon className="h-3.5 w-3.5" />
            </Link>
            <Button size="sm" onClick={openNew}>
              <PlusIcon className="h-4 w-4" />
              عضو جدید
            </Button>
          </>
        }
      />

      {error ? (
        <Panel>
          <p className="text-[12.5px] text-red-700">{error}</p>
        </Panel>
      ) : null}

      {!team && !error ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="h-56 animate-pulse rounded-2xl bg-white" />
          ))}
        </div>
      ) : null}

      {team && team.length === 0 ? (
        <Panel>
          <EmptyState
            title="عضو تیمی ثبت نشده است"
            description="برای نمایش بخش تیم در سایت، اولین عضو را اضافه کنید."
            icon={<UsersIcon className="h-6 w-6" />}
            action={<Button onClick={openNew}>افزودن عضو تیم</Button>}
          />
        </Panel>
      ) : null}

      {team && team.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {team.map((member) => (
            <article key={member.id} className="admin-card flex flex-col">
              <div className="flex items-start gap-3">
                <img
                  src={member.photo || '/images/team-1.jpg'}
                  alt={member.name}
                  className="h-16 w-16 shrink-0 rounded-xl object-cover"
                />
                <div className="min-w-0 flex-1">
                  <p className="text-[13px] font-bold text-navy-900">{member.name}</p>
                  <p className="mt-0.5 text-[10.5px] text-champagne-700">{member.role}</p>
                  <span
                    className={`mt-2 inline-block rounded-full px-2 py-0.5 text-[9px] ${
                      member.isVisible
                        ? 'bg-emerald-50 text-emerald-700'
                        : 'bg-navy-100 text-navy-500'
                    }`}
                  >
                    {member.isVisible ? 'نمایش عمومی' : 'مخفی'}
                  </span>
                </div>
              </div>
              {member.bio ? <p className="mt-3 text-[11px] leading-6 text-navy-500">{member.bio}</p> : null}
              <div className="mt-3 flex flex-wrap items-center gap-2 text-[10px] text-navy-400">
                {member.phone ? <span dir="ltr">{member.phone}</span> : null}
                {member.email ? <span dir="ltr">{member.email}</span> : null}
                {member.instagram ? (
                  <span className="inline-flex items-center gap-1">
                    <InstagramIcon className="h-3 w-3" />
                    {member.instagram}
                  </span>
                ) : null}
              </div>
              <div className="mt-auto flex items-center justify-between border-t border-navy-900/8 pt-3">
                <span className="text-[9.5px] text-navy-300">ترتیب: {member.sortOrder ?? 0}</span>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => openEdit(member)}
                    aria-label={`ویرایش ${member.name}`}
                    className="rounded-lg p-2 text-navy-500 transition hover:bg-ivory hover:text-navy-900"
                  >
                    <PencilIcon className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeleteTarget(member)}
                    aria-label={`حذف ${member.name}`}
                    className="rounded-lg p-2 text-navy-400 transition hover:bg-red-50 hover:text-red-600"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : null}

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} title={editing ? 'ویرایش عضو تیم' : 'افزودن عضو تیم'}>
        <form onSubmit={save} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="نام و نام خانوادگی" htmlFor="team-name" required>
              <Input id="team-name" value={draft.name} onChange={(event) => update('name', event.target.value)} />
            </Field>
            <Field label="سمت" htmlFor="team-role" required>
              <Input id="team-role" value={draft.role} onChange={(event) => update('role', event.target.value)} />
            </Field>
          </div>
          <SingleImageInput label="تصویر" value={draft.photo} onChange={(value) => update('photo', value)} />
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="تلفن" htmlFor="team-phone">
              <Input
                id="team-phone"
                value={draft.phone}
                onChange={(event) => update('phone', event.target.value)}
                dir="ltr"
              />
            </Field>
            <Field label="ایمیل" htmlFor="team-email">
              <Input
                id="team-email"
                value={draft.email}
                onChange={(event) => update('email', event.target.value)}
                dir="ltr"
              />
            </Field>
            <Field label="اینستاگرام" htmlFor="team-instagram">
              <Input
                id="team-instagram"
                value={draft.instagram}
                onChange={(event) => update('instagram', event.target.value)}
                dir="ltr"
                placeholder="@username"
              />
            </Field>
            <Field label="ترتیب نمایش" htmlFor="team-order">
              <Input
                id="team-order"
                value={draft.sortOrder}
                onChange={(event) => update('sortOrder', event.target.value.replace(/[^\d۰-۹]/g, ''))}
                inputMode="numeric"
                dir="ltr"
              />
            </Field>
          </div>
          <Field label="معرفی کوتاه" htmlFor="team-bio">
            <Textarea
              id="team-bio"
              value={draft.bio}
              onChange={(event) => update('bio', event.target.value)}
              className="min-h-[80px]"
            />
          </Field>
          <Switch
            checked={draft.isVisible}
            onChange={(value) => update('isVisible', value)}
            label="نمایش در سایت"
            description="در صورت غیرفعال بودن، این عضو در صفحه تیم نمایش داده نمی‌شود."
          />
          <div className="flex items-center justify-end gap-2 pt-2">
            <Button type="button" variant="outline" size="sm" onClick={() => setDialogOpen(false)}>
              انصراف
            </Button>
            <Button type="submit" size="sm" disabled={saving}>
              {saving ? 'در حال ذخیره…' : 'ذخیره'}
            </Button>
          </div>
        </form>
      </Dialog>

      <Dialog open={Boolean(deleteTarget)} onClose={() => setDeleteTarget(null)} title="حذف عضو تیم" size="sm">
        <p className="text-[13px] leading-7 text-navy-600">
          آیا از حذف «{deleteTarget?.name}» مطمئن هستید؟ این عملیات قابل بازگشت نیست.
        </p>
        <div className="mt-6 flex items-center justify-end gap-2">
          <Button variant="outline" size="sm" onClick={() => setDeleteTarget(null)}>
            انصراف
          </Button>
          <Button variant="danger" size="sm" onClick={() => void confirmDelete()} disabled={deleting}>
            {deleting ? 'در حال حذف…' : 'حذف'}
          </Button>
        </div>
      </Dialog>
    </>
  );
}
