/* eslint-disable @typescript-eslint/no-explicit-any */
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import moment from 'moment';
export function cn(...args: ClassValue[]) {
    return twMerge(clsx(args));
}

export const formatTime = (time: string, patent = 'DD/MM/YYYY') => {
    return moment(time).format(patent);
};

export function removeFalsyValues<T extends Record<string, any>>(obj: T): Partial<T> {
    return Object.entries(obj).reduce((acc, [key, value]) => {
        if (value) acc[key as keyof T] = value;
        return acc;
    }, {} as Partial<T>);
}

export function isValidJSON(str: string): boolean {
    if (!str || str.length <= 0) return false;

    try {
        JSON.parse(str);
        return true;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
        return false;
    }
}

export function copyToClipboard(text: string, onSuccess?: () => void): void {
    if (!navigator.clipboard) {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();

        try {
            document.execCommand('copy');
            if (onSuccess) onSuccess();
        } catch (err) {
            console.error('Không thể copy nội dung: ', err);
        }

        document.body.removeChild(textarea);
    } else {
        navigator.clipboard
            .writeText(text)
            .then(() => {
                if (onSuccess) onSuccess();
            })
            .catch((err) => console.error('Lỗi khi copy nội dung: ', err));
    }
}

export function base64ToFile(base64String: string, fileName: string): File {
    const [header, base64Content] = base64String.split(',');

    const mimeTypeMatch = header.match(/:(.*?);/);
    if (!mimeTypeMatch || mimeTypeMatch.length < 2) {
        throw new Error('Invalid base64 string');
    }
    const mimeType = mimeTypeMatch[1];

    const binaryString = atob(base64Content);

    const byteArray = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
        byteArray[i] = binaryString.charCodeAt(i);
    }

    return new File([byteArray], fileName, { type: mimeType });
}

export function toSlug(str: string, maxLength = 60): string {
    if (typeof str !== 'string') return ''; // Kiểm tra giá trị đầu vào

    // Kiểm tra nếu môi trường hỗ trợ `normalize`
    const normalizedStr = str.normalize ? str.normalize('NFD') : str;

    return normalizedStr
        .replace(/[\u0300-\u036f]/g, '') // Xóa dấu
        .replace(/[^a-zA-Z0-9\s-]/g, '') // Chỉ giữ chữ cái, số, khoảng trắng và dấu "-"
        .trim() // Xóa khoảng trắng đầu/cuối
        .replace(/\s+/g, '-') // Thay khoảng trắng bằng "-"
        .replace(/-+/g, '-') // Gộp nhiều dấu "-" thành 1
        .toLowerCase() // Chuyển về chữ thường
        .slice(0, maxLength) // Giới hạn độ dài
        .replace(/^-+|-+$/g, ''); // Xóa "-" đầu/cuối
}

export function estimateReadingTimeInSeconds(content: string, wordsPerMinute = 200): number {
    if (!content || typeof content !== 'string') return 0;

    const wordCount = content.trim().split(/\s+/).length;
    return Math.ceil((wordCount / wordsPerMinute) * 60);
}
