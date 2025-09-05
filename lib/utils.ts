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
