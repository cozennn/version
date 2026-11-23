import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/cn';
export interface BreadcrumbItem { label: ReactNode; to?: string; }
export function Breadcrumbs({ items, label='Breadcrumb', className }: { items: BreadcrumbItem[]; label?: string; className?: string }): JSX.Element {
  return <nav aria-label={label} className={className}><ol className="flex flex-wrap items-center gap-2 text-sm text-ink-muted">{items.map((item,index)=><li key={index} className="inline-flex items-center gap-2">{index>0 && <span aria-hidden="true" className="text-ink-faint">/</span>}{item.to && index!==items.length-1 ? <Link className="hover:text-brand" to={item.to}>{item.label}</Link> : <span className={cn(index===items.length-1 && 'font-medium text-ink')} aria-current={index===items.length-1 ? 'page' : undefined}>{item.label}</span>}</li>)}</ol></nav>;
}