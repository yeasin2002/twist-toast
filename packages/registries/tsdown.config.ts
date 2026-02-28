import { defineConfig } from "tsdown";

export default defineConfig({
  platform: "neutral",
  dts: true,
  entry: ["./collections/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
});
