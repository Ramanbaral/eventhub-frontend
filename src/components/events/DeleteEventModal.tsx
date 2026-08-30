import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

interface DeleteEventModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  eventName: string;
  onConfirm: () => void;
}

export default function DeleteEventModal({
  open,
  onOpenChange,
  eventName,
  onConfirm,
}: DeleteEventModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-[400px] rounded-3xl p-8 font-sans sm:max-w-[400px]"
        showCloseButton={false}
      >
        <div className="flex flex-col items-center gap-5">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-50/80">
            <AlertTriangle className="h-6 w-6 stroke-[2] text-red-500" />
          </div>

          <DialogHeader className="flex flex-col items-center space-y-3">
            <DialogTitle className="text-xl font-bold text-slate-900">
              Delete Event?
            </DialogTitle>
            <DialogDescription className="text-center text-sm leading-relaxed text-slate-500">
              Are you sure you want to delete "{eventName}"? This action cannot
              be undone.
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="mt-6 flex w-full flex-row gap-3 sm:justify-center sm:gap-4">
          <Button
            type="button"
            variant="outline"
            className="h-12 flex-1 rounded-xl border-slate-200 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            type="button"
            className="h-12 flex-1 rounded-xl border border-red-100 bg-red-50 text-sm font-medium text-red-600 shadow-sm hover:bg-red-100"
            onClick={() => {
              onConfirm();
              onOpenChange(false);
            }}
          >
            Delete
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
