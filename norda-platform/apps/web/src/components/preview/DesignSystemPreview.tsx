import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Container } from '@/components/layout/Container';
import { Section } from '@/components/layout/Section';
import { Stack } from '@/components/layout/Stack';
import { Rule } from '@/components/layout/Rule';
import { Button } from '@/components/primitives/Button';
import { Input } from '@/components/primitives/Input';
import { Textarea } from '@/components/primitives/Textarea';
import { Label } from '@/components/primitives/Label';
import { Field } from '@/components/primitives/Field';
import { Select } from '@/components/primitives/Select';
import { Checkbox } from '@/components/primitives/Checkbox';
import { RadioGroup } from '@/components/primitives/RadioGroup';
import { Switch } from '@/components/primitives/Switch';
import { Badge } from '@/components/primitives/Badge';
import { Tooltip } from '@/components/primitives/Tooltip';
import { Modal } from '@/components/primitives/Modal';
import { Drawer } from '@/components/primitives/Drawer';
import { Skeleton } from '@/components/primitives/Skeleton';
import { EmptyState } from '@/components/primitives/EmptyState';
import { ErrorState } from '@/components/primitives/ErrorState';
import { Spinner } from '@/components/primitives/Spinner';
import { Table, TBody, TD, TH, THead, TR } from '@/components/primitives/Table';
import { Pagination } from '@/components/primitives/Pagination';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/primitives/Tabs';
import { useToast } from '@/components/primitives/Toast';

/**
 * B1 visual QA surface. Renders every primitive in every state so that
 * AlphaCode can eyeball both locales and both directions before B2.
 * This component is DELETED in B4 when the real Home page lands.
 */
