import { Link } from '@inertiajs/react';

export default function GuestLayout({ children, backgroundImage = null }) {
    if (backgroundImage) {
        // The artwork (3:2) has a white circle in its centre. On large landscape screens it is
        // scaled to cover the viewport, kept centred, and the form is placed inside the circle.
        // Elsewhere it is a backdrop behind the card.
        return (
            <div className="light relative min-h-screen overflow-hidden bg-[#a6a2ff]">
                <div
                    className="flex min-h-screen items-center justify-center bg-cover bg-center px-4 py-10 art:absolute art:left-1/2 art:top-1/2 art:block art:h-[max(100vh,66.667vw)] art:min-h-0 art:w-[max(100vw,150vh)] art:-translate-x-1/2 art:-translate-y-1/2 art:bg-[length:100%_100%] art:p-0"
                    style={{ backgroundImage: `url(${backgroundImage})` }}
                >
                    {/* Square inscribed in the artwork's circle: x 29.6–69.6%, y 20.5–80.5% */}
                    <div className="w-full max-w-sm art:absolute art:left-[29.6%] art:top-[20.5%] art:flex art:h-[60%] art:w-[40%] art:max-w-none art:items-center art:justify-center">
                        <div className="w-full max-w-sm rounded-3xl bg-white/95 p-6 shadow-xl sm:p-8">
                            <Link href="/" className="mb-6 block text-center text-2xl font-semibold text-gray-800">
                                {import.meta.env.VITE_APP_NAME || 'Admin'}
                            </Link>

                            {children}

                            <footer className="mt-6 border-t border-gray-200 pt-4 text-center text-xs leading-relaxed text-gray-500">
                                <p className="font-medium text-gray-600">Buying House Management Software</p>
                                <p>
                                    Version 1.0.0 · © 2026 · Made with{' '}
                                    <span className="text-rose-500" role="img" aria-label="love">♥</span>
                                </p>
                            </footer>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="relative flex min-h-screen flex-col items-center overflow-hidden bg-gray-100 pt-6 sm:justify-center sm:pt-0 dark:bg-gray-900">
            {/* Woven fabric texture, tiled across the whole page */}
            <svg aria-hidden="true" className="pointer-events-none absolute inset-0 h-full w-full text-gray-400 opacity-[0.08] dark:text-gray-400 dark:opacity-[0.05]">
                <defs>
                    <pattern id="fabric-weave" width="22" height="22" patternUnits="userSpaceOnUse">
                        <path d="M0 0 L22 22 M22 0 L0 22" stroke="currentColor" strokeWidth="1" />
                    </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#fabric-weave)" />
            </svg>

            {/* Thread spool accent */}
            <svg
                aria-hidden="true"
                viewBox="0 0 64 64"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                className="pointer-events-none absolute -left-6 top-8 hidden h-28 w-28 text-indigo-300 opacity-25 sm:block dark:text-indigo-500 dark:opacity-10"
            >
                <ellipse cx="32" cy="14" rx="20" ry="6" />
                <ellipse cx="32" cy="50" rx="20" ry="6" />
                <path d="M12 14 L12 50" />
                <path d="M52 14 L52 50" />
                <path d="M14 23 Q32 28 50 23" />
                <path d="M14 32 Q32 37 50 32" />
                <path d="M14 41 Q32 46 50 41" />
                <path d="M50 44 Q60 50 54 60" />
            </svg>

            {/* Garment hang-tag accent */}
            <svg
                aria-hidden="true"
                viewBox="0 0 64 64"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="pointer-events-none absolute -right-8 bottom-10 hidden h-32 w-32 text-indigo-300 opacity-25 sm:block dark:text-indigo-500 dark:opacity-10"
            >
                <path d="M18 42 q-5 7 3 12" />
                <rect x="14" y="14" width="36" height="24" rx="4" transform="rotate(-20 32 26)" />
                <circle cx="42.5" cy="17" r="2.5" transform="rotate(-20 32 26)" />
            </svg>

            <div className="relative">
                <Link href="/" className="text-xl font-semibold text-gray-800 dark:text-gray-100">
                    {import.meta.env.VITE_APP_NAME || 'Admin'}
                </Link>
            </div>

            <div className="relative mt-6 w-full overflow-hidden bg-white px-6 py-4 shadow-md sm:max-w-md sm:rounded-lg dark:bg-gray-800">
                {children}
            </div>
        </div>
    );
}
