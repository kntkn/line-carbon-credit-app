// 申請フォームの完全版型定義

export interface PersonalInfo {
  // 個人情報
  fullName: string;
  furigana: string;
  postalCode: string;
  address: string;
  birthDate: string;
  phone1: string;
  phone2?: string;
  email: string;
}

export interface ConsentItems {
  // Decoponに関する同意項目
  compensationStartDateExemption: boolean; // 補償開始日以前の場合の免責に関する同意
  solarDataProvision: boolean; // 太陽光発電設備のデータ提供に関する同意
  failureNotificationObligation: boolean; // 故障・不具合発生時の通知義務に関する同意
  compensationEndCondition: boolean; // 補償終了条件に関する同意
  personalInformationProvision: boolean; // 個人情報提供に関する同意
}

export interface PowerConditionerInfo {
  // パワーコンディショナー情報
  manufacturer: string;
  model: string;
  serialNumber: string;
  installationCount: number;
  ratedOutput: number; // kW
  startDate: string; // 発電開始日または受給開始日
}

export interface BatteryInfo {
  // 蓄電池情報
  hasBattery: boolean;
  manufacturer?: string;
  model?: string;
  capacity?: number; // kWh
  installationCount?: number;
  certifiedCapacity?: number; // kWh
  effectiveCapacity?: number; // %
}

export interface SubsidyInfo {
  // 補助金情報
  hasSubsidy: boolean;
  subsidyName?: string;
  issuer?: string;
}

export interface DocumentChecklist {
  // アップロード書類チェックリスト
  powerConditionerNameplate: boolean; // パワーコンディショナーの銘鈑写真
  electricityContract: boolean; // 電力需給契約内容のお知らせの写し
  batteryNameplate?: boolean; // 蓄電池の銘鈑写真（該当者のみ）
  specifications?: boolean; // 仕様書等（必要に応じて）
}

export interface FinalConfirmation {
  // 送信前の最終確認
  documentsAttached: boolean; // 必要画像の添付確認
  contentConfirmed: boolean; // 記載内容の最終確認
}

export interface CompleteApplicationForm {
  personalInfo: PersonalInfo;
  consentItems: ConsentItems;
  powerConditionerInfo: PowerConditionerInfo;
  batteryInfo: BatteryInfo;
  subsidyInfo: SubsidyInfo;
  documentChecklist: DocumentChecklist;
  finalConfirmation: FinalConfirmation;
  submissionDate?: string;
  applicationNumber?: string;
}

// バリデーション用の型
export type ValidationErrors = {
  [K in keyof CompleteApplicationForm]?: {
    [P in keyof CompleteApplicationForm[K]]?: string;
  };
};

// フォームの進行状況
export type FormStep = 
  | 'personal-info'
  | 'consent'
  | 'power-conditioner'
  | 'battery'
  | 'subsidy'
  | 'documents'
  | 'final-confirmation'
  | 'completion';

export interface FormProgress {
  currentStep: FormStep;
  completedSteps: FormStep[];
  totalSteps: number;
  progressPercentage: number;
}