import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Container } from '@/components/layout/Container';
import { Section } from '@/components/layout/Section';

function FlowerMark({ className = '' }: { className?: string }): JSX.Element {
  return (
    <svg viewBox="0 0 360 390" fill="none" className={className} role="img" aria-label="NorDa flower mark">
      <circle cx="180" cy="180" r="154" stroke="currentColor" strokeOpacity=".16" />
      <circle cx="180" cy="180" r="122" stroke="currentColor" strokeOpacity=".24" strokeDasharray="2 9" />
      <path d="M180 278C123 235 91 181 116 129C139 81 185 76 207 119C230 164 207 220 180 278Z" fill="currentColor" fillOpacity=".12" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M180 278C237 235 269 181 244 129C221 81 175 76 153 119C130 164 153 220 180 278Z" fill="#C2648A" fillOpacity=".14" stroke="#C2648A" strokeWidth="1.5"/>
      <path d="M180 278C162 218 162 153 180 70C198 153 198 218 180 278Z" fill="currentColor" fillOpacity=".18" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M180 278V327" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M180 326C151 314 132 315 113 327M180 326C209 314 228 315 247 327" stroke="#C2648A" strokeWidth="1.5" strokeLinecap="round"/>
      <circle cx="180" cy="178" r="8" fill="#C2648A"/>
    </svg>
  );
}

