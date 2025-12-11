'use client';

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Leaf, TrendingUp, Gift, Clock, AlertCircle } from 'lucide-react';
import { MainTab, Coupon, Transaction, CreditApplication } from '@/types';
import { CouponGrid } from './CouponGrid';
import { SwipeToConfirm } from './SwipeToConfirm';
import { Modal, ModalBody, ModalHeader } from './Modal';
import { Barcode } from './Barcode';
import { formatYen, generateId, formatDate, tonToKg, cn } from '@/utils';

interface MainAppProps {
  initialTab?: MainTab;
  onBack: () => void;
  className?: string;
}

export function MainApp({ initialTab = 'apply', onBack, className }: MainAppProps) {
  const [currentTab, setCurrentTab] = useState<MainTab>(initialTab);
  const [creditBalance, setCreditBalance] = useState(12.4); // t単位
  
  // クーポンデータ（初期データ）
  const [coupons, setCoupons] = useState<Coupon[]>([
    {
      id: generateId(),
      brand: 'GreenCafe',
      icon: '☕',
      face: 600,
      needCredits: 0.1,
      status: 'redeemable',
      description: 'GreenCafeで使えるドリンク券',
      products: ['ホット/アイスコーヒー', '紅茶', 'カフェラテ'],
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: generateId(),
      brand: 'EcoMart',
      icon: '🛒',
      face: 1200,
      needCredits: 0.2,
      status: 'redeemable',
      description: 'EcoMartで使えるお買い物クーポン',
      products: ['青果・惣菜・日用品', '一部セール除外'],
      expiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: generateId(),
      brand: 'BioCoffee',
      icon: '🌱',
      face: 300,
      needCredits: 0.05,
      status: 'usable',
      description: 'BioCoffeeのオーガニックドリンク',
      products: ['オーガニックコーヒー', 'ハーブティー'],
      code: `BC-${generateId()}`,
      pin: '1234'
    }
  ]);

  // 取引履歴
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  
  // モーダル状態
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);
  const [showUseConfirm, setShowUseConfirm] = useState<Coupon | null>(null);
  const [showBarcode, setShowBarcode] = useState<Coupon | null>(null);
  const [showToast, setShowToast] = useState<string>('');

  // 申請フォーム状態（簡略版）
  const [applicationForm, setApplicationForm] = useState({
    agreeTerms: false,
    startDate: '',
    targetAmountKg: '',
    pcsManufacturer: '',
    pcsModel: '',
    pcsSerialNumber: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  // スクロール参照
  const usableRef = useRef<HTMLDivElement>(null);

  // クーポン引き換え
  const handleRedeemCoupon = (coupon: Coupon) => {
    if (creditBalance < coupon.needCredits) {
      setShowToast('クレジット残高が不足しています');
      setTimeout(() => setShowToast(''), 3000);
      return;
    }

    // クレジット減算
    setCreditBalance(prev => Math.round((prev - coupon.needCredits) * 10) / 10);
    
    // クーポンを利用可能に変更
    setCoupons(prev => prev.map(c => 
      c.id === coupon.id 
        ? { 
            ...c, 
            status: 'usable' as const,
            code: `DC-${generateId()}`,
            pin: Math.floor(1000 + Math.random() * 9000).toString()
          }
        : c
    ));

    // 取引履歴追加
    const transaction: Transaction = {
      id: generateId(),
      type: 'redeem',
      label: `${coupon.brand} ${formatYen(coupon.face)}`,
      credits: coupon.needCredits,
      amount: coupon.face,
      timestamp: new Date().toISOString()
    };
    setTransactions(prev => [transaction, ...prev]);

    setSelectedCoupon(null);
    setShowToast(`${coupon.brand}を引き換えました！`);
    setTimeout(() => setShowToast(''), 3000);
    
    // 利用可能セクションにスクロール
    setTimeout(() => {
      usableRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 500);
  };

  // クーポン使用
  const handleUseCoupon = (coupon: Coupon) => {
    // 使用済みに変更
    setCoupons(prev => prev.map(c =>
      c.id === coupon.id
        ? { ...c, status: 'used' as const, usedAt: new Date().toISOString() }
        : c
    ));

    // 取引履歴追加
    const transaction: Transaction = {
      id: generateId(),
      type: 'use',
      label: `${coupon.brand} ${formatYen(coupon.face)}`,
      amount: coupon.face,
      timestamp: new Date().toISOString()
    };
    setTransactions(prev => [transaction, ...prev]);

    setShowUseConfirm(null);
    setShowBarcode(coupon);
  };

  // 申請処理
  const handleSubmitApplication = () => {
    if (!applicationForm.agreeTerms || !applicationForm.pcsManufacturer) {
      setShowToast('必須項目を入力してください');
      setTimeout(() => setShowToast(''), 3000);
      return;
    }

    setIsSubmitted(true);
    setShowToast('申請を受け付けました');
    setTimeout(() => setShowToast(''), 3000);
  };

  return (
    <div className={cn('flex flex-col h-full bg-gray-50', className)}>
      {/* ヘッダー */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-carbon-primary to-carbon-secondary flex items-center justify-center text-white font-bold text-sm">
              D
            </div>
            <h1 className="font-semibold text-gray-900">Decopon</h1>
          </div>
          <button 
            onClick={onBack}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* タブ */}
        <div className="grid grid-cols-2">
          <button
            onClick={() => setCurrentTab('apply')}
            className={cn(
              'py-3 text-sm font-medium border-b-2 transition-colors',
              currentTab === 'apply'
                ? 'border-carbon-primary text-carbon-primary'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            )}
          >
            申請
          </button>
          <button
            onClick={() => setCurrentTab('credits')}
            className={cn(
              'py-3 text-sm font-medium border-b-2 transition-colors',
              currentTab === 'credits'
                ? 'border-carbon-primary text-carbon-primary'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            )}
          >
            保有クレジット
          </button>
        </div>
      </div>

      {/* トースト通知 */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="absolute top-20 left-1/2 -translate-x-1/2 z-50 bg-black/80 text-white px-4 py-2 rounded-full text-sm backdrop-blur-sm"
          >
            {showToast}
          </motion.div>
        )}
      </AnimatePresence>

      {/* コンテンツ */}
      <div className="flex-1 overflow-y-auto">
        <AnimatePresence mode="wait">
          {currentTab === 'apply' ? (
            <motion.div
              key="apply"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="p-4 space-y-6"
            >
              {!isSubmitted ? (
                <div className="max-w-md mx-auto space-y-4">
                  <div className="line-card p-6 text-center">
                    <Leaf className="w-12 h-12 text-carbon-primary mx-auto mb-4" />
                    <h2 className="text-xl font-bold text-gray-900 mb-2">
                      Jクレジット申請
                    </h2>
                    <p className="text-gray-600 text-sm">
                      太陽光発電設備の情報を入力してください
                    </p>
                  </div>

                  <div className="line-card p-4 space-y-4">
                    <label className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={applicationForm.agreeTerms}
                        onChange={(e) => setApplicationForm(prev => ({
                          ...prev,
                          agreeTerms: e.target.checked
                        }))}
                        className="rounded border-gray-300 text-carbon-primary focus:ring-carbon-primary"
                      />
                      利用規約に同意します
                    </label>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        発電開始日
                      </label>
                      <input
                        type="date"
                        value={applicationForm.startDate}
                        onChange={(e) => setApplicationForm(prev => ({
                          ...prev,
                          startDate: e.target.value
                        }))}
                        className="line-input"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        申請対象量（kg・任意）
                      </label>
                      <input
                        type="number"
                        placeholder="例: 120"
                        value={applicationForm.targetAmountKg}
                        onChange={(e) => setApplicationForm(prev => ({
                          ...prev,
                          targetAmountKg: e.target.value
                        }))}
                        className="line-input"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        パワーコンディショナー メーカー *
                      </label>
                      <input
                        type="text"
                        placeholder="例: パナソニック"
                        value={applicationForm.pcsManufacturer}
                        onChange={(e) => setApplicationForm(prev => ({
                          ...prev,
                          pcsManufacturer: e.target.value
                        }))}
                        className="line-input"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        型式
                      </label>
                      <input
                        type="text"
                        placeholder="例: VBPC255A1"
                        value={applicationForm.pcsModel}
                        onChange={(e) => setApplicationForm(prev => ({
                          ...prev,
                          pcsModel: e.target.value
                        }))}
                        className="line-input"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        シリアル番号
                      </label>
                      <input
                        type="text"
                        placeholder="例: ABC123456"
                        value={applicationForm.pcsSerialNumber}
                        onChange={(e) => setApplicationForm(prev => ({
                          ...prev,
                          pcsSerialNumber: e.target.value
                        }))}
                        className="line-input"
                      />
                    </div>

                    <button
                      onClick={handleSubmitApplication}
                      className="w-full line-button py-4 rounded-xl text-lg"
                    >
                      申請する
                    </button>
                  </div>
                </div>
              ) : (
                <div className="max-w-md mx-auto">
                  <div className="line-card p-6 text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <AlertCircle className="w-8 h-8 text-green-600" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 mb-2">
                      申請完了
                    </h2>
                    <p className="text-gray-600 mb-4">
                      受付番号: AP-{generateId()}
                    </p>
                    <p className="text-sm text-gray-600">
                      審査結果は2〜3営業日以内にご連絡いたします。
                    </p>
                  </div>
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="credits"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="p-4 space-y-6"
            >
              {/* 保有クレジット表示 */}
              <div className="line-card p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-sm text-gray-500 mb-1">Jクレジット合計</h2>
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-bold text-gray-900">
                        {tonToKg(creditBalance).toLocaleString()}
                      </span>
                      <span className="text-lg text-gray-600">kg</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      = {creditBalance.toFixed(1)} tCO₂e（目安）
                    </p>
                  </div>
                  <div className="text-right">
                    <TrendingUp className="w-8 h-8 text-carbon-primary mb-2" />
                    <p className="text-xs text-gray-500">
                      銘柄: 再エネ（電力）
                    </p>
                  </div>
                </div>
              </div>

              {/* 利用可能クーポン */}
              <div ref={usableRef}>
                <CouponGrid
                  coupons={coupons}
                  mode="usable"
                  onCouponClick={(coupon) => setShowUseConfirm(coupon)}
                  variant="compact"
                />
              </div>

              {/* 引き換え可能クーポン */}
              <CouponGrid
                coupons={coupons}
                mode="redeemable"
                onCouponClick={setSelectedCoupon}
                canInteract={(coupon) => creditBalance >= coupon.needCredits}
                variant="compact"
              />

              {/* 取引履歴 */}
              {transactions.length > 0 && (
                <div className="line-card p-4">
                  <div className="flex items-center gap-2 mb-4">
                    <Clock className="w-5 h-5 text-gray-500" />
                    <h3 className="font-semibold text-gray-900">取引履歴</h3>
                  </div>
                  <div className="space-y-2">
                    {transactions.slice(0, 3).map((tx) => (
                      <div key={tx.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {tx.type === 'redeem' ? '引き換え' : '使用'} / {tx.label}
                          </p>
                          <p className="text-xs text-gray-500">
                            {formatDate(tx.timestamp)}
                          </p>
                        </div>
                        {tx.credits && (
                          <span className="text-xs text-carbon-primary font-medium">
                            -{tx.credits}t
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* クーポン詳細・引き換えモーダル */}
      <Modal
        isOpen={!!selectedCoupon}
        onClose={() => setSelectedCoupon(null)}
        title="クーポン詳細"
      >
        {selectedCoupon && (
          <ModalBody>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-carbon-primary to-carbon-secondary flex items-center justify-center text-3xl text-white">
                  {selectedCoupon.icon}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">
                    {selectedCoupon.brand}
                  </h3>
                  <p className="text-lg text-carbon-primary font-semibold">
                    {formatYen(selectedCoupon.face)}割引
                  </p>
                </div>
              </div>

              {selectedCoupon.description && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-700">{selectedCoupon.description}</p>
                </div>
              )}

              {selectedCoupon.products && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-2">
                    対象商品・サービス
                  </h4>
                  <ul className="space-y-1">
                    {selectedCoupon.products.map((product, index) => (
                      <li key={index} className="text-sm text-gray-600 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-carbon-primary" />
                        {product}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="border-t pt-4">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-gray-500">必要クレジット</span>
                  <span className="font-semibold text-carbon-primary">
                    {selectedCoupon.needCredits}t CO₂
                  </span>
                </div>

                <SwipeToConfirm
                  onComplete={() => handleRedeemCoupon(selectedCoupon)}
                  disabled={creditBalance < selectedCoupon.needCredits}
                >
                  スワイプして引き換える
                </SwipeToConfirm>
                
                {creditBalance < selectedCoupon.needCredits && (
                  <p className="text-xs text-red-600 text-center mt-2">
                    クレジット残高が不足しています
                  </p>
                )}
              </div>
            </div>
          </ModalBody>
        )}
      </Modal>

      {/* クーポン使用確認モーダル */}
      <Modal
        isOpen={!!showUseConfirm}
        onClose={() => setShowUseConfirm(null)}
        title="クーポンを使用しますか？"
      >
        {showUseConfirm && (
          <ModalBody>
            <div className="text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-carbon-primary to-carbon-secondary flex items-center justify-center text-3xl text-white mx-auto">
                {showUseConfirm.icon}
              </div>
              
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-1">
                  {showUseConfirm.brand}
                </h3>
                <p className="text-lg text-carbon-primary font-semibold">
                  {formatYen(showUseConfirm.face)}割引
                </p>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-sm text-yellow-800">
                  ⚠️ 一度バーコードを表示すると取り消せません
                </p>
              </div>

              <SwipeToConfirm
                onComplete={() => handleUseCoupon(showUseConfirm)}
                variant="danger"
              >
                スワイプして使用する
              </SwipeToConfirm>
            </div>
          </ModalBody>
        )}
      </Modal>

      {/* バーコード表示モーダル */}
      <Modal
        isOpen={!!showBarcode}
        onClose={() => setShowBarcode(null)}
        title="クーポンバーコード"
        size="sm"
      >
        {showBarcode && (
          <ModalBody>
            <div className="text-center space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-900">
                  {showBarcode.brand}
                </h3>
                <span className="text-xs text-red-600 bg-red-50 px-2 py-1 rounded">
                  1回限り
                </span>
              </div>

              <Barcode data={`${showBarcode.code}-${showBarcode.pin}`} />

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">コード</p>
                  <p className="font-mono font-semibold break-all">{showBarcode.code}</p>
                </div>
                <div>
                  <p className="text-gray-500">PIN</p>
                  <p className="font-mono font-semibold">{showBarcode.pin}</p>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  📱 この画面を店員に見せてください
                </p>
              </div>
            </div>
          </ModalBody>
        )}
      </Modal>
    </div>
  );
}