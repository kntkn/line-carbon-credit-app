// clsx の簡易実装（型安全性を保つため）
export type ClassValue = 
  | string 
  | number 
  | boolean 
  | undefined 
  | null 
  | { [key: string]: any }
  | ClassValue[];

export function clsx(...inputs: ClassValue[]): string {
  return inputs
    .flat()
    .filter(Boolean)
    .map(input => {
      if (typeof input === 'string' || typeof input === 'number') {
        return input;
      }
      if (typeof input === 'object' && input !== null && !Array.isArray(input)) {
        return Object.keys(input as Record<string, any>)
          .filter(key => (input as Record<string, any>)[key])
          .join(' ');
      }
      return '';
    })
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim();
}