import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Container } from '@/components/layout/Container';
import { Section } from '@/components/layout/Section';

export function HomePage(): JSX.Element {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language.startsWith('ar');

  const services = [
    { number: '01', title: t('home.services.web.title'), body: t('home.services.web.body'), mark: '↗' },
    { number: '02', title: t('home.services.identity.title'), body: t('home.services.identity.body'), mark: '✳' },
    { number: '03', title: t('home.services.digital.title'), body: t('home.services.digital.body'), mark: '◈' },
  ];

  return (
    <>
      <section className="relative isolate overflow-hidden bg-paper">
        <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 end-0 w-[48%] opacity-70">
          <div className="absolute end-[-9rem] top-[-10rem] h-[34rem] w-[34rem] rounded-full border border-brand/15" />
          <div className="absolute end-[-4rem] top-[-5rem] h-[24rem] w-[24rem] rounded-full border border-brand/20" />
          <div className="absolute end-[2rem] top-[1rem] h-[12rem] w-[12rem] rounded-full border border-rose/30" />
          <div className="absolute end-[7.5rem] top-[6.5rem] h-8 w-8 rotate-45 border border-brand/40 bg-brand-soft" />
          <div className="absolute end-[12rem] top-[15rem] h-3 w-3 rounded-full bg-rose" />
        </div>
        <Container>
          <div className="relative grid min-h-[660px] items-center gap-12 py-20 md:grid-cols-[1.1fr_.9fr] md:py-28">
            <div className="max-w-2xl">
              <div className="mb-8 inline-flex items-center gap-3 text-xs font-semibold tracking-[.18em] text-brand">
                <span className="h-px w-9 bg-brand" />
                {t('home.eyebrow')}
              </div>
              <h1 className="max-w-[12ch] text-5xl font-bold leading-[1.12] tracking-[-.045em] text-ink sm:text-6xl lg:text-[5.3rem]">
                {t('home.hero.titleA')} <span className="relative inline-block text-brand">{t('home.hero.titleB')}<svg aria-hidden="true" className="absolute -bottom-2 start-0 h-3 w-full text-rose" viewBox="0 0 240 12" fill="none"><path d="M2 9C58 1 156 1 238 7" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/></svg></span>
              </h1>
              <p className="mt-8 max-w-xl text-lg leading-8 text-ink-muted">{t('home.hero.body')}</p>
              <div className="mt-10 flex flex-wrap items-center gap-4">
                <Link to="/services" className="inline-flex min-h-12 items-center gap-4 bg-brand px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2">
                  {t('home.hero.primary')} <span aria-hidden="true">{isArabic ? '←' : '→'}</span>
                </Link>
                <Link to="/work" className="inline-flex min-h-12 items-center gap-3 border-b border-ink/25 px-1 py-3 text-sm font-semibold text-ink transition hover:border-brand hover:text-brand">
                  {t('home.hero.secondary')} <span aria-hidden="true">↗</span>
                </Link>
              </div>
              <div className="mt-16 flex flex-wrap items-center gap-x-8 gap-y-3 border-t border-ink/10 pt-6 text-xs text-ink-muted">
                <span>{t('home.hero.noteOne')}</span><span className="h-1 w-1 rounded-full bg-rose" /><span>{t('home.hero.noteTwo')}</span>
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-[440px]">
              <div className="relative aspect-[.88] overflow-hidden bg-surface">
                <div className="absolute inset-5 border border-brand/20" />
                <div className="absolute inset-x-0 top-[18%] flex justify-center">
                  <svg viewBox="0 0 320 320" className="w-[78%] text-brand" fill="none" aria-label={t('home.art.alt')} role="img">
                    <circle cx="160" cy="160" r="128" stroke="currentColor" strokeOpacity=".18"/>
                    <circle cx="160" cy="160" r="96" stroke="currentColor" strokeOpacity=".32" strokeDasharray="2 8"/>
                    <path d="M160 245C110 205 83 157 105 111C126 66 173 61 193 99C215 140 185 185 160 245Z" fill="#5A46D6" fillOpacity=".12" stroke="currentColor" strokeWidth="1.5"/>
                    <path d="M160 245C210 205 237 157 215 111C194 66 147 61 127 99C105 140 135 185 160 245Z" fill="#C2648A" fillOpacity=".13" stroke="#C2648A" strokeWidth="1.5"/>
                    <path d="M160 245C146 193 145 143 160 82C175 143 174 193 160 245Z" fill="currentColor" fillOpacity=".16" stroke="currentColor" strokeWidth="1.5"/>
                    <path d="M160 245V275" stroke="currentColor" strokeWidth="1.5"/>
                    <circle cx="160" cy="160" r="7" fill="#C2648A"/>
                    <path d="M78 254C108 269 130 276 160 278C190 276 212 269 242 254" stroke="currentColor" strokeOpacity=".35"/>
                  </svg>
                </div>
                <div className="absolute inset-x-0 bottom-0 flex items-end justify-between bg-paper/90 p-6">
                  <div><p className="text-[10px] font-semibold uppercase tracking-[.2em] text-brand">{t('home.art.kicker')}</p><p className="mt-1 font-display text-2xl font-bold text-ink">{t('home.art.title')}</p></div>
                  <span className="mb-1 text-3xl text-rose" aria-hidden="true">✳</span>
                </div>
              </div>
              <div className="absolute -start-5 top-12 hidden h-20 w-20 items-center justify-center rounded-full border border-rose/40 bg-paper text-center text-[10px] font-semibold uppercase leading-4 tracking-wider text-rose sm:flex">{t('home.art.stamp')}</div>
              <div className="absolute -end-4 bottom-24 h-3 w-3 rounded-full bg-brand" />
            </div>
          </div>
        </Container>
      </section>

      <Section tone="surface" spacing="xl">
        <Container>
          <div className="grid gap-8 md:grid-cols-[.7fr_1.3fr] md:items-end">
            <div><p className="text-xs font-semibold uppercase tracking-[.18em] text-brand">{t('home.intro.kicker')}</p><h2 className="mt-4 max-w-md text-3xl font-bold leading-tight text-ink md:text-4xl">{t('home.intro.title')}</h2></div>
            <p className="max-w-2xl text-base leading-8 text-ink-muted md:text-lg">{t('home.intro.body')}</p>
          </div>
          <div className="mt-16 grid border-t border-ink/15 md:grid-cols-3">
            {services.map((service) => <article key={service.number} className="group border-b border-ink/15 py-8 md:border-b-0 md:border-e md:px-7 md:first:ps-0 md:last:border-e-0">
              <div className="flex items-center justify-between"><span className="text-xs tabular-nums text-ink-faint">{service.number}</span><span className="text-2xl text-rose transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" aria-hidden="true">{service.mark}</span></div>
              <h3 className="mt-10 text-2xl font-bold text-ink">{service.title}</h3><p className="mt-3 max-w-xs text-sm leading-7 text-ink-muted">{service.body}</p>
            </article>)}
          </div>
        </Container>
      </Section>

      <Section tone="paper" spacing="xl">
        <Container>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div><p className="text-xs font-semibold uppercase tracking-[.18em] text-brand">{t('home.work.kicker')}</p><h2 className="mt-4 text-3xl font-bold text-ink md:text-4xl">{t('home.work.title')}</h2><p className="mt-3 max-w-xl text-sm leading-7 text-ink-muted">{t('home.work.body')}</p></div>
            <Link to="/work" className="border-b border-brand pb-2 text-sm font-semibold text-brand">{t('home.work.link')} <span aria-hidden="true">↗</span></Link>
          </div>
          <div className="mt-12 grid gap-5 md:grid-cols-2">
            <Link to="/work" className="group block">
              <div className="relative aspect-[1.35] overflow-hidden bg-[#E9E3F3] p-7">
                <div className="absolute inset-7 border border-[#5A46D6]/20" /><div className="absolute start-[12%] top-[18%] h-[62%] w-[48%] bg-[#5A46D6] transition-transform duration-500 group-hover:rotate-[-3deg] group-hover:scale-[1.03]" /><div className="absolute end-[12%] top-[28%] h-[48%] w-[40%] border-[12px] border-[#C2648A] bg-[#F8F1F3]" /><span className="absolute bottom-10 start-10 text-xs font-semibold uppercase tracking-[.2em] text-[#4734BA]">{t('home.work.visualOne')}</span>
              </div>
              <div className="mt-4 flex justify-between gap-4"><span className="font-semibold text-ink">{t('home.work.caseOne')}</span><span className="text-sm text-ink-muted">↗</span></div>
            </Link>
            <Link to="/work" className="group block md:mt-16">
              <div className="relative aspect-[1.35] overflow-hidden bg-[#EDE9DF] p-7">
                <div className="absolute inset-7 border border-[#141225]/15" /><div className="absolute start-[18%] top-[16%] h-[68%] w-[64%] rounded-[48%_48%_4px_4px] bg-[#C2648A] transition-transform duration-500 group-hover:scale-[1.04]" /><div className="absolute start-[30%] top-[30%] h-[38%] w-[40%] rounded-full border border-[#FBFAF7]/80" /><span className="absolute bottom-10 end-10 text-xs font-semibold uppercase tracking-[.2em] text-[#4734BA]">{t('home.work.visualTwo')}</span>
              </div>
              <div className="mt-4 flex justify-between gap-4"><span className="font-semibold text-ink">{t('home.work.caseTwo')}</span><span className="text-sm text-ink-muted">↗</span></div>
            </Link>
          </div>
          <p className="mt-6 text-xs text-ink-faint">{t('home.work.disclaimer')}</p>
        </Container>
      </Section>

      <section className="relative overflow-hidden bg-ink py-20 text-paper md:py-28">
        <Container>
          <div className="relative grid gap-10 md:grid-cols-[1fr_auto] md:items-center">
            <div className="max-w-2xl"><p className="text-xs font-semibold uppercase tracking-[.2em] text-[#D8CFFA]">{t('home.store.kicker')}</p><h2 className="mt-5 text-3xl font-bold leading-tight md:text-5xl">{t('home.store.title')}</h2><p className="mt-5 max-w-xl text-sm leading-8 text-paper/70 md:text-base">{t('home.store.body')}</p></div>
            <Link to="/store" className="inline-flex min-h-12 items-center justify-center gap-4 border border-paper/40 px-6 py-3 text-sm font-semibold text-paper transition hover:border-paper hover:bg-paper hover:text-ink">{t('home.store.link')} <span aria-hidden="true">↗</span></Link>
          </div>
          <div aria-hidden="true" className="pointer-events-none absolute -end-20 -top-36 h-80 w-80 rounded-full border border-paper/10" />
        </Container>
      </section>

      <Section tone="paper" spacing="xl">
        <Container>
          <div className="flex flex-col gap-8 border-y border-ink/15 py-12 md:flex-row md:items-center md:justify-between md:py-16">
            <div><p className="text-xs font-semibold uppercase tracking-[.18em] text-brand">{t('home.contact.kicker')}</p><h2 className="mt-4 max-w-2xl text-3xl font-bold leading-tight text-ink md:text-4xl">{t('home.contact.title')}</h2></div>
            <Link to="/contact" className="inline-flex min-h-12 shrink-0 items-center justify-center gap-4 bg-brand px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-strong">{t('home.contact.link')} <span aria-hidden="true">↗</span></Link>
          </div>
        </Container>
      </Section>
    </>
  );
}
