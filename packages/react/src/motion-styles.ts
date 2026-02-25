const MOTION_STYLE_ID = "twist-toast-motion-styles";

const MOTION_STYLES = `
@keyframes twist-toast-enter {
  from {
    opacity: 0;
    transform: translate3d(
      var(--twist-toast-enter-distance-x, 0px),
      var(--twist-toast-enter-distance, var(--twist-toast-enter-distance-y, 8px)),
      0
    ) scale(var(--twist-toast-enter-scale, 0.985));
  }
  to {
    opacity: 1;
    transform: translate3d(0, 0, 0) scale(1);
  }
}

[data-twist-toast-item] {
  will-change: opacity, transform;
  animation-name: twist-toast-enter;
  animation-duration: var(--twist-toast-enter-duration, 180ms);
  animation-timing-function: var(
    --twist-toast-enter-easing,
    cubic-bezier(0.22, 1, 0.36, 1)
  );
  animation-fill-mode: both;
  transition:
    opacity var(--twist-toast-transition-duration, 180ms)
      var(--twist-toast-transition-easing, ease),
    transform var(--twist-toast-transition-duration, 180ms)
      var(--twist-toast-transition-easing, ease);
}

@media (prefers-reduced-motion: reduce) {
  [data-twist-toast-item] {
    animation: none;
    transition: none;
  }
}
`;

export function ensureToastMotionStyles(): void {
  if (typeof document === "undefined") return;
  if (document.getElementById(MOTION_STYLE_ID)) return;

  const styleElement = document.createElement("style");
  styleElement.id = MOTION_STYLE_ID;
  styleElement.textContent = MOTION_STYLES;
  document.head.appendChild(styleElement);
}
