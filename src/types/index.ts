// 基本の型定義
export type MessageSender = 'bot' | 'user';

export interface ChatMessage {
  id: string;
  from: MessageSender;
  text: string;
  time: string;
}

export type CouponStatus = 'redeemable' | 'usable' | 'used';

export interface Coupon {
  id: string;
  brand: string;
  face: number; // 金額面
  needCredits: number; // 必要クレジット（t）
  status: CouponStatus;
  icon?: string;
  description?: string;
  products?: string[];
  code?: string;
  pin?: string;
  usedAt?: string;
  expiresAt?: string; // 有効期限
}

export type TransactionType = 'redeem' | 'use';

export interface Transaction {
  id: string;
  type: TransactionType;
  label: string;
  credits?: number; // 使用クレジット（t）
  amount?: number; // 金額（円）
  timestamp: string;
}

export interface CreditApplication {
  id: string;
  applicationNumber: string;
  timestamp: string;
  brand: string;
  targetAmount?: number; // kg
  startDate?: string;
  receiveDate?: string;
  status: 'submitted' | 'reviewing' | 'approved' | 'rejected';
  documents: ApplicationDocument[];
}

export interface ApplicationDocument {
  id: string;
  type: 'nameplate' | 'contract' | 'spec' | 'other';
  filename: string;
  url?: string;
}

export interface UserProfile {
  id: string;
  displayName: string;
  email?: string;
  lineUserId?: string;
}

// スワイプ操作の状態
export interface SwipeState {
  isDragging: boolean;
  startX: number;
  currentX: number;
  progress: number; // 0-100
  isCompleted: boolean;
}

// LIFFアプリの画面状態
export type LiffScreen = 'chat' | 'main' | 'mypage';
export type MainTab = 'apply' | 'credits';

export interface AppState {
  currentScreen: LiffScreen;
  currentTab?: MainTab;
  creditBalance: number; // t単位
  coupons: Coupon[];
  transactions: Transaction[];
  applications: CreditApplication[];
  userProfile: UserProfile | null;
}

// フォーム関連の型
export interface ApplicationForm {
  // 同意
  agreeTerms: boolean;
  agreeItems: boolean[];
  
  // 設備情報
  startDate?: string;
  receiveDate?: string;
  targetAmountKg?: number;
  
  // パワーコンディショナー
  pcsManufacturer: string;
  pcsModel: string;
  pcsSerialNumber: string;
  
  // 蓄電池
  hasBattery: 'yes' | 'no';
  batteryModel?: string;
  batteryCapacity?: string;
  batteryManufacturer?: string;
  
  // 補助金
  hasSubsidy: 'yes' | 'no';
  subsidyName?: string;
  subsidyIssuer?: string;
  
  // ファイル
  documents: File[];
}

// レスポンス型
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// 設定
export const APP_CONFIG = {
  CREDIT_RATE: 6000, // 1t = 6,000円
  BARCODE_LIFETIME: 300000, // 5分（ミリ秒）
  COUPON_BRANDS: [
    'GreenCafe',
    'EcoMart', 
    'LeafHotel',
    'BioCoffee',
    'NatureStore'
  ] as const,
  SWIPE_THRESHOLD: 0.75, // 75%でコンプリート
  ANIMATION_DURATION: 300 // ミリ秒
} as const;