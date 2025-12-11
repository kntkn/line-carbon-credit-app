'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronRight, 
  ChevronLeft, 
  User, 
  Shield, 
  Zap, 
  Battery, 
  Gift, 
  FileText, 
  CheckCircle2,
  Upload,
  Calendar,
  Mail,
  Phone,
  MapPin,
  AlertTriangle
} from 'lucide-react';
import type { 
  CompleteApplicationForm as CompleteApplicationFormType, 
  FormStep, 
  FormProgress, 
  PersonalInfo, 
  ConsentItems, 
  PowerConditionerInfo, 
  BatteryInfo, 
  SubsidyInfo 
} from '@/types/application';
import { cn } from '@/utils';

interface CompleteApplicationFormProps {
  onSubmit: (data: CompleteApplicationFormType) => void;
  onBack?: () => void;
  className?: string;
}

const FORM_STEPS: Array<{
  step: FormStep;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}> = [
  { step: 'personal-info', title: '個人情報', description: 'お名前・住所等', icon: User },
  { step: 'consent', title: '同意事項', description: '利用規約・個人情報', icon: Shield },
  { step: 'power-conditioner', title: 'パワコン情報', description: 'メーカー・型式等', icon: Zap },
  { step: 'battery', title: '蓄電池', description: '設備の有無', icon: Battery },
  { step: 'subsidy', title: '補助金', description: '申請の有無', icon: Gift },
  { step: 'documents', title: '書類添付', description: '写真・証明書', icon: FileText },
  { step: 'final-confirmation', title: '最終確認', description: '内容チェック', icon: CheckCircle2 }
];

