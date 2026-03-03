import { ToastProvider } from "@twist-toast/react";
import {
  SileoToastAction,
  SileoToastError,
  SileoToastInfo,
  SileoToastLoading,
  SileoToastSuccess,
  SileoToastWarning,
  sileoToast,
} from "@twist-toast/registries/motion";



import { DisplayToasters } from "@/components/shared/display-toasters";

export const MotionToast = () => {
  return (
    <ToastProvider scope="sileo-toast">
      <section className="space-y-4">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold">Motion Toast</h2>
          <p className="text-muted-foreground text-sm">
            Animated Toasts with framer-motions 
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <DisplayToasters
            onTrigger={() => sileoToast.success({ title: "Changes saved" })}
          >
            <SileoToastSuccess />
          </DisplayToasters>
          <DisplayToasters
            onTrigger={() =>
              sileoToast.error({
                description: "Please retry in a few seconds.",
                title: "Something went wrong",
              })
            }
          >
            <SileoToastError />
          </DisplayToasters>
          <DisplayToasters
            onTrigger={() =>
              sileoToast.warning({
                description: "You are reaching your storage limit.",
                title: "Warning",
              })
            }
          >
            <SileoToastWarning />
          </DisplayToasters>
          <DisplayToasters
            onTrigger={() =>
              sileoToast.info({
                description:
                  "A new feature just rolled out for your workspace.",
                title: "Heads up",
              })
            }
          >
            <SileoToastInfo />
          </DisplayToasters>
          <DisplayToasters
            onTrigger={() =>
              sileoToast.loading({
                autopilot: false,
                durationMs: 4500,
                title: "Saving changes...",
              })
            }
          >
            <SileoToastLoading />
          </DisplayToasters>
          <DisplayToasters
            onTrigger={() =>
              sileoToast.action({
                button: { title: "Open" },
                description: "Your exported report is ready.",
                title: "Action required",
              })
            }
          >
            <SileoToastAction />
          </DisplayToasters>
        </div>
      </section>
    </ToastProvider>
  );
};
