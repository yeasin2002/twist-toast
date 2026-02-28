import { defineConfig } from "tsdown";

export default defineConfig({
  platform: "browser",
  dts: true,
  entry: ["./src/**/*.{ts,tsx}"],
});
