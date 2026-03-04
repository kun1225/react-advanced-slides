import { defineConfig, presetWebFonts } from 'unocss';

export default defineConfig({
  shortcuts: {
    // custom the default background
    'text-primary': 'text-[var(--primary)]',
    'text-secondary': 'text-[var(--secondary)]',
    'text-mute': 'text-[var(--mute)]',
    'text-primary-highlight': 'text-[var(--primary-highlight)]',
    'text-secondary-highlight': 'text-[var(--secondary-highlight)]',
    'bg-primary': 'bg-[var(--primary)]',
    'bg-secondary': 'bg-[var(--secondary)]',
    'bg-mute': 'bg-[var(--mute)]',
    'bg-primary-highlight': 'bg-[var(--primary-highlight)]',
    'bg-secondary-highlight': 'bg-[var(--secondary-highlight)]',
    'bg-card-background': 'bg-[var(--card-background)]',
  },
  presets: [
    presetWebFonts({
      provider: 'google',
      fonts: {
        antonio: 'Antonio',
      },
    }),
  ],
  // ...
});
