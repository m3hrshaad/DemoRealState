import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// The preview proxy forwards requests to the sandbox host name, so Vite has to
// accept that host. BASE44_* values are supplied by the platform at runtime.
const allowedHosts: string[] = [];
const extraHosts = process.env.__VITE_ADDITIONAL_SERVER_ALLOWED_HOSTS;
if (extraHosts) {
  allowedHosts.push(...extraHosts.split(',').map((host) => host.trim()).filter(Boolean));
}
if (process.env.BASE44_PREVIEW_MODE === '1' && process.env.BASE44_SANDBOX_HOST_DOMAIN) {
  allowedHosts.push(`.${process.env.BASE44_SANDBOX_HOST_DOMAIN}`);
}

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: true,
    ...(allowedHosts.length > 0 ? { allowedHosts } : {}),
    watch: { usePolling: process.env.CHOKIDAR_USEPOLLING === 'true' },
  },
});
