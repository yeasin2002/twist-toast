"use client";

import { ToastProvider } from "@twist-toast/react";

import {
  HotToastError,
  HotToastInfo,
  HotToastLoading,
  HotToastSuccess,
  HotToastWarning,
  hotToast,
} from "@/components/collections-list/hot-toast";
import { DisplayToasters } from "@/components/shared/display-toasters";

const Collections = () => {
  return (
    <ToastProvider scope="hot-toast">
      <div className="container mx-auto space-y-10 pt-32 pb-16 md:pb-24">
        <div className="space-y-2">
          <h1 className="text-5xl">Collections</h1>
          <p className="text-muted-foreground">
            Prebuilt UI collections for twist-toast.
          </p>
        </div>
        <section className="space-y-4">
          <div className="space-y-1">
            <h2 className="text-2xl font-semibold">React Hot Toast</h2>
            <p className="text-muted-foreground text-sm">
              Toast styles inspired by react-hot-toast defaults.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            <DisplayToasters
              onTrigger={() =>
                hotToast.success({ message: "Successfully toasted!" })
              }
            >
              <HotToastSuccess />
            </DisplayToasters>
            <DisplayToasters
              onTrigger={() => hotToast.error({ message: "Something went wrong." })}
            >
              <HotToastError />
            </DisplayToasters>
            <DisplayToasters
              onTrigger={() =>
                hotToast.warning({ message: "Heads up! Please review this action." })
              }
            >
              <HotToastWarning />
            </DisplayToasters>
            <DisplayToasters
              onTrigger={() =>
                hotToast.info({ message: "Here is some information." })
              }
            >
              <HotToastInfo />
            </DisplayToasters>
            <DisplayToasters
              onTrigger={() => hotToast.loading({ message: "Loading..." })}
            >
              <HotToastLoading />
            </DisplayToasters>
          </div>
        </section>
      </div>
    </ToastProvider>
  );
};

export default Collections;
