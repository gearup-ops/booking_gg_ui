import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function setLocaleStorage(key: string, value: any) {
    if (typeof window !== 'undefined') {
        localStorage.setItem(key, value);
    }
}

export function getLocaleStorage(key: string) {
    if (typeof window !== 'undefined') {
        return localStorage.getItem(key);
    }
}

export function removeFromLocalStorage(key: string) {
    if (typeof window !== 'undefined') {
        localStorage.removeItem(key);
    }
}

export function slugify(text: string) {
    if (!text) return '';
    return text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')       // Replace spaces with -
        .replace(/[^\w\-]+/g, '')   // Remove all non-word chars
        .replace(/\-\-+/g, '-')     // Replace multiple - with single -
        .replace(/^-+/, '')         // Trim - from start of text
        .replace(/-+$/, '');        // Trim - from end of text
}
