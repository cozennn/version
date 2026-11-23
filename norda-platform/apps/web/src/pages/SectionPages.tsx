import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Container } from '@/components/layout/Container';
import { Section } from '@/components/layout/Section';

function PageIntro({ eyebrow, title, body }: { eyebrow: string; title: string; body: string }): JSX.Element {
  return (
    <section className="relative overflow-hidden bg-paper py-20 md:py-28">
      <Container width="wide">
        <div className="grid gap-8 md:grid-cols-[1fr_.4fr] md:items-end">
          <div>
            <p className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-[.22em] text-brand"><span className="h-px w-9 bg-rose"/>{eyebrow}</p>
            <h1 className="mt-6 max-w-4xl text-4xl font-bold leading-[1.08] tracking-tight text-ink md:text-6xl">{title}</h1>
            <p className="mt-7 max-w-2xl text-base leading-8 text-ink-muted md:text-lg">{body}</p>
          </div>
          <div aria-hidden="true" className="hidden aspect-square max-w-48 items-center justify-center border border-brand/20 text-brand md:flex">
            <svg viewBox="0 0 120 120" className="w-32" fill="none"><circle cx="60" cy="60" r="48" stroke="currentColor" strokeOpacity=".25"/><path d="M60 91C39 74 28 53 38 34C47 17 64 16 72 32C81 49 71 70 60 91Z" fill="currentColor" fillOpacity=".12" stroke="currentColor"/><path d="M60 91C81 74 92 53 82 34C73 17 56 16 48 32C39 49 49 70 60 91Z" fill="#C2648A" fillOpacity=".14" stroke="#C2648A"/><path d="M60 91V102" stroke="currentColor"/></svg>
          </div>
        </div>
      </Container>
    </section>
  );
}

export function ServicesPage(): JSX.Element {
  const { t } = useTranslation();
  const items = ['web', 'identity', 'digital'];
  return (
    <>
      <PageIntro eyebrow={t('pages.services.eyebrow')} title={t('pages.services.title')} body={t('pages.services.body')}/>
      <Section tone="surface" spacing="xl">
        <Container width="wide">
          <div className="border-t border-ink/15">
            {items.map((item, index) => (
              <article key={item} className="grid gap-5 border-b border-ink/15 py-9 md:grid-cols-[80px_.8fr_1.2fr] md:gap-8 md:py-12">
                <span className="font-mono text-sm text-rose">0{index + 1}</span>
                <h2 className="text-2xl font-bold text-ink md:text-3xl">{t(`home.services.${item}.title`)}</h2>
                <p className="max-w-2xl text-sm leading-8 text-ink-muted md:text-base">{t(`pages.services.details.${item}`)}</p>
              </article>
            ))}
          </div>
          <div className="mt-14 flex flex-col gap-5 border-s-2 border-brand ps-6 md:flex-row md:items-center md:justify-between">
            <div><h2 className="text-2xl font-bold text-ink">{t('pages.services.ctaTitle')}</h2><p className="mt-2 text-sm text-ink-muted">{t('pages.services.ctaBody')}</p></div>
            <Link to="/contact" className="inline-flex min-h-12 items-center justify-center gap-4 self-start bg-brand px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-strong">{t('pages.services.cta')} ↗</Link>
          </div>
        </Container>
      </Section>
    </>
  );
}

export function WorkPage(): JSX.Element {
  const { t } = useTranslation();
  return (
    <>
      <PageIntro eyebrow={t('pages.work.eyebrow')} title={t('pages.work.title')} body={t('pages.work.body')}/>
      <Section tone="surface" spacing="xl">
        <Container width="wide">
          <div className="grid gap-10 md:grid-cols-2">
            <article>
              <div className="relative aspect-[1.15] overflow-hidden bg-[#EAE5F5] p-7 md:p-10">
                <div className="absolute inset-6 border border-[#5A46D6]/25"/>
                <div className="absolute start-[16%] top-[17%] h-[65%] w-[46%] bg-[#5A46D6]"/>
                <div className="absolute end-[14%] top-[27%] h-[48%] w-[38%] border-[12px] border-[#C2648A] bg-[#FBFAF7]"/>
                <span className="absolute bottom-9 start-9 text-[10px] font-bold uppercase tracking-[.2em] text-[#4734BA]">{t('home.work.visualOne')}</span>
              </div>
              <div className="mt-5 flex items-center justify-between gap-4"><div><span className="text-[10px] font-bold uppercase tracking-[.18em] text-rose">{t('pages.work.studyLabel')}</span><h2 className="mt-2 text-xl font-bold text-ink">{t('home.work.caseOne')}</h2></div><span className="border border-ink/15 px-3 py-2 text-[10px] font-semibold text-ink-muted">{t('status.demoBadge')}</span></div>
            </article>
            <article className="md:mt-20">
              <div className="relative aspect-[1.15] overflow-hidden bg-[#EEE9E1] p-7 md:p-10">
                <div className="absolute inset-6 border border-ink/15"/>
                <div className="absolute start-[18%] top-[15%] h-[69%] w-[64%] rounded-t-[48%] bg-[#C2648A]"/>
                <div className="absolute start-[30%] top-[29%] h-[39%] w-[40%] rounded-full border border-[#FBFAF7]/80"/>
                <span className="absolute bottom-9 end-9 text-[10px] font-bold uppercase tracking-[.2em] text-[#4734BA]">{t('home.work.visualTwo')}</span>
              </div>
              <div className="mt-5 flex items-center justify-between gap-4"><div><span className="text-[10px] font-bold uppercase tracking-[.18em] text-rose">{t('pages.work.studyLabel')}</span><h2 className="mt-2 text-xl font-bold text-ink">{t('home.work.caseTwo')}</h2></div><span className="border border-ink/15 px-3 py-2 text-[10px] font-semibold text-ink-muted">{t('status.demoBadge')}</span></div>
            </article>
          </div>
          <p className="mt-12 max-w-3xl border-s-2 border-rose ps-5 text-sm leading-8 text-ink-muted">{t('pages.work.disclaimer')}</p>
        </Container>
      </Section>
    </>
  );
}

