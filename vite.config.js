import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

// Allows Vite to use Vue.
export default defineConfig({
  plugins: [vue()],
});