export function HomePage(): JSX.Element {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language.startsWith('ar');
  const arrow = isArabic ? '←' : '→';
  const services = [
    { number: '01', title: t('home.services.web.title'), body: t('home.services.web.body'), tag: t('home.discipline.digital') },
    { number: '02', title: t('home.services.identity.title'), body: t('home.services.identity.body'), tag: t('home.discipline.identity') },
    { number: '03', title: t('home.services.digital.title'), body: t('home.services.digital.body'), tag: t('home.discipline.tools') },
  ];
  const steps = ['discover', 'shape', 'make'];

  return (
    <>
      <section className="relative isolate overflow-hidden bg-paper">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -end-44 -top-56 h-[34rem] w-[34rem] rounded-full border border-brand/10" />
          <div className="absolute -end-24 -top-36 h-[26rem] w-[26rem] rounded-full border border-brand/10" />
          <div className="absolute end-20 top-28 h-2 w-2 rounded-full bg-rose" />
          <div className="absolute start-[7%] bottom-20 h-24 w-24 rounded-full border border-rose/20" />
        </div>
        <Container width="wide">
          <div className="relative grid min-h-[650px] items-center gap-10 py-16 md:grid-cols-[1.08fr_.92fr] md:py-24 lg:min-h-[720px]">
            <div className="relative z-10 max-w-3xl">
              <p className="mb-8 flex items-center gap-3 text-[11px] font-bold uppercase tracking-[.22em] text-brand">
                <span className="h-px w-10 bg-rose" />{t('home.eyebrow')}
              </p>
              <h1 className="max-w-[13ch] text-[clamp(3.2rem,7vw,6.8rem)] font-bold leading-[.98] tracking-[-.055em] text-ink">
                {t('home.hero.titleA')} <span className="relative inline-block text-brand">{t('home.hero.titleB')}<svg aria-hidden="true" viewBox="0 0 260 14" className="absolute -bottom-3 start-0 h-3 w-full text-rose"><path d="M3 10C68 1 176 1 257 8" stroke="currentColor" strokeWidth="3" strokeLinecap="round" fill="none"/></svg></span>
              </h1>
              <p className="mt-9 max-w-xl text-base leading-8 text-ink-muted md:text-lg">{t('home.hero.body')}</p>
              <div className="mt-10 flex flex-wrap items-center gap-5">
                <Link to="/services" className="group inline-flex min-h-14 items-center gap-5 bg-brand px-7 py-4 text-sm font-semibold text-white transition duration-300 hover:bg-brand-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2">
                  {t('home.hero.primary')} <span className="transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true">{arrow}</span>
                </Link>
                <Link to="/work" className="inline-flex min-h-14 items-center gap-3 border-b border-ink/25 px-1 py-3 text-sm font-semibold text-ink transition hover:border-brand hover:text-brand">
                  {t('home.hero.secondary')} <span aria-hidden="true">↗</span>
                </Link>
              </div>
              <div className="mt-16 flex flex-wrap items-center gap-x-8 gap-y-3 border-t border-ink/10 pt-6 text-xs font-medium text-ink-muted">
                <span>{t('home.hero.noteOne')}</span><span className="h-1 w-1 rounded-full bg-rose"/><span>{t('home.hero.noteTwo')}</span>
              </div>
            </div>
            <div className="relative mx-auto w-full max-w-[490px]">
              <div className="relative aspect-[.9] overflow-hidden bg-surface">
                <div className="absolute inset-4 border border-brand/20 md:inset-6"/>
                <div className="absolute inset-0 flex items-center justify-center p-7 text-brand">
                  <FlowerMark className="w-full max-w-[350px] transition-transform duration-700 hover:rotate-3"/>
                </div>
                <div className="absolute start-0 top-[18%] border border-rose/30 bg-paper px-4 py-3 shadow-sm">
                  <span className="block text-[9px] font-bold uppercase tracking-[.2em] text-rose">{t('home.art.kicker')}</span>
                  <span className="mt-1 block font-display text-lg font-bold text-ink">{t('home.art.title')}</span>
                </div>
                <div className="absolute bottom-0 end-0 max-w-[75%] bg-paper/95 px-5 py-4">
                  <p className="text-[10px] font-semibold uppercase tracking-[.2em] text-brand">{t('home.art.stamp').replace(/\n/g, ' · ')}</p>
                </div>
              </div>
              <span aria-hidden="true" className="absolute -end-4 bottom-16 h-3 w-3 rounded-full bg-rose"/>
            </div>
          </div>
        </Container>
      </section>

      <Section tone="surface" spacing="lg">
        <Container width="wide">
          <div className="grid gap-8 border-y border-ink/15 py-8 md:grid-cols-[.7fr_1.3fr] md:items-center md:py-10">
            <p className="text-xs font-bold uppercase tracking-[.2em] text-brand">{t('home.intro.kicker')}</p>
            <p className="max-w-3xl text-xl font-medium leading-9 text-ink md:text-2xl">{t('home.intro.title')}</p>
          </div>
          <div className="mt-14 grid md:grid-cols-3">
            {services.map((service) => (
              <article key={service.number} className="group border-b border-ink/15 py-8 md:border-b-0 md:border-e md:px-7 md:first:ps-0 md:last:border-e-0">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs text-ink-faint">{service.number}</span>
                  <span className="text-[10px] font-bold uppercase tracking-[.16em] text-rose">{service.tag}</span>
                </div>
                <h2 className="mt-10 text-2xl font-bold text-ink transition-colors group-hover:text-brand">{service.title}</h2>
                <p className="mt-4 max-w-xs text-sm leading-7 text-ink-muted">{service.body}</p>
                <Link to="/services" className="mt-7 inline-flex items-center gap-3 text-xs font-bold text-brand">{t('actions.readMore')} <span aria-hidden="true">↗</span></Link>
              </article>
            ))}
          </div>
        </Container>
      </Section>

      <Section tone="paper" spacing="xl">
        <Container width="wide">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[.22em] text-brand">{t('home.work.kicker')}</p>
              <h2 className="mt-4 max-w-2xl text-4xl font-bold leading-tight tracking-tight text-ink md:text-5xl">{t('home.work.title')}</h2>
              <p className="mt-4 max-w-xl text-sm leading-7 text-ink-muted">{t('home.work.body')}</p>
            </div>
            <Link to="/work" className="border-b border-brand pb-2 text-sm font-semibold text-brand">{t('home.work.link')} <span aria-hidden="true">↗</span></Link>
          </div>
          <div className="mt-14 grid gap-7 md:grid-cols-2">
            <Link to="/work" className="group block">
              <div className="relative aspect-[1.22] overflow-hidden bg-[#EAE5F5] p-6 md:p-9">
                <div className="absolute inset-5 border border-[#5A46D6]/20 md:inset-7"/>
                <div className="absolute start-[13%] top-[16%] h-[66%] w-[48%] bg-[#5A46D6] transition duration-500 group-hover:rotate-[-4deg] group-hover:scale-[1.04]"/>
                <div className="absolute end-[12%] top-[26%] h-[48%] w-[38%] border-[10px] border-[#C2648A] bg-[#FBFAF7] transition-transform duration-500 group-hover:translate-y-[-5px]"/>
                <span className="absolute bottom-9 start-9 text-[10px] font-bold uppercase tracking-[.2em] text-[#4734BA]">{t('home.work.visualOne')}</span>
              </div>
              <div className="mt-4 flex items-center justify-between gap-4"><span className="font-semibold text-ink">{t('home.work.caseOne')}</span><span className="text-sm text-brand">↗</span></div>
            </Link>
            <Link to="/work" className="group block md:mt-16">
              <div className="relative aspect-[1.22] overflow-hidden bg-[#EEE9E1] p-6 md:p-9">
                <div className="absolute inset-5 border border-[#141225]/15 md:inset-7"/>
                <div className="absolute start-[18%] top-[15%] h-[69%] w-[64%] rounded-t-[48%] bg-[#C2648A] transition-transform duration-500 group-hover:scale-[1.04]"/>
                <div className="absolute start-[30%] top-[29%] h-[39%] w-[40%] rounded-full border border-[#FBFAF7]/80"/>
                <span className="absolute bottom-9 end-9 text-[10px] font-bold uppercase tracking-[.2em] text-[#4734BA]">{t('home.work.visualTwo')}</span>
              </div>
              <div className="mt-4 flex items-center justify-between gap-4"><span className="font-semibold text-ink">{t('home.work.caseTwo')}</span><span className="text-sm text-brand">↗</span></div>
            </Link>
          </div>
          <p className="mt-7 border-s-2 border-rose ps-4 text-xs leading-6 text-ink-faint">{t('home.work.disclaimer')}</p>
        </Container>
      </Section>

      <Section tone="surface" spacing="xl">
        <Container width="wide">
          <div className="grid gap-12 md:grid-cols-[.8fr_1.2fr]">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[.22em] text-brand">{t('home.process.kicker')}</p>
              <h2 className="mt-4 max-w-md text-4xl font-bold leading-tight text-ink md:text-5xl">{t('home.process.title')}</h2>
              <p className="mt-5 max-w-sm text-sm leading-7 text-ink-muted">{t('home.process.body')}</p>
            </div>
            <div className="border-t border-ink/15">
              {steps.map((step, index) => (
                <div key={step} className="grid grid-cols-[52px_1fr] gap-5 border-b border-ink/15 py-6 md:grid-cols-[72px_1fr] md:py-8">
                  <span className="font-mono text-sm text-rose">0{index + 1}</span>
                  <div><h3 className="text-xl font-bold text-ink">{t(`home.process.steps.${step}.title`)}</h3><p className="mt-2 max-w-xl text-sm leading-7 text-ink-muted">{t(`home.process.steps.${step}.body`)}</p></div>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </Section>

      <section className="relative isolate overflow-hidden bg-ink py-20 text-paper md:py-28">
        <Container width="wide">
          <div className="relative z-10 grid gap-10 md:grid-cols-[1fr_auto] md:items-center">
            <div className="max-w-2xl">
              <p className="text-[10px] font-bold uppercase tracking-[.22em] text-[#D8CFFA]">{t('home.store.kicker')}</p>
              <h2 className="mt-5 text-4xl font-bold leading-tight md:text-5xl">{t('home.store.title')}</h2>
              <p className="mt-5 max-w-xl text-sm leading-8 text-paper/70 md:text-base">{t('home.store.body')}</p>
            </div>
            <Link to="/store" className="inline-flex min-h-14 items-center justify-center gap-5 border border-paper/40 px-7 py-4 text-sm font-semibold text-paper transition hover:border-paper hover:bg-paper hover:text-ink">{t('home.store.link')} <span aria-hidden="true">↗</span></Link>
          </div>
          <div aria-hidden="true" className="pointer-events-none absolute -end-28 -top-44 h-[28rem] w-[28rem] rounded-full border border-paper/10"/>
          <div aria-hidden="true" className="pointer-events-none absolute -end-8 -top-24 h-[18rem] w-[18rem] rounded-full border border-rose/30"/>
        </Container>
      </section>

      <Section tone="paper" spacing="xl">
        <Container width="wide">
          <div className="relative overflow-hidden border-y border-ink/15 py-12 md:py-16">
            <div aria-hidden="true" className="pointer-events-none absolute -end-12 -top-16 h-48 w-48 rounded-full border border-rose/25"/>
            <div className="relative flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
              <div className="max-w-2xl">
                <p className="text-[10px] font-bold uppercase tracking-[.22em] text-brand">{t('home.contact.kicker')}</p>
                <h2 className="mt-4 text-4xl font-bold leading-tight text-ink md:text-5xl">{t('home.contact.title')}</h2>
              </div>
              <Link to="/contact" className="inline-flex min-h-14 shrink-0 items-center justify-center gap-5 bg-brand px-7 py-4 text-sm font-semibold text-white transition hover:bg-brand-strong">{t('home.contact.link')} <span aria-hidden="true">↗</span></Link>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
