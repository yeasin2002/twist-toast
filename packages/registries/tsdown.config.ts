import { defineConfig } from "tsdown";

export default defineConfig({
  platform: "neutral",
  dts: true,
  entry: ["./src/collections/**/*.{ts,tsx}", "./src/components/**/*.{ts,tsx}"],
});
