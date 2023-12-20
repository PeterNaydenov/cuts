import { defineConfig } from "cypress";

export default defineConfig({
  component: {
    supportFile: false,
    devServer: {
      framework: "vue",
      bundler: "vite",
    },
  },
});
