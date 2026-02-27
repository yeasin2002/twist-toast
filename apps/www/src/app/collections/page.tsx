"use client";

import { ToastProvider } from "@twist-toast/react";

import { GoeyToast } from "./_components/goey-toast";
import { HotToasts } from "./_components/hot-toasts";

const Collections = () => {
  return (
    <ToastProvider scope="hot-toast">
      <ToastProvider scope="goey-toast">
        <div className="container mx-auto space-y-10 pt-32 pb-16 md:pb-24">
          <div className="space-y-2">
            <h1 className="text-5xl">Collections</h1>
            <p className="text-muted-foreground">
              Prebuilt UI collections for twist-toast.
            </p>
          </div>
          <HotToasts />
          <GoeyToast />
        </div>
      </ToastProvider>
    </ToastProvider>
  );
};

export default Collections;
