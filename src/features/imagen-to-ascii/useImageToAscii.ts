import { useState, useCallback } from 'react';
import { imageToAscii } from './asciiConverter';

type AsciiResult = {
    text: string;
    width: number;
};

export function useImageToAscii() {
    const [ascii, setAscii] = useState<AsciiResult | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const convert = useCallback((file: File, options?: { width?: number; invert?: boolean }) => {
        setLoading(true);
        setError(null);

        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                try {
                    const result = imageToAscii(img, {
                        width: options?.width ?? 100,
                        invert: options?.invert ?? false,
                    });
                    setAscii({ text: result, width: options?.width ?? 100 });
                } catch (err) {
                    setError('Error al procesar la imagen');
                } finally {
                    setLoading(false);
                }
            };
            img.onerror = () => {
                setError('Formato de imagen no soportado');
                setLoading(false);
            };
            img.src = e.target?.result as string;
        };
        reader.readAsDataURL(file);
    }, []);

    return { ascii, loading, error, convert };
}