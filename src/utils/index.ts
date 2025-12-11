import { type ClassValue, clsx } from './clsx';

// Tailwind CSS クラス結合ユーティリティ
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

// 日本円フォーマット
export function formatYen(amount: number): string {
  return new Intl.NumberFormat('ja-JP', {
    style: 'currency',
    currency: 'JPY',
    maximumFractionDigits: 0
  }).format(amount);
}

// 数値のカンマ区切り
export function formatNumber(num: number): string {
  return num.toLocaleString('ja-JP');
}

// 日付フォーマット
export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'numeric', 
    day: 'numeric'
  });
}

// 時刻フォーマット
export function formatTime(date?: string | Date): string {
  return new Date(date || new Date()).toLocaleTimeString('ja-JP', {
    hour: '2-digit',
    minute: '2-digit'
  });
}

// 相対時刻フォーマット
export function formatRelativeTime(date: string | Date): string {
  const now = new Date();
  const target = new Date(date);
  const diffMs = now.getTime() - target.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'たった今';
  if (diffMins < 60) return `${diffMins}分前`;
  if (diffHours < 24) return `${diffHours}時間前`;
  if (diffDays < 7) return `${diffDays}日前`;
  
  return formatDate(date);
}

// ランダムID生成
export function generateId(): string {
  return Math.random().toString(36).slice(2, 8).toUpperCase();
}

// CO2換算（kg → t）
export function kgToTon(kg: number): number {
  return Math.round((kg / 1000) * 10) / 10;
}

// CO2換算（t → kg）
export function tonToKg(ton: number): number {
  return Math.floor(ton * 1000);
}

// クレジット → 金額換算
export function creditsToYen(credits: number, rate: number = 6000): number {
  return Math.floor(credits * rate);
}

// バーコード文字列生成（決定的）
export function generateBarcodeData(seed: string): string {
  // シンプルなハッシュ関数でシード値から決定的な文字列を生成
  let hash = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    hash ^= seed.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  
  // 13桁の数値文字列に変換（JANコード風）
  const digits = Math.abs(hash).toString().padStart(13, '0').slice(0, 13);
  return digits;
}

// スワイプ進捗計算
export function calculateSwipeProgress(
  startX: number, 
  currentX: number, 
  containerWidth: number
): number {
  const deltaX = Math.max(0, currentX - startX);
  const progress = Math.min(100, (deltaX / containerWidth) * 100);
  return Math.round(progress);
}

// デバウンス
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
}

// スロットル
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let lastCall = 0;
  
  return (...args: Parameters<T>) => {
    const now = Date.now();
    if (now - lastCall >= delay) {
      lastCall = now;
      func(...args);
    }
  };
}

// localStorage安全操作
export function safeGetItem(key: string): string | null {
  if (typeof window === 'undefined') return null;
  
  try {
    return localStorage.getItem(key);
  } catch (error) {
    console.warn('localStorage getItem failed:', error);
    return null;
  }
}

export function safeSetItem(key: string, value: string): boolean {
  if (typeof window === 'undefined') return false;
  
  try {
    localStorage.setItem(key, value);
    return true;
  } catch (error) {
    console.warn('localStorage setItem failed:', error);
    return false;
  }
}

// バリデーション
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validatePhoneNumber(phone: string): boolean {
  const phoneRegex = /^[\d\-\(\)\s]+$/;
  return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
}

// 日付バリデーション（未来日付チェック等）
export function isValidDate(dateString: string): boolean {
  const date = new Date(dateString);
  return !isNaN(date.getTime());
}

export function isFutureDate(dateString: string): boolean {
  const date = new Date(dateString);
  const now = new Date();
  return date > now;
}

// アクセシビリティ
export function announceToScreenReader(message: string): void {
  if (typeof window === 'undefined') return;
  
  const announcement = document.createElement('div');
  announcement.setAttribute('aria-live', 'polite');
  announcement.setAttribute('aria-atomic', 'true');
  announcement.style.position = 'absolute';
  announcement.style.left = '-10000px';
  announcement.style.width = '1px';
  announcement.style.height = '1px';
  announcement.style.overflow = 'hidden';
  
  document.body.appendChild(announcement);
  announcement.textContent = message;
  
  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
}

// デバイス判定
export function isTouchDevice(): boolean {
  if (typeof window === 'undefined') return false;
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
}

export function isMobileDevice(): boolean {
  if (typeof window === 'undefined') return false;
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
}