export function StorePage(): JSX.Element {
  const { t } = useTranslation();
  return (
    <>
      <PageIntro eyebrow={t('pages.store.eyebrow')} title={t('pages.store.title')} body={t('pages.store.body')}/>
      <Section tone="surface" spacing="xl">
        <Container width="wide">
          <div className="relative overflow-hidden border border-ink/15 bg-paper px-6 py-20 text-center md:px-12">
            <div aria-hidden="true" className="pointer-events-none absolute -end-16 -top-24 h-64 w-64 rounded-full border border-brand/15"/>
            <div aria-hidden="true" className="pointer-events-none absolute -start-16 -bottom-28 h-56 w-56 rounded-full border border-rose/20"/>
            <div className="relative mx-auto flex h-16 w-16 items-center justify-center border border-brand/30 text-brand">
              <svg viewBox="0 0 32 32" className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth="1.2"><path d="M5 10h22l-2 17H7L5 10Z"/><path d="M11 12V8a5 5 0 0 1 10 0v4"/></svg>
            </div>
            <p className="relative mt-8 text-[10px] font-bold uppercase tracking-[.22em] text-brand">{t('pages.store.status')}</p>
            <h2 className="relative mt-4 text-3xl font-bold text-ink md:text-4xl">{t('pages.store.emptyTitle')}</h2>
            <p className="relative mx-auto mt-4 max-w-xl text-sm leading-8 text-ink-muted">{t('pages.store.emptyBody')}</p>
          </div>
        </Container>
      </Section>
    </>
  );
}

export function ContactPage(): JSX.Element {
  const { t } = useTranslation();
  return (
    <>
      <PageIntro eyebrow={t('pages.contact.eyebrow')} title={t('pages.contact.title')} body={t('pages.contact.body')}/>
      <Section tone="surface" spacing="xl">
        <Container width="wide">
          <div className="grid gap-10 md:grid-cols-[.8fr_1.2fr]">
            <div><p className="text-[10px] font-bold uppercase tracking-[.2em] text-brand">{t('pages.contact.noteKicker')}</p><h2 className="mt-4 text-3xl font-bold leading-tight text-ink">{t('pages.contact.noteTitle')}</h2></div>
            <div className="border-s-2 border-rose ps-6"><p className="text-sm leading-8 text-ink-muted">{t('pages.contact.notice')}</p><p className="mt-6 text-xs text-ink-faint">{t('pages.contact.noteFoot')}</p></div>
          </div>
        </Container>
      </Section>
    </>
  );
}

export function AboutPage(): JSX.Element {
  const { t } = useTranslation();
  const values = ['clarity', 'care', 'craft'];
  return (
    <>
      <PageIntro eyebrow={t('pages.about.eyebrow')} title={t('pages.about.title')} body={t('pages.about.body')}/>
      <Section tone="surface" spacing="xl">
        <Container width="wide">
          <div className="grid gap-12 md:grid-cols-[.9fr_1.1fr]">
            <p className="max-w-lg text-2xl font-medium leading-10 text-ink md:text-3xl">{t('pages.about.statement')}</p>
            <div className="border-t border-ink/15">
              {values.map((value, index) => <div key={value} className="grid grid-cols-[48px_1fr] gap-4 border-b border-ink/15 py-6"><span className="font-mono text-sm text-rose">0{index + 1}</span><div><h2 className="text-lg font-bold text-ink">{t(`pages.about.values.${value}.title`)}</h2><p className="mt-2 max-w-lg text-sm leading-7 text-ink-muted">{t(`pages.about.values.${value}.body`)}</p></div></div>)}
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
