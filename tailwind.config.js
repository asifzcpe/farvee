import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
    // Follow the OS theme, except inside `.light` (e.g. the login artwork's white panel).
    darkMode: ['variant', '@media (prefers-color-scheme: dark) { &:not(.light *) }'],

    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.jsx',
    ],

    theme: {
        extend: {
            screens: {
                // Landscape screens large enough to show the login artwork's white panel.
                art: {
                    raw: '(min-aspect-ratio: 1/1) and (max-aspect-ratio: 2/1) and (min-width: 900px) and (min-height: 560px)',
                },
            },
            fontFamily: {
                sans: ['Figtree', ...defaultTheme.fontFamily.sans],
            },
        },
    },

    plugins: [forms],
};
