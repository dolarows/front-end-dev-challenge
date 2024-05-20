import * as React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { cn } from "~/utils";

export const Sheet = Dialog.Root;
export const SheetTrigger = Dialog.Trigger;
export const SheetContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<"div">
>(({ className, ...props }, ref) => (
  <Dialog.Content
    ref={ref}
    className={cn(
      "fixed inset-0 z-50 flex items-end sm:items-center sm:justify-center",
      className,
    )}
    {...props}
  >
    <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" />
    <div
      className="relative mx-4 w-full rounded-lg bg-white p-6 shadow-xl sm:mx-auto sm:max-w-lg"
      {...props}
    />
  </Dialog.Content>
));
SheetContent.displayName = "SheetContent";
