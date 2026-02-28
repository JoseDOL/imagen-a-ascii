import { useState, useEffect, type ChangeEvent } from 'react';
import { useImageToAscii } from './useImageToAscii';
import { saveAs } from 'file-saver';

export default function ImageToAsciiPage() {
    const { ascii, loading, error, convert } = useImageToAscii();

    const [width, setWidth] = useState<number>(90);
    const [invert, setInvert] = useState(false);
    const [darkMode, setDarkMode] = useState<boolean>(() => {
        if (localStorage.theme === 'dark') return true;
        if (localStorage.theme === 'light') return false;
        return window.matchMedia('(prefers-color-scheme: dark)').matches;
    });

    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add('dark');
            localStorage.theme = 'dark';
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.theme = 'light';
        }
    }, [darkMode]);

    const toggleDarkMode = () => setDarkMode(prev => !prev);

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        convert(file, { width, invert });
    };

    const handleDownload = () => {
        if (!ascii) return;
        const blob = new Blob([ascii.text], { type: 'text/plain;charset=utf-8' });
        saveAs(blob, 'ascii-art.txt');
    };

    return (
        <div className="min-h-screen h-screen w-screen flex flex-col bg-gray-50 text-gray-900 dark:bg-gray-950 dark:text-gray-100 overflow-hidden transition-colors duration-300">
            {/* Header con título y toggle */}
            <header className="flex items-center justify-between px-4 py-3 sm:px-6 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 transition-colors duration-300">
                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold">
                    Imagen → Arte ASCII
                </h1>
                <button
                    onClick={toggleDarkMode}
                    className="p-2 w-10 h-10 flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700 transition"
                    aria-label="Toggle dark mode"
                >
                    {darkMode ? '☀️' : '🌙'}
                </button>
            </header>

            {/* Contenido principal - flex-1 para que ocupe todo el espacio restante */}
            <main className="flex-1 flex flex-col md:flex-row gap-4 p-4 sm:p-6 overflow-hidden">
                {/* Panel izquierdo - controles (scroll si es necesario en mobile) */}
                <div className="w-full md:w-80 lg:w-96 bg-white dark:bg-gray-900 rounded-xl p-5 border border-gray-200 dark:border-gray-800 flex flex-col gap-5 overflow-y-auto transition-colors duration-300 shadow-sm">
                    <div>
                        <label className="block mb-2 font-medium text-gray-700 dark:text-gray-300 transition-colors">Ancho (caracteres)</label>
                        <input
                            type="range"
                            min={40}
                            max={200}
                            value={width}
                            onChange={(e) => setWidth(Number(e.target.value))}
                            className="w-full accent-blue-500"
                        />
                        <p className="text-center mt-1 text-gray-500 dark:text-gray-400 font-medium transition-colors">{width}</p>
                    </div>

                    <label className="flex items-center gap-2 cursor-pointer text-gray-700 dark:text-gray-300 font-medium transition-colors">
                        <input
                            type="checkbox"
                            checked={invert}
                            onChange={(e) => setInvert(e.target.checked)}
                            className="accent-blue-500 w-4 h-4 rounded"
                        />
                        <span>Colores invertidos</span>
                    </label>

                    <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-6 text-center hover:border-blue-500 dark:hover:border-blue-500 transition-colors cursor-pointer bg-gray-50 dark:bg-gray-800/50 group">
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="hidden"
                            id="fileInput"
                        />
                        <label htmlFor="fileInput" className="cursor-pointer block h-full w-full">
                            <p className="text-lg font-medium text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">Haz click o arrastra</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 transition-colors">una imagen aquí (PNG, JPG, WEBP)</p>
                        </label>
                    </div>

                    {loading && <p className="text-blue-600 dark:text-blue-400 text-center font-medium animate-pulse">Procesando...</p>}
                    {error && <p className="text-red-500 dark:text-red-400 text-center font-medium">{error}</p>}
                </div>

                {/* Panel derecho - preview (crece con flex-1) */}
                <div className="flex-1 bg-white dark:bg-gray-950 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden flex flex-col transition-colors duration-300 shadow-sm">
                    <div className="flex-1 overflow-auto p-4 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700 scrollbar-track-gray-100 dark:scrollbar-track-gray-900 flex items-center justify-center">
                        {ascii ? (
                            <pre
                                className="ascii-preview m-auto text-xs sm:text-sm md:text-base lg:text-lg leading-none tracking-tighter font-mono text-gray-800 dark:text-gray-300 whitespace-pre transition-colors duration-300"
                            >
                                {ascii.text}
                            </pre>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-gray-400 dark:text-gray-600 space-y-3">
                                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                <p className="text-lg font-medium">Sube una imagen para ver el resultado</p>
                            </div>
                        )}
                    </div>
                </div>
            </main>

            {/* Botón de descarga - fijo abajo o en el header según prefieras */}
            {ascii && (
                <footer className="p-4 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 flex justify-center md:justify-end transition-colors duration-300 shadow-sm">
                    <button
                        onClick={handleDownload}
                        className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold transition shadow-md hover:shadow-lg"
                    >
                        Descargar .txt
                    </button>
                </footer>
            )}
        </div>
    );
}