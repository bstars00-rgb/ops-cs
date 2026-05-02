import { cn } from "@/lib/utils";

export function PageHeader({
  title,
  subtitle,
  actions,
  className,
}: {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("border-b border-border bg-bg-soft px-6 py-4 flex items-start gap-4", className)}>
      <div className="flex-1 min-w-0">
        <h1 className="text-lg font-semibold text-fg">{title}</h1>
        {subtitle && (
          <p className="text-xs text-fg-muted mt-0.5">{subtitle}</p>
        )}
      </div>
      {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
    </div>
  );
}
