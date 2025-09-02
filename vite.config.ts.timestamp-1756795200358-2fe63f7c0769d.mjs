// vite.config.ts
import { defineConfig } from "file:///mnt/c/Users/princ/OneDrive/Desktop/webbingpro/IASWEBSITE/node_modules/vite/dist/node/index.js";
import react from "file:///mnt/c/Users/princ/OneDrive/Desktop/webbingpro/IASWEBSITE/node_modules/@vitejs/plugin-react/dist/index.mjs";
import vercel from "file:///mnt/c/Users/princ/OneDrive/Desktop/webbingpro/IASWEBSITE/node_modules/vite-plugin-vercel/dist/index.js";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    vercel({
      // Configure SSR with proper server bundle inclusion
      expiration: 25,
      isr: {
        // Enable ISR for better performance
        expiration: 60
      }
    })
  ],
  optimizeDeps: {
    exclude: ["lucide-react"]
  },
  build: {
    minify: false,
    rollupOptions: {
      input: {
        main: "./index.html"
      }
    }
  },
  publicDir: "public",
  ssr: {
    noExternal: ["react-helmet"]
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvbW50L2MvVXNlcnMvcHJpbmMvT25lRHJpdmUvRGVza3RvcC93ZWJiaW5ncHJvL0lBU1dFQlNJVEVcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9tbnQvYy9Vc2Vycy9wcmluYy9PbmVEcml2ZS9EZXNrdG9wL3dlYmJpbmdwcm8vSUFTV0VCU0lURS92aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vbW50L2MvVXNlcnMvcHJpbmMvT25lRHJpdmUvRGVza3RvcC93ZWJiaW5ncHJvL0lBU1dFQlNJVEUvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJztcbmltcG9ydCByZWFjdCBmcm9tICdAdml0ZWpzL3BsdWdpbi1yZWFjdCc7XG5pbXBvcnQgdmVyY2VsIGZyb20gJ3ZpdGUtcGx1Z2luLXZlcmNlbCc7XG5cbi8vIGh0dHBzOi8vdml0ZWpzLmRldi9jb25maWcvXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xuICBwbHVnaW5zOiBbXG4gICAgcmVhY3QoKSwgXG4gICAgdmVyY2VsKHtcbiAgICAgIC8vIENvbmZpZ3VyZSBTU1Igd2l0aCBwcm9wZXIgc2VydmVyIGJ1bmRsZSBpbmNsdXNpb25cbiAgICAgIGV4cGlyYXRpb246IDI1LFxuICAgICAgaXNyOiB7XG4gICAgICAgIC8vIEVuYWJsZSBJU1IgZm9yIGJldHRlciBwZXJmb3JtYW5jZVxuICAgICAgICBleHBpcmF0aW9uOiA2MFxuICAgICAgfVxuICAgIH0pXG4gIF0sXG4gIG9wdGltaXplRGVwczoge1xuICAgIGV4Y2x1ZGU6IFsnbHVjaWRlLXJlYWN0J10sXG4gIH0sXG4gIGJ1aWxkOiB7XG4gICAgbWluaWZ5OiBmYWxzZSxcbiAgICByb2xsdXBPcHRpb25zOiB7XG4gICAgICBpbnB1dDoge1xuICAgICAgICBtYWluOiAnLi9pbmRleC5odG1sJyxcbiAgICAgIH0sXG4gICAgfSxcbiAgfSxcbiAgcHVibGljRGlyOiAncHVibGljJyxcbiAgc3NyOiB7XG4gICAgbm9FeHRlcm5hbDogWydyZWFjdC1oZWxtZXQnXSxcbiAgfSxcbn0pO1xuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUE2VixTQUFTLG9CQUFvQjtBQUMxWCxPQUFPLFdBQVc7QUFDbEIsT0FBTyxZQUFZO0FBR25CLElBQU8sc0JBQVEsYUFBYTtBQUFBLEVBQzFCLFNBQVM7QUFBQSxJQUNQLE1BQU07QUFBQSxJQUNOLE9BQU87QUFBQTtBQUFBLE1BRUwsWUFBWTtBQUFBLE1BQ1osS0FBSztBQUFBO0FBQUEsUUFFSCxZQUFZO0FBQUEsTUFDZDtBQUFBLElBQ0YsQ0FBQztBQUFBLEVBQ0g7QUFBQSxFQUNBLGNBQWM7QUFBQSxJQUNaLFNBQVMsQ0FBQyxjQUFjO0FBQUEsRUFDMUI7QUFBQSxFQUNBLE9BQU87QUFBQSxJQUNMLFFBQVE7QUFBQSxJQUNSLGVBQWU7QUFBQSxNQUNiLE9BQU87QUFBQSxRQUNMLE1BQU07QUFBQSxNQUNSO0FBQUEsSUFDRjtBQUFBLEVBQ0Y7QUFBQSxFQUNBLFdBQVc7QUFBQSxFQUNYLEtBQUs7QUFBQSxJQUNILFlBQVksQ0FBQyxjQUFjO0FBQUEsRUFDN0I7QUFDRixDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
