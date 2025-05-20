import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  // Configuración de Astro para el proyecto SecureSwipe
  site: 'https://secureswipe.example.com',
  base: '/',
  // Activar server-side rendering solo para componentes interactivos
  output: 'static',
  // Integración con Tailwind CSS (opcional)
  integrations: [
    // Si se decide usar Tailwind, descomentar la siguiente línea
    // tailwind(),
  ],
});