export function DesignSystemPreview(): JSX.Element {
  const { t } = useTranslation();
  const { push } = useToast();
  const [modalOpen, setModalOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [checked, setChecked] = useState<boolean | 'indeterminate'>(false);
  const [radio, setRadio] = useState('option-a');
  const [sw, setSw] = useState(false);
  const [page, setPage] = useState(1);

  return (
    <>
      <Section tone="surface">
        <Container>
          <Stack gap={8}>
            <Block title="Buttons">
              <Stack direction="row" wrap gap={3}>
                <Button variant="primary">{t('actions.save')}</Button>
                <Button variant="secondary">{t('actions.cancel')}</Button>
                <Button variant="ghost">{t('actions.edit')}</Button>
                <Button variant="danger">{t('actions.delete')}</Button>
                <Button variant="link">{t('actions.readMore')}</Button>
                <Button variant="primary" loading>
                  {t('actions.loading')}
                </Button>
                <Button variant="primary" disabled>
                  {t('actions.submit')}
                </Button>
              </Stack>
            </Block>

            <Block title="Badges">
              <Stack direction="row" wrap gap={2}>
                <Badge tone="neutral">Neutral</Badge>
                <Badge tone="brand">Brand</Badge>
                <Badge tone="rose">Rose</Badge>
                <Badge tone="success">Success</Badge>
                <Badge tone="warning">Warning</Badge>
                <Badge tone="danger">Danger</Badge>
                <Badge tone="info">Info</Badge>
                <Badge tone="demo">Demo</Badge>
              </Stack>
            </Block>

            <Block title="Form controls">
              <div className="grid gap-6 md:grid-cols-2">
                <Field label="Input" htmlFor="preview-input" hint="Helper text">
                  <Input id="preview-input" placeholder="hello@norda.studio" />
                </Field>
                <Field label="Input (invalid)" htmlFor="preview-input-invalid" error="This field is required">
                  <Input id="preview-input-invalid" invalid placeholder="Invalid state" />
                </Field>
                <Field label="Select" htmlFor="preview-select">
                  <Select
                    id="preview-select"
                    value={radio}
                    onValueChange={setRadio}
                    options={[
                      { value: 'option-a', label: 'Option A' },
                      { value: 'option-b', label: 'Option B' },
                      { value: 'option-c', label: 'Option C' },
                    ]}
                  />
                </Field>
                <Field label="Textarea" htmlFor="preview-textarea">
                  <Textarea id="preview-textarea" placeholder="Long-form text..." />
                </Field>
              </div>
            </Block>

            <Block title="Selection">
              <Stack gap={4}>
                <Checkbox
                  id="preview-checkbox"
                  checked={checked}
                  onCheckedChange={setChecked}
                  label="Accept the demo terms"
                  hint="This checkbox is for preview purposes only."
                />
                <RadioGroup
                  name="preview-radio"
                  value={radio}
                  onValueChange={setRadio}
                  aria-label="Radio preview"
                  options={[
                    { value: 'option-a', label: 'Option A', hint: 'First' },
                    { value: 'option-b', label: 'Option B', hint: 'Second' },
                    { value: 'option-c', label: 'Option C', hint: 'Third' },
                  ]}
                />
                <Switch
                  id="preview-switch"
                  checked={sw}
                  onCheckedChange={setSw}
                  label="Enable notifications"
                />
              </Stack>
            </Block>

            <Block title="Overlays">
              <Stack direction="row" wrap gap={3}>
                <Button variant="secondary" onClick={() => setModalOpen(true)}>
                  Open modal
                </Button>
                <Button variant="secondary" onClick={() => setDrawerOpen(true)}>
                  Open drawer
                </Button>
                <Tooltip content="This is a tooltip">
                  <Button variant="ghost">Hover me</Button>
                </Tooltip>
                <Button variant="secondary" onClick={() => push('Toast message', 'success')}>
                  Show toast
                </Button>
              </Stack>
            </Block>

            <Block title="States">
              <div className="grid gap-6 md:grid-cols-3">
                <div>
                  <p className="mb-2 text-xs uppercase tracking-wider text-ink-muted">Skeleton</p>
                  <Stack gap={2}>
                    <Skeleton className="h-3 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                    <Skeleton className="h-3 w-2/3" />
                  </Stack>
                </div>
                <div>
                  <p className="mb-2 text-xs uppercase tracking-wider text-ink-muted">Spinner</p>
                  <Spinner />
                </div>
                <div>
                  <p className="mb-2 text-xs uppercase tracking-wider text-ink-muted">Empty</p>
                  <EmptyState title="No items" description="Nothing to show yet." />
                </div>
              </div>
              <div className="mt-6">
                <ErrorState title="Something went wrong" description="This is a preview of the error state." onRetry={() => undefined} />
              </div>
            </Block>

            <Block title="Table + Pagination">
              <Table>
                <THead>
                  <TR>
                    <TH>Item</TH>
                    <TH>Status</TH>
                    <TH>Amount</TH>
                  </TR>
                </THead>
                <TBody>
                  <TR>
                    <TD>Demo product A</TD>
                    <TD>
                      <Badge tone="demo">Demo</Badge>
                    </TD>
                    <TD className="numeric">$25.00</TD>
                  </TR>
                  <TR>
                    <TD>Demo product B</TD>
                    <TD>
                      <Badge tone="success">Available</Badge>
                    </TD>
                    <TD className="numeric">$40.00</TD>
                  </TR>
                </TBody>
              </Table>
              <div className="mt-4">
                <Pagination
                  page={page}
                  pageSize={10}
                  total={100}
                  onPageChange={setPage}
                  labels={{
                    previous: t('actions.previous'),
                    next: t('actions.next'),
                    pageOf: (p, tot) => `${p} / ${tot}`,
                  }}
                />
              </div>
            </Block>

            <Block title="Tabs">
              <Tabs defaultValue="one">
                <TabsList>
                  <TabsTrigger value="one">One</TabsTrigger>
                  <TabsTrigger value="two">Two</TabsTrigger>
                  <TabsTrigger value="three">Three</TabsTrigger>
                </TabsList>
                <TabsContent value="one">Content for tab one.</TabsContent>
                <TabsContent value="two">Content for tab two.</TabsContent>
                <TabsContent value="three">Content for tab three.</TabsContent>
              </Tabs>
            </Block>

            <Rule />

            <Block title="Typography">
              <Stack gap={4}>
                <h1 className="font-display text-5xl text-ink">Display 5xl</h1>
                <h2 className="font-display text-4xl text-ink">Display 4xl</h2>
                <h3 className="font-display text-2xl text-ink">Display 2xl</h3>
                <p className="text-lg text-ink">Lead paragraph — elegant, professional, quietly confident.</p>
                <p className="max-w-prose text-base text-ink-muted">
                  Body copy sits at 16px with generous line-height for Arabic script. Latin copy stays
                  at 1.6; Arabic relaxes to 1.75 to accommodate diacritic heights. Every heading is
                  Tajawal in Arabic and Manrope in English — same weight, same rhythm.
                </p>
                <p className="text-sm text-ink-muted">Small — metadata and helper text.</p>
                <p className="text-xs uppercase tracking-wider text-ink-muted">Overline — section eyebrows.</p>
              </Stack>
            </Block>
          </Stack>
        </Container>
      </Section>

      <Modal
        open={modalOpen}
        onOpenChange={setModalOpen}
        title="Demo modal"
        description="A modal primitive — accessible, keyboard-dismissable."
        footer={
          <>
            <Button variant="ghost" onClick={() => setModalOpen(false)}>
              {t('actions.cancel')}
            </Button>
            <Button variant="primary" onClick={() => setModalOpen(false)}>
              {t('actions.confirm')}
            </Button>
          </>
        }
      >
        <p className="text-sm text-ink-muted">Modal body content.</p>
      </Modal>

      <Drawer
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        title="Demo drawer"
        description="Slides from the reading-start side."
      >
        <p className="text-sm text-ink-muted">
          The drawer respects RTL/LTR direction via reading-start/end, not physical left/right.
        </p>
      </Drawer>
    </>
  );
}

function Block({ title, children }: { title: string; children: React.ReactNode }): JSX.Element {
  return (
    <div>
      <p className="mb-4 text-xs font-medium uppercase tracking-[0.14em] text-ink-muted">{title}</p>
      {children}
    </div>
  );
}