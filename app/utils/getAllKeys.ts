// /src/utils/getAllKeys.ts
export function getAllKeys(obj: any, prefix = ''): string[] {
    if (!obj || typeof obj !== 'object') return [];

    return Object.entries(obj).reduce((keys: string[], [key, value]) => {
        const newKey = prefix ? `${prefix}.${key}` : key;
        if (value && typeof value === 'object' && !Array.isArray(value)) {
            return [...keys, ...getAllKeys(value, newKey)];
        }
        return [...keys, newKey];
    }, []);
}

export function getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((acc, part) => (acc ? acc[part] : ''), obj);
}