export function CompleteApplicationForm({ onSubmit, onBack, className }: CompleteApplicationFormProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [formData, setFormData] = useState<Partial<CompleteApplicationFormType>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  const currentStep = FORM_STEPS[currentStepIndex];
  const progress = Math.round(((currentStepIndex + 1) / FORM_STEPS.length) * 100);

  const updateFormData = <K extends keyof CompleteApplicationFormType>(
    section: K,
    data: Partial<CompleteApplicationFormType[K]>
  ) => {
    setFormData(prev => ({
      ...prev,
      [section]: { ...(prev[section] as any || {}), ...data }
    }));
  };

  const validateCurrentStep = (): boolean => {
    // TODO: 各ステップのバリデーションロジック
    return true;
  };

  const handleNext = () => {
    if (validateCurrentStep() && currentStepIndex < FORM_STEPS.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
    }
  };

  const handleSubmit = () => {
    if (validateCurrentStep()) {
      const completeData: CompleteApplicationFormType = {
        personalInfo: formData.personalInfo as PersonalInfo,
        consentItems: formData.consentItems as ConsentItems,
        powerConditionerInfo: formData.powerConditionerInfo as PowerConditionerInfo,
        batteryInfo: formData.batteryInfo as BatteryInfo,
        subsidyInfo: formData.subsidyInfo as SubsidyInfo,
        documentChecklist: formData.documentChecklist || {},
        finalConfirmation: formData.finalConfirmation || {},
        submissionDate: new Date().toISOString(),
        applicationNumber: `AP-${Date.now().toString(36).toUpperCase()}`
      } as CompleteApplicationFormType;
      
      onSubmit(completeData);
    }
  };

  const StepIndicator = () => (
    <div className="mb-8">
      {/* プログレスバー */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-carbon-forest">
            ステップ {currentStepIndex + 1} / {FORM_STEPS.length}
          </span>
          <span className="text-sm font-medium text-carbon-accent">
            {progress}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
          <motion.div
            className="h-full carbon-gradient rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
        </div>
      </div>

      {/* ステップアイコン */}
      <div className="flex items-center justify-center mb-6">
        <div className="w-16 h-16 bg-gradient-to-br from-carbon-primary to-carbon-accent rounded-full flex items-center justify-center shadow-lg">
          <currentStep.icon className="w-8 h-8 text-white" />
        </div>
      </div>

      <div className="text-center">
        <h2 className="text-2xl font-bold text-carbon-forest mb-2">
          {currentStep.title}
        </h2>
        <p className="text-carbon-sage">
          {currentStep.description}
        </p>
      </div>
    </div>
  );

  const PersonalInfoStep = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-carbon-forest mb-2">
            お名前 <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            className="line-input"
            placeholder="山田 太郎"
            value={formData.personalInfo?.fullName || ''}
            onChange={(e) => updateFormData('personalInfo', { fullName: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-carbon-forest mb-2">
            フリガナ <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            className="line-input"
            placeholder="ヤマダ タロウ"
            value={formData.personalInfo?.furigana || ''}
            onChange={(e) => updateFormData('personalInfo', { furigana: e.target.value })}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-semibold text-carbon-forest mb-2">
            郵便番号 <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            className="line-input"
            placeholder="123-4567"
            value={formData.personalInfo?.postalCode || ''}
            onChange={(e) => updateFormData('personalInfo', { postalCode: e.target.value })}
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-semibold text-carbon-forest mb-2">
            住所 <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            className="line-input"
            placeholder="東京都渋谷区..."
            value={formData.personalInfo?.address || ''}
            onChange={(e) => updateFormData('personalInfo', { address: e.target.value })}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-carbon-forest mb-2">
          生年月日 <span className="text-red-500">*</span>
        </label>
        <input
          type="date"
          className="line-input"
          value={formData.personalInfo?.birthDate || ''}
          onChange={(e) => updateFormData('personalInfo', { birthDate: e.target.value })}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-carbon-forest mb-2">
            電話番号1 <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            className="line-input"
            placeholder="090-1234-5678"
            value={formData.personalInfo?.phone1 || ''}
            onChange={(e) => updateFormData('personalInfo', { phone1: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-carbon-forest mb-2">
            電話番号2
          </label>
          <input
            type="tel"
            className="line-input"
            placeholder="03-1234-5678"
            value={formData.personalInfo?.phone2 || ''}
            onChange={(e) => updateFormData('personalInfo', { phone2: e.target.value })}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-carbon-forest mb-2">
          メールアドレス <span className="text-red-500">*</span>
        </label>
        <input
          type="email"
          className="line-input"
          placeholder="example@mail.com"
          value={formData.personalInfo?.email || ''}
          onChange={(e) => updateFormData('personalInfo', { email: e.target.value })}
        />
      </div>
    </div>
  );

  const ConsentStep = () => (
    <div className="space-y-6">
      <div className="bg-amber-50 border-l-4 border-amber-400 p-4 rounded-r-xl">
        <div className="flex">
          <AlertTriangle className="w-5 h-5 text-amber-400 mt-0.5 mr-3" />
          <div>
            <p className="text-sm text-amber-800">
              以下の項目をすべてご確認いただき、同意いただける場合はチェックしてください。
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {[
          { key: 'compensationStartDateExemption', label: '補償開始日以前の場合の免責に関する同意' },
          { key: 'solarDataProvision', label: '太陽光発電設備のデータ提供に関する同意' },
          { key: 'failureNotificationObligation', label: '故障・不具合発生時の通知義務に関する同意' },
          { key: 'compensationEndCondition', label: '補償終了条件に関する同意' },
          { key: 'personalInformationProvision', label: '個人情報提供に関する同意' }
        ].map((item) => (
          <label key={item.key} className="flex items-start gap-3 p-4 bg-white rounded-xl border-2 border-gray-100 hover:border-carbon-accent/30 transition-colors cursor-pointer">
            <input
              type="checkbox"
              className="mt-1 w-5 h-5 text-carbon-accent border-2 border-gray-300 rounded focus:ring-carbon-accent/20"
              checked={formData.consentItems?.[item.key as keyof ConsentItems] || false}
              onChange={(e) => updateFormData('consentItems', { [item.key]: e.target.checked })}
            />
            <span className="text-sm font-medium text-carbon-forest leading-relaxed">
              {item.label}
            </span>
          </label>
        ))}
      </div>
    </div>
  );

  const PowerConditionerStep = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-carbon-forest mb-2">
            メーカー名 <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            className="line-input"
            placeholder="パナソニック"
            value={formData.powerConditionerInfo?.manufacturer || ''}
            onChange={(e) => updateFormData('powerConditionerInfo', { manufacturer: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-carbon-forest mb-2">
            型式 <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            className="line-input"
            placeholder="VBPC255A1"
            value={formData.powerConditionerInfo?.model || ''}
            onChange={(e) => updateFormData('powerConditionerInfo', { model: e.target.value })}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-carbon-forest mb-2">
          機器固有番号（製造番号） <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          className="line-input"
          placeholder="ABC123456789"
          value={formData.powerConditionerInfo?.serialNumber || ''}
          onChange={(e) => updateFormData('powerConditionerInfo', { serialNumber: e.target.value })}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-carbon-forest mb-2">
            設置数 <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            className="line-input"
            placeholder="1"
            min="1"
            value={formData.powerConditionerInfo?.installationCount || ''}
            onChange={(e) => updateFormData('powerConditionerInfo', { installationCount: Number(e.target.value) })}
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-carbon-forest mb-2">
            定格出力（kW） <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            step="0.1"
            className="line-input"
            placeholder="4.5"
            value={formData.powerConditionerInfo?.ratedOutput || ''}
            onChange={(e) => updateFormData('powerConditionerInfo', { ratedOutput: Number(e.target.value) })}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-carbon-forest mb-2">
          発電開始日または受給開始日 <span className="text-red-500">*</span>
        </label>
        <input
          type="date"
          className="line-input"
          value={formData.powerConditionerInfo?.startDate || ''}
          onChange={(e) => updateFormData('powerConditionerInfo', { startDate: e.target.value })}
        />
      </div>
    </div>
  );

  const BatteryStep = () => (
    <div className="space-y-6">
      <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-xl mb-6">
        <div className="flex">
          <Battery className="w-5 h-5 text-blue-400 mt-0.5 mr-3" />
          <div>
            <p className="text-sm text-blue-800">
              蓄電池設備の設置有無をお選びください。設置している場合は詳細情報をご入力ください。
            </p>
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-carbon-forest mb-4">
          蓄電池設備の有無 <span className="text-red-500">*</span>
        </label>
        <div className="space-y-3">
          <label className="flex items-center gap-3 p-4 bg-white rounded-xl border-2 border-gray-100 hover:border-carbon-accent/30 transition-colors cursor-pointer">
            <input
              type="radio"
              name="hasBattery"
              value="true"
              className="w-5 h-5 text-carbon-accent border-2 border-gray-300 focus:ring-carbon-accent/20"
              checked={formData.batteryInfo?.hasBattery === true}
              onChange={(e) => updateFormData('batteryInfo', { hasBattery: e.target.value === 'true' })}
            />
            <span className="text-sm font-medium text-carbon-forest">設置している</span>
          </label>
          <label className="flex items-center gap-3 p-4 bg-white rounded-xl border-2 border-gray-100 hover:border-carbon-accent/30 transition-colors cursor-pointer">
            <input
              type="radio"
              name="hasBattery"
              value="false"
              className="w-5 h-5 text-carbon-accent border-2 border-gray-300 focus:ring-carbon-accent/20"
              checked={formData.batteryInfo?.hasBattery === false}
              onChange={(e) => updateFormData('batteryInfo', { hasBattery: e.target.value !== 'false' })}
            />
            <span className="text-sm font-medium text-carbon-forest">設置していない</span>
          </label>
        </div>
      </div>

      {formData.batteryInfo?.hasBattery && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-6 overflow-hidden"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-carbon-forest mb-2">
                メーカー名 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                className="line-input"
                placeholder="Tesla"
                value={formData.batteryInfo?.manufacturer || ''}
                onChange={(e) => updateFormData('batteryInfo', { manufacturer: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-carbon-forest mb-2">
                型式 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                className="line-input"
                placeholder="Powerwall 3"
                value={formData.batteryInfo?.model || ''}
                onChange={(e) => updateFormData('batteryInfo', { model: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold text-carbon-forest mb-2">
                容量（kWh） <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                step="0.1"
                className="line-input"
                placeholder="13.5"
                value={formData.batteryInfo?.capacity || ''}
                onChange={(e) => updateFormData('batteryInfo', { capacity: Number(e.target.value) })}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-carbon-forest mb-2">
                設置数 <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                className="line-input"
                placeholder="1"
                min="1"
                value={formData.batteryInfo?.installationCount || ''}
                onChange={(e) => updateFormData('batteryInfo', { installationCount: Number(e.target.value) })}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-carbon-forest mb-2">
                認定容量（kWh）
              </label>
              <input
                type="number"
                step="0.1"
                className="line-input"
                placeholder="13.5"
                value={formData.batteryInfo?.certifiedCapacity || ''}
                onChange={(e) => updateFormData('batteryInfo', { certifiedCapacity: Number(e.target.value) })}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-carbon-forest mb-2">
              実効容量（%）
            </label>
            <input
              type="number"
              className="line-input"
              placeholder="90"
              min="0"
              max="100"
              value={formData.batteryInfo?.effectiveCapacity || ''}
              onChange={(e) => updateFormData('batteryInfo', { effectiveCapacity: Number(e.target.value) })}
            />
          </div>
        </motion.div>
      )}
    </div>
  );

  const SubsidyStep = () => (
    <div className="space-y-6">
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-xl mb-6">
        <div className="flex">
          <Gift className="w-5 h-5 text-yellow-400 mt-0.5 mr-3" />
          <div>
            <p className="text-sm text-yellow-800">
              太陽光発電設備や蓄電池設備に関する補助金の受給状況をお教えください。
            </p>
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-carbon-forest mb-4">
          補助金受給の有無 <span className="text-red-500">*</span>
        </label>
        <div className="space-y-3">
          <label className="flex items-center gap-3 p-4 bg-white rounded-xl border-2 border-gray-100 hover:border-carbon-accent/30 transition-colors cursor-pointer">
            <input
              type="radio"
              name="hasSubsidy"
              value="true"
              className="w-5 h-5 text-carbon-accent border-2 border-gray-300 focus:ring-carbon-accent/20"
              checked={formData.subsidyInfo?.hasSubsidy === true}
              onChange={(e) => updateFormData('subsidyInfo', { hasSubsidy: e.target.value === 'true' })}
            />
            <span className="text-sm font-medium text-carbon-forest">受給している</span>
          </label>
          <label className="flex items-center gap-3 p-4 bg-white rounded-xl border-2 border-gray-100 hover:border-carbon-accent/30 transition-colors cursor-pointer">
            <input
              type="radio"
              name="hasSubsidy"
              value="false"
              className="w-5 h-5 text-carbon-accent border-2 border-gray-300 focus:ring-carbon-accent/20"
              checked={formData.subsidyInfo?.hasSubsidy === false}
              onChange={(e) => updateFormData('subsidyInfo', { hasSubsidy: e.target.value !== 'false' })}
            />
            <span className="text-sm font-medium text-carbon-forest">受給していない</span>
          </label>
        </div>
      </div>

      {formData.subsidyInfo?.hasSubsidy && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-6 overflow-hidden"
        >
          <div>
            <label className="block text-sm font-semibold text-carbon-forest mb-2">
              補助金名称 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              className="line-input"
              placeholder="住宅用太陽光発電システム設置補助金"
              value={formData.subsidyInfo?.subsidyName || ''}
              onChange={(e) => updateFormData('subsidyInfo', { subsidyName: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-carbon-forest mb-2">
              交付機関 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              className="line-input"
              placeholder="◯◯市"
              value={formData.subsidyInfo?.issuer || ''}
              onChange={(e) => updateFormData('subsidyInfo', { issuer: e.target.value })}
            />
          </div>
        </motion.div>
      )}
    </div>
  );

  const DocumentsStep = () => (
    <div className="space-y-6">
      <div className="bg-gray-50 border-l-4 border-gray-400 p-4 rounded-r-xl mb-6">
        <div className="flex">
          <Upload className="w-5 h-5 text-gray-400 mt-0.5 mr-3" />
          <div>
            <p className="text-sm text-gray-800">
              申請に必要な書類をアップロードしてください。すべての必須書類の添付が完了していることを確認してください。
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {[
          { 
            key: 'powerConditionerNameplate', 
            label: 'パワーコンディショナーの銘鈑写真', 
            required: true,
            description: '機器に記載された型式・製造番号が読み取れるよう撮影してください'
          },
          { 
            key: 'electricityContract', 
            label: '電力需給契約内容のお知らせの写し', 
            required: true,
            description: '電力会社からの契約書類をアップロードしてください'
          },
          { 
            key: 'batteryNameplate', 
            label: '蓄電池の銘鈑写真', 
            required: false,
            description: '蓄電池設置者のみ必須'
          },
          { 
            key: 'specifications', 
            label: '仕様書等', 
            required: false,
            description: '必要に応じてアップロードしてください'
          }
        ].map((item) => (
          <div key={item.key} className="p-6 bg-white rounded-xl border-2 border-gray-100 hover:border-carbon-accent/30 transition-colors">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h4 className="text-sm font-semibold text-carbon-forest mb-1">
                  {item.label}
                  {item.required && <span className="text-red-500 ml-1">*</span>}
                </h4>
                <p className="text-xs text-carbon-sage">{item.description}</p>
              </div>
              <div className="ml-4">
                <input
                  type="checkbox"
                  className="w-5 h-5 text-carbon-accent border-2 border-gray-300 rounded focus:ring-carbon-accent/20"
                  checked={formData.documentChecklist?.[item.key as keyof typeof formData.documentChecklist] || false}
                  onChange={(e) => updateFormData('documentChecklist', { [item.key]: e.target.checked })}
                />
              </div>
            </div>
            
            <div className="mt-4">
              <label className="flex items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-xl hover:border-carbon-accent/50 transition-colors cursor-pointer group">
                <div className="text-center">
                  <Upload className="w-8 h-8 text-gray-400 group-hover:text-carbon-accent mx-auto mb-2 transition-colors" />
                  <span className="text-sm text-gray-500 group-hover:text-carbon-accent transition-colors">
                    ファイルを選択またはドラッグ＆ドロップ
                  </span>
                </div>
                <input type="file" className="sr-only" accept="image/*,application/pdf" />
              </label>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const FinalConfirmationStep = () => (
    <div className="space-y-6">
      <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded-r-xl mb-6">
        <div className="flex">
          <CheckCircle2 className="w-5 h-5 text-green-400 mt-0.5 mr-3" />
          <div>
            <p className="text-sm text-green-800">
              申請内容をご確認いただき、すべて正しければチェックボックスにチェックを入れて申請を完了してください。
            </p>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 rounded-xl p-6 space-y-4">
        <h3 className="text-lg font-bold text-carbon-forest mb-4">申請内容確認</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
          <div>
            <h4 className="font-semibold text-carbon-forest mb-2">個人情報</h4>
            <p>{formData.personalInfo?.fullName}</p>
            <p>{formData.personalInfo?.email}</p>
            <p>{formData.personalInfo?.address}</p>
          </div>
          
          <div>
            <h4 className="font-semibold text-carbon-forest mb-2">パワーコンディショナー</h4>
            <p>{formData.powerConditionerInfo?.manufacturer} {formData.powerConditionerInfo?.model}</p>
            <p>定格出力: {formData.powerConditionerInfo?.ratedOutput}kW</p>
            <p>設置数: {formData.powerConditionerInfo?.installationCount}台</p>
          </div>
          
          <div>
            <h4 className="font-semibold text-carbon-forest mb-2">蓄電池</h4>
            <p>{formData.batteryInfo?.hasBattery ? '設置あり' : '設置なし'}</p>
            {formData.batteryInfo?.hasBattery && (
              <>
                <p>{formData.batteryInfo?.manufacturer} {formData.batteryInfo?.model}</p>
                <p>容量: {formData.batteryInfo?.capacity}kWh</p>
              </>
            )}
          </div>
          
          <div>
            <h4 className="font-semibold text-carbon-forest mb-2">補助金</h4>
            <p>{formData.subsidyInfo?.hasSubsidy ? '受給あり' : '受給なし'}</p>
            {formData.subsidyInfo?.hasSubsidy && (
              <>
                <p>{formData.subsidyInfo?.subsidyName}</p>
                <p>交付機関: {formData.subsidyInfo?.issuer}</p>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <label className="flex items-start gap-3 p-4 bg-white rounded-xl border-2 border-gray-100 hover:border-carbon-accent/30 transition-colors cursor-pointer">
          <input
            type="checkbox"
            className="mt-1 w-5 h-5 text-carbon-accent border-2 border-gray-300 rounded focus:ring-carbon-accent/20"
            checked={formData.finalConfirmation?.documentsAttached || false}
            onChange={(e) => updateFormData('finalConfirmation', { documentsAttached: e.target.checked })}
          />
          <span className="text-sm font-medium text-carbon-forest leading-relaxed">
            必要な書類をすべて添付したことを確認しました
          </span>
        </label>

        <label className="flex items-start gap-3 p-4 bg-white rounded-xl border-2 border-gray-100 hover:border-carbon-accent/30 transition-colors cursor-pointer">
          <input
            type="checkbox"
            className="mt-1 w-5 h-5 text-carbon-accent border-2 border-gray-300 rounded focus:ring-carbon-accent/20"
            checked={formData.finalConfirmation?.contentConfirmed || false}
            onChange={(e) => updateFormData('finalConfirmation', { contentConfirmed: e.target.checked })}
          />
          <span className="text-sm font-medium text-carbon-forest leading-relaxed">
            記載内容に間違いがないことを確認し、申請を完了することに同意します
          </span>
        </label>
      </div>
    </div>
  );

  const renderCurrentStepContent = () => {
    switch (currentStep.step) {
      case 'personal-info':
        return <PersonalInfoStep />;
      case 'consent':
        return <ConsentStep />;
      case 'power-conditioner':
        return <PowerConditionerStep />;
      case 'battery':
        return <BatteryStep />;
      case 'subsidy':
        return <SubsidyStep />;
      case 'documents':
        return <DocumentsStep />;
      case 'final-confirmation':
        return <FinalConfirmationStep />;
      default:
        return (
          <div className="text-center py-12">
            <div className="text-carbon-sage">
              {currentStep.title}の内容は準備中です
            </div>
          </div>
        );
    }
  };

  return (
    <div className={cn('max-w-3xl mx-auto p-6', className)}>
      <StepIndicator />

      <div className="line-card p-8 mb-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep.step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {renderCurrentStepContent()}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ナビゲーション */}
      <div className="flex justify-between items-center">
        <button
          onClick={currentStepIndex === 0 ? onBack : handlePrevious}
          className="flex items-center gap-2 px-6 py-3 text-carbon-sage hover:text-carbon-forest transition-colors"
          disabled={currentStepIndex === 0 && !onBack}
        >
          <ChevronLeft className="w-5 h-5" />
          {currentStepIndex === 0 ? '戻る' : '前へ'}
        </button>

        <button
          onClick={currentStepIndex === FORM_STEPS.length - 1 ? handleSubmit : handleNext}
          className="line-button flex items-center gap-2"
        >
          {currentStepIndex === FORM_STEPS.length - 1 ? '申請する' : '次へ'}
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}