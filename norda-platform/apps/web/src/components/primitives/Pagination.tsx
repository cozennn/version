import { cn } from '@/lib/cn';
import { Button } from './Button';

export interface PaginationProps {
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
  labels: { previous: string; next: string; pageOf: (page: number, total: number) => string };
  className?: string;
}

export function Pagination({ page, pageSize, total, onPageChange, labels, className }: PaginationProps): JSX.Element {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const canPrev = page > 1;
  const canNext = page < totalPages;
  return (
    <nav aria-label="Pagination" className={cn('flex items-center justify-between gap-3', className)}>
      <Button variant="secondary" size="sm" disabled={!canPrev} onClick={() => onPageChange(page - 1)}>
        {labels.previous}
      </Button>
      <span className="text-sm text-ink-muted numeric">{labels.pageOf(page, totalPages)}</span>
      <Button variant="secondary" size="sm" disabled={!canNext} onClick={() => onPageChange(page + 1)}>
        {labels.next}
      </Button>
    </nav>
  );
}