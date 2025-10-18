    // tailwind.config.ts
    import type { Config } from 'tailwindcss';

    const config: Config = {
      content: [
        './pages/**/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',
        './app/**/*.{js,ts,jsx,tsx,mdx}',
      ],
      theme: {
        extend: {
          colors: {
            // Define your custom global colors here
            'primary-color': '#89CFF0', // Example: a custom primary brand color
            'secondary-accent': '#33FF57', // Example: a secondary accent color
            'custom-gray': { // You can also define color scales
              50: '#F9FAFB',
              100: '#F3F4F6',
              // ... up to 900
              900: '#111827',
            },
          },
        },
      },
      plugins: [],
    };

    export default config;