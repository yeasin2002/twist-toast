"use client";

import {
  GoeyToastAction,
  GoeyToastDefault,
  GoeyToastDescription,
  GoeyToastError,
  GoeyToastInfo,
  GoeyToastLoading,
  GoeyToastSuccess,
  GoeyToastWarning,
  goeyToast,
} from "@/components/collections-list/goey-toast";
import { DisplayToasters } from "@/components/shared/display-toasters";

export const GoeyToast = () => {
  return (
    <section className="space-y-4">
      <div className="space-y-1">
        <h2 className="text-2xl font-semibold">Goey Toast</h2>
        <p className="text-muted-foreground text-sm">
          Animated toast collection inspired by anl331/goey-toast.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <DisplayToasters
          onTrigger={() =>
            goeyToast.show("default", { message: "Notification received" })
          }
        >
          <GoeyToastDefault />
        </DisplayToasters>
        <DisplayToasters
          onTrigger={() => goeyToast.success({ message: "Changes saved" })}
        >
          <GoeyToastSuccess />
        </DisplayToasters>
        <DisplayToasters
          onTrigger={() =>
            goeyToast.error({ message: "Something went wrong" })
          }
        >
          <GoeyToastError />
        </DisplayToasters>
        <DisplayToasters
          onTrigger={() =>
            goeyToast.warning({
              description:
                "You are using 95% of your available storage. Clean up to avoid failed uploads.",
              message: "Storage almost full",
            })
          }
        >
          <GoeyToastWarning />
        </DisplayToasters>
        <DisplayToasters
          onTrigger={() => goeyToast.info({ message: "New update available" })}
        >
          <GoeyToastInfo />
        </DisplayToasters>
        <DisplayToasters
          onTrigger={() =>
            goeyToast.loading({
              durationMs: 4200,
              message: "Saving changes...",
              showProgress: true,
            })
          }
        >
          <GoeyToastLoading />
        </DisplayToasters>
        <DisplayToasters
          onTrigger={() =>
            goeyToast.description({
              message: "Session is about to expire",
            })
          }
        >
          <GoeyToastDescription />
        </DisplayToasters>
        <DisplayToasters
          onTrigger={() =>
            goeyToast.action({
              actionLabel: "Copy link",
              actionSuccessLabel: "Copied!",
              description: "Your share URL has been generated.",
              message: "Share link ready",
            })
          }
        >
          <GoeyToastAction />
        </DisplayToasters>
      </div>
    </section>
  );
};
