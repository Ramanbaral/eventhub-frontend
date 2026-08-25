import { CalendarClock } from "lucide-react";

function EmptyState({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="flex min-h-[450px] flex-col items-center justify-center rounded-3xl border-2 border-dashed border-slate-200/80 bg-white/50 p-12 text-center">
      <div className="mb-6 rounded-2xl bg-slate-50 p-5 text-slate-400">
        <CalendarClock className="h-12 w-12" strokeWidth={1.5} />
      </div>
      <h3 className="mb-2.5 text-[22px] font-bold text-slate-900">{title}</h3>
      <p className="mb-8 max-w-[420px] text-[15px] leading-relaxed text-slate-500">
        {description}
      </p>
    </div>
  );
}

export default EmptyState;
