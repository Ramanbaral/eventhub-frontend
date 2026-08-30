import { ErrorIcon } from "react-hot-toast";

interface EventErrorProps {
  title?: string;
  message: string;
  fullPage?: boolean;
}

export default function EventError({
  title = "Something went wrong",
  message,
  fullPage = false,
}: EventErrorProps) {
  return (
    <div
      className={
        fullPage
          ? "flex min-h-[60vh] flex-col items-center justify-center p-8 text-center"
          : "flex flex-col items-center justify-center rounded-2xl border border-red-200 bg-red-50 p-12 text-center"
      }
    >
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
        <ErrorIcon />
      </div>
      <h3 className="text-lg font-semibold text-red-800">{title}</h3>
      <p className="mt-1 max-w-md text-sm text-red-600">{message}</p>
    </div>
  );
}
