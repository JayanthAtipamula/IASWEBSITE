// vite.config.ts
import { defineConfig } from "file:///C:/Users/princ/OneDrive/Desktop/webbingpro/IASWEBSITE/node_modules/vite/dist/node/index.js";
import react from "file:///C:/Users/princ/OneDrive/Desktop/webbingpro/IASWEBSITE/node_modules/@vitejs/plugin-react/dist/index.mjs";
import vercel from "file:///C:/Users/princ/OneDrive/Desktop/webbingpro/IASWEBSITE/node_modules/vite-plugin-vercel/dist/index.js";
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxwcmluY1xcXFxPbmVEcml2ZVxcXFxEZXNrdG9wXFxcXHdlYmJpbmdwcm9cXFxcSUFTV0VCU0lURVwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxccHJpbmNcXFxcT25lRHJpdmVcXFxcRGVza3RvcFxcXFx3ZWJiaW5ncHJvXFxcXElBU1dFQlNJVEVcXFxcdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0M6L1VzZXJzL3ByaW5jL09uZURyaXZlL0Rlc2t0b3Avd2ViYmluZ3Byby9JQVNXRUJTSVRFL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSc7XG5pbXBvcnQgcmVhY3QgZnJvbSAnQHZpdGVqcy9wbHVnaW4tcmVhY3QnO1xuaW1wb3J0IHZlcmNlbCBmcm9tICd2aXRlLXBsdWdpbi12ZXJjZWwnO1xuXG4vLyBodHRwczovL3ZpdGVqcy5kZXYvY29uZmlnL1xuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcbiAgcGx1Z2luczogW1xuICAgIHJlYWN0KCksIFxuICAgIHZlcmNlbCh7XG4gICAgICAvLyBDb25maWd1cmUgU1NSIHdpdGggcHJvcGVyIHNlcnZlciBidW5kbGUgaW5jbHVzaW9uXG4gICAgICBleHBpcmF0aW9uOiAyNSxcbiAgICAgIGlzcjoge1xuICAgICAgICAvLyBFbmFibGUgSVNSIGZvciBiZXR0ZXIgcGVyZm9ybWFuY2VcbiAgICAgICAgZXhwaXJhdGlvbjogNjBcbiAgICAgIH1cbiAgICB9KVxuICBdLFxuICBvcHRpbWl6ZURlcHM6IHtcbiAgICBleGNsdWRlOiBbJ2x1Y2lkZS1yZWFjdCddLFxuICB9LFxuICBidWlsZDoge1xuICAgIG1pbmlmeTogZmFsc2UsXG4gICAgcm9sbHVwT3B0aW9uczoge1xuICAgICAgaW5wdXQ6IHtcbiAgICAgICAgbWFpbjogJy4vaW5kZXguaHRtbCcsXG4gICAgICB9LFxuICAgIH0sXG4gIH0sXG4gIHB1YmxpY0RpcjogJ3B1YmxpYycsXG4gIHNzcjoge1xuICAgIG5vRXh0ZXJuYWw6IFsncmVhY3QtaGVsbWV0J10sXG4gIH0sXG59KTtcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBK1YsU0FBUyxvQkFBb0I7QUFDNVgsT0FBTyxXQUFXO0FBQ2xCLE9BQU8sWUFBWTtBQUduQixJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUMxQixTQUFTO0FBQUEsSUFDUCxNQUFNO0FBQUEsSUFDTixPQUFPO0FBQUE7QUFBQSxNQUVMLFlBQVk7QUFBQSxNQUNaLEtBQUs7QUFBQTtBQUFBLFFBRUgsWUFBWTtBQUFBLE1BQ2Q7QUFBQSxJQUNGLENBQUM7QUFBQSxFQUNIO0FBQUEsRUFDQSxjQUFjO0FBQUEsSUFDWixTQUFTLENBQUMsY0FBYztBQUFBLEVBQzFCO0FBQUEsRUFDQSxPQUFPO0FBQUEsSUFDTCxRQUFRO0FBQUEsSUFDUixlQUFlO0FBQUEsTUFDYixPQUFPO0FBQUEsUUFDTCxNQUFNO0FBQUEsTUFDUjtBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQUEsRUFDQSxXQUFXO0FBQUEsRUFDWCxLQUFLO0FBQUEsSUFDSCxZQUFZLENBQUMsY0FBYztBQUFBLEVBQzdCO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
