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
  const families = [
    { number: '01', key: 'subscriptions', mark: 'S', tone: 'bg-[#E9E4F7] text-[#4734BA]' },
    { number: '02', key: 'creative', mark: 'C', tone: 'bg-[#F4E6EA] text-[#A64F73]' },
    { number: '03', key: 'productivity', mark: 'P', tone: 'bg-[#E9EAE3] text-[#52624B]' },
  ];
  return (
    <>
      <PageIntro eyebrow={t('pages.store.eyebrow')} title={t('pages.store.title')} body={t('pages.store.body')}/>
      <Section tone="paper" spacing="lg">
        <Container width="wide">
          <div className="grid gap-10 border-y border-ink/15 py-8 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[.2em] text-brand">{t('pages.store.manifestoKicker')}</p>
              <h2 className="mt-3 max-w-2xl text-2xl font-bold leading-snug text-ink md:text-3xl">{t('pages.store.manifestoTitle')}</h2>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-ink-muted">{t('pages.store.manifestoBody')}</p>
            </div>
            <span className="inline-flex w-fit items-center gap-2 border border-ink/15 px-4 py-3 text-xs font-semibold text-ink-muted">
              <span className="h-2 w-2 rounded-full bg-rose" />
              {t('pages.store.status')}
            </span>
          </div>
          <div className="mt-16 flex flex-wrap items-end justify-between gap-5">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[.22em] text-brand">{t('pages.store.familiesKicker')}</p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-ink md:text-4xl">{t('pages.store.familiesTitle')}</h2>
            </div>
            <p className="max-w-sm text-sm leading-7 text-ink-muted">{t('pages.store.familiesBody')}</p>
          </div>
          <div className="mt-8 grid border-t border-ink/15 md:grid-cols-3 md:divide-x md:divide-ink/15">
            {families.map((family) => (
              <article key={family.key} className="group border-b border-ink/15 py-8 md:border-b-0 md:px-7 md:first:ps-0 md:last:pe-0">
                <div className="flex items-start justify-between">
                  <span className="font-mono text-xs text-rose">{family.number}</span>
                  <span className={`flex h-12 w-12 items-center justify-center text-lg font-display font-bold ${family.tone}`}>{family.mark}</span>
                </div>
                <h3 className="mt-8 text-xl font-bold text-ink">{t(`pages.store.families.${family.key}.title`)}</h3>
                <p className="mt-3 min-h-14 text-sm leading-7 text-ink-muted">{t(`pages.store.families.${family.key}.body`)}</p>
                <p className="mt-7 border-t border-ink/10 pt-4 text-[10px] font-bold uppercase tracking-[.16em] text-ink-faint">{t('pages.store.preparing')}</p>
              </article>
            ))}
          </div>
        </Container>
      </Section>
      <Section tone="surface" spacing="xl">
        <Container width="wide">
          <div className="grid gap-12 md:grid-cols-[.8fr_1.2fr]">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[.22em] text-brand">{t('pages.store.purchaseKicker')}</p>
              <h2 className="mt-4 text-3xl font-bold leading-tight text-ink md:text-4xl">{t('pages.store.purchaseTitle')}</h2>
              <p className="mt-4 text-sm leading-8 text-ink-muted">{t('pages.store.purchaseBody')}</p>
            </div>
            <div className="border-t border-ink/15">
              <div className="grid gap-4 border-b border-ink/15 py-6 sm:grid-cols-[120px_1fr] sm:items-center">
                <span className="text-xs font-bold uppercase tracking-[.14em] text-brand">PayPal</span>
                <p className="text-sm leading-7 text-ink-muted">{t('pages.store.paypal')}</p>
              </div>
              <div className="grid gap-4 border-b border-ink/15 py-6 sm:grid-cols-[120px_1fr] sm:items-center">
                <span className="text-xs font-bold uppercase tracking-[.14em] text-brand">BaridiMob</span>
                <p className="text-sm leading-7 text-ink-muted">{t('pages.store.baridimob')}</p>
              </div>
              <p className="pt-5 text-xs leading-6 text-ink-faint">{t('pages.store.safetyNote')}</p>
            </div>
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
