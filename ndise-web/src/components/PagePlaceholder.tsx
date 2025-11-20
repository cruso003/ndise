import { type ReactNode } from 'react';
import { Card } from './ui';
import { Construction } from 'lucide-react';

interface PagePlaceholderProps {
  title: string;
  description: string;
  icon?: ReactNode;
}

export default function PagePlaceholder({ title, description, icon }: PagePlaceholderProps) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--color-text)]">{title}</h1>
        <p className="text-[var(--color-text-secondary)]">{description}</p>
      </div>

      <Card padding="lg">
        <div className="flex flex-col items-center justify-center py-12 text-center">
          {icon || <Construction size={64} className="text-[var(--color-text-secondary)] mb-4" />}
          <h3 className="text-lg font-semibold text-[var(--color-text)] mb-2">
            Page Under Construction
          </h3>
          <p className="text-[var(--color-text-secondary)] max-w-md">
            This page is being built with rich features including data tables, forms, analytics, and more.
          </p>
        </div>
      </Card>
    </div>
  );
}
