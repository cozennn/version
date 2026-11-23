import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Container } from '@/components/layout/Container';
import { Section } from '@/components/layout/Section';

function PageIntro({ eyebrow, title, body }: { eyebrow: string; title: string; body: string }): JSX.Element {
  return <Section tone="paper" spacing="xl"><Container><p className="text-xs font-semibold uppercase tracking-[.18em] text-brand">{eyebrow}</p><h1 className="mt-5 max-w-4xl text-4xl font-bold leading-tight text-ink md:text-6xl">{title}</h1><p className="mt-7 max-w-2xl text-base leading-8 text-ink-muted md:text-lg">{body}</p></Container></Section>;
}

export function ServicesPage(): JSX.Element {
  const { t } = useTranslation();
  const items = ['web', 'identity', 'digital'];
  return <><PageIntro eyebrow={t('pages.services.eyebrow')} title={t('pages.services.title')} body={t('pages.services.body')} /><Section tone="surface" spacing="xl"><Container><div className="divide-y divide-ink/15 border-y border-ink/15">{items.map((item, i) => <article key={item} className="grid gap-4 py-8 md:grid-cols-[100px_1fr_1fr] md:items-start"><span className="text-xs tabular-nums text-ink-faint">0{i + 1}</span><h2 className="text-2xl font-bold text-ink">{t(`home.services.${item}.title`)}</h2><p className="max-w-lg text-sm leading-7 text-ink-muted">{t(`pages.services.details.${item}`)}</p></article>)}</div><div className="mt-12"><Link to="/contact" className="inline-flex min-h-12 items-center gap-4 bg-brand px-6 py-3 text-sm font-semibold text-white hover:bg-brand-strong">{t('pages.services.cta')} ↗</Link></div></Container></Section></>;
}

export function WorkPage(): JSX.Element {
  const { t } = useTranslation();
  return <><PageIntro eyebrow={t('pages.work.eyebrow')} title={t('pages.work.title')} body={t('pages.work.body')} /><Section tone="surface" spacing="xl"><Container><div className="grid gap-6 md:grid-cols-2"><div className="aspect-[1.25] bg-[#E9E3F3] p-8"><div className="flex h-full items-center justify-center border border-[#5A46D6]/25"><div className="h-40 w-40 rotate-12 bg-[#5A46D6] shadow-[28px_28px_0_#C2648A]" /></div></div><div className="aspect-[1.25] bg-[#EDE9DF] p-8"><div className="flex h-full items-center justify-center border border-[#141225]/20"><div className="h-44 w-44 rounded-full border-[18px] border-[#C2648A] bg-[#FBFAF7]" /></div></div></div><p className="mt-7 text-sm leading-7 text-ink-muted">{t('pages.work.disclaimer')}</p></Container></Section></>;
}

export function StorePage(): JSX.Element {
  const { t } = useTranslation();
  return <><PageIntro eyebrow={t('pages.store.eyebrow')} title={t('pages.store.title')} body={t('pages.store.body')} /><Section tone="surface" spacing="xl"><Container><div className="border border-dashed border-ink/25 bg-paper px-6 py-16 text-center"><span className="mx-auto flex h-14 w-14 items-center justify-center border border-brand/30 text-2xl text-brand" aria-hidden="true">◈</span><h2 className="mt-6 text-2xl font-bold text-ink">{t('pages.store.emptyTitle')}</h2><p className="mx-auto mt-3 max-w-lg text-sm leading-7 text-ink-muted">{t('pages.store.emptyBody')}</p><span className="mt-6 inline-flex border border-ink/15 px-4 py-2 text-xs text-ink-muted">{t('pages.store.status')}</span></div></Container></Section></>;
}

export function ContactPage(): JSX.Element {
  const { t } = useTranslation();
  return <><PageIntro eyebrow={t('pages.contact.eyebrow')} title={t('pages.contact.title')} body={t('pages.contact.body')} /><Section tone="surface" spacing="xl"><Container><div className="max-w-2xl border-s-2 border-brand ps-6 py-2"><p className="text-sm leading-8 text-ink-muted">{t('pages.contact.notice')}</p></div></Container></Section></>;
}

export function AboutPage(): JSX.Element {
  const { t } = useTranslation();
  return <><PageIntro eyebrow={t('pages.about.eyebrow')} title={t('pages.about.title')} body={t('pages.about.body')} /><Section tone="surface" spacing="xl"><Container><p className="max-w-2xl text-lg leading-9 text-ink">{t('pages.about.statement')}</p></Container></Section></>;
}
