"use client";
import { cn } from "@/lib/utils";
import { Loader } from "./loader";

type FullPageLoaderProps = {
  className?: string;
};

export function FullPageLoader({ className }: FullPageLoaderProps) {
  return (
    <dialog
      className={cn(
        "fixed inset-0 z-50 w-full h-full",
        "bg-special-6/80 text-white backdrop-blur-lg",
        "border-0 p-0 m-0 max-w-none max-h-none",
        "flex items-center justify-center",
        className
      )}
      onCancel={(e) => {
        e.preventDefault();
      }}
      onClick={(e) => {
        e.preventDefault();
      }}
      onClose={(e) => {
        e.preventDefault();
      }}
      ref={(dialog) => {
        if (!dialog) return;
        dialog.showModal();
        document.body.style.overflow = "hidden";

        return () => {
          dialog.close();
          document.body.style.overflow = "unset";
        };
      }}
    >
      <Loader size={75} />
    </dialog>
  );
}
