'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  X, 
  User, 
  Mail, 
  Phone, 
  Settings, 
  HelpCircle, 
  MessageCircle, 
  Star, 
  FileText,
  Bell,
  Shield,
  ChevronRight
} from 'lucide-react';
import { cn } from '@/utils';

interface MyPageProps {
  onBack: () => void;
  className?: string;
}

export function MyPage({ onBack, className }: MyPageProps) {
  const [userProfile, setUserProfile] = useState({
    displayName: 'Kento Honda',
    email: 'mem.knt@gmail.com',
    phone: '',
    notifications: true,
    marketingEmails: false
  });

  const [activeSection, setActiveSection] = useState<string | null>(null);

  const menuItems = [
    {
      id: 'profile',
      icon: User,
      title: 'プロフィール編集',
      description: '表示名・連絡先の変更',
      color: 'text-blue-600 bg-blue-50'
    },
    {
      id: 'notifications',
      icon: Bell,
      title: '通知設定',
      description: 'プッシュ通知・メール通知',
      color: 'text-purple-600 bg-purple-50'
    },
    {
      id: 'security',
      icon: Shield,
      title: 'セキュリティ',
      description: 'パスワード・認証設定',
      color: 'text-green-600 bg-green-50'
    },
    {
      id: 'help',
      icon: HelpCircle,
      title: 'ヘルプ・FAQ',
      description: 'よくある質問・操作方法',
      color: 'text-orange-600 bg-orange-50'
    },
    {
      id: 'contact',
      icon: MessageCircle,
      title: 'お問い合わせ',
      description: 'チャットサポート',
      color: 'text-pink-600 bg-pink-50'
    },
    {
      id: 'terms',
      icon: FileText,
      title: '利用規約・プライバシー',
      description: '規約・ポリシーの確認',
      color: 'text-gray-600 bg-gray-50'
    }
  ];

  const handleUpdateProfile = (field: string, value: string | boolean) => {
    setUserProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveProfile = () => {
    // プロフィール保存処理
    console.log('Profile saved:', userProfile);
  };

  const ProfileSection = () => (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <div className="w-20 h-20 bg-gradient-to-br from-carbon-primary to-carbon-secondary rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
          {userProfile.displayName.charAt(0)}
        </div>
        <h2 className="text-xl font-bold text-gray-900">{userProfile.displayName}</h2>
        <p className="text-sm text-gray-500">LINEユーザー</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            表示名
          </label>
          <input
            type="text"
            value={userProfile.displayName}
            onChange={(e) => handleUpdateProfile('displayName', e.target.value)}
            className="line-input"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            メールアドレス
          </label>
          <input
            type="email"
            value={userProfile.email}
            onChange={(e) => handleUpdateProfile('email', e.target.value)}
            className="line-input"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            電話番号（任意）
          </label>
          <input
            type="tel"
            value={userProfile.phone}
            onChange={(e) => handleUpdateProfile('phone', e.target.value)}
            placeholder="090-1234-5678"
            className="line-input"
          />
        </div>

        <button
          onClick={handleSaveProfile}
          className="w-full line-button py-3 rounded-xl"
        >
          保存
        </button>
      </div>
    </div>
  );

  const NotificationSection = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">通知設定</h3>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-200">
          <div>
            <h4 className="font-medium text-gray-900">プッシュ通知</h4>
            <p className="text-sm text-gray-500">クーポンの有効期限やお知らせ</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={userProfile.notifications}
              onChange={(e) => handleUpdateProfile('notifications', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:ring-4 peer-focus:ring-carbon-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-carbon-primary"></div>
          </label>
        </div>

        <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-200">
          <div>
            <h4 className="font-medium text-gray-900">マーケティングメール</h4>
            <p className="text-sm text-gray-500">キャンペーン情報やニュース</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={userProfile.marketingEmails}
              onChange={(e) => handleUpdateProfile('marketingEmails', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:ring-4 peer-focus:ring-carbon-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-carbon-primary"></div>
          </label>
        </div>
      </div>
    </div>
  );

  const HelpSection = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">よくある質問</h3>
      
      <div className="space-y-3">
        {[
          {
            question: 'Jクレジットとは何ですか？',
            answer: '省エネルギー設備の導入や再生可能エネルギーの利用によるCO₂削減効果を認証した環境価値のクレジットです。'
          },
          {
            question: 'クーポンの有効期限はありますか？',
            answer: 'はい、クーポンには有効期限があります。引き換え後30日〜60日程度です。'
          },
          {
            question: 'バーコードは再表示できますか？',
            answer: 'セキュリティの関係上、バーコードの再表示はできません。使用は1回限りです。'
          },
          {
            question: '申請の審査期間はどのくらいですか？',
            answer: '通常2〜3営業日以内に審査結果をお知らせいたします。'
          }
        ].map((faq, index) => (
          <details key={index} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <summary className="p-4 cursor-pointer hover:bg-gray-50 font-medium text-gray-900">
              {faq.question}
            </summary>
            <div className="px-4 pb-4 text-sm text-gray-600 leading-relaxed">
              {faq.answer}
            </div>
          </details>
        ))}
      </div>
    </div>
  );

  return (
    <div className={cn('flex flex-col h-full bg-gray-50', className)}>
      {/* ヘッダー */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-carbon-primary to-carbon-secondary flex items-center justify-center text-white font-bold text-sm">
              <User className="w-5 h-5" />
            </div>
            <h1 className="font-semibold text-gray-900">マイページ</h1>
          </div>
          <button 
            onClick={onBack}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* コンテンツ */}
      <div className="flex-1 overflow-y-auto">
        {!activeSection ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-4 space-y-6"
          >
            {/* プロフィールサマリー */}
            <div className="line-card p-6 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-carbon-primary to-carbon-secondary rounded-full mx-auto mb-4 flex items-center justify-center text-white text-xl font-bold shadow-lg">
                {userProfile.displayName.charAt(0)}
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-1">{userProfile.displayName}</h2>
              <p className="text-sm text-gray-500 mb-4">LINEユーザー</p>
              <div className="flex items-center justify-center gap-1 text-xs text-gray-600">
                <Star className="w-3 h-3 text-yellow-500 fill-current" />
                <span>Decoponユーザー</span>
              </div>
            </div>

            {/* メニューリスト */}
            <div className="space-y-3">
              {menuItems.map((item) => (
                <motion.button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className="w-full bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-4 hover:shadow-md transition-all group"
                  whileTap={{ scale: 0.98 }}
                >
                  <div className={cn('w-10 h-10 rounded-full flex items-center justify-center', item.color)}>
                    <item.icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 text-left">
                    <h3 className="font-medium text-gray-900 group-hover:text-carbon-primary transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-sm text-gray-500">{item.description}</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-carbon-primary transition-colors" />
                </motion.button>
              ))}
            </div>

            {/* アプリ情報 */}
            <div className="line-card p-4">
              <h3 className="font-semibold text-gray-900 mb-3">アプリ情報</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">バージョン</span>
                  <span className="font-medium">1.0.0</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">最終更新</span>
                  <span className="font-medium">2024年12月</span>
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="p-4"
          >
            {/* セクション戻るボタン */}
            <button
              onClick={() => setActiveSection(null)}
              className="mb-4 flex items-center gap-2 text-carbon-primary hover:underline"
            >
              <ChevronRight className="w-4 h-4 rotate-180" />
              戻る
            </button>

            <div className="line-card p-6">
              {activeSection === 'profile' && <ProfileSection />}
              {activeSection === 'notifications' && <NotificationSection />}
              {activeSection === 'help' && <HelpSection />}
              {activeSection === 'security' && (
                <div className="text-center py-8">
                  <Shield className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">セキュリティ設定は準備中です</p>
                </div>
              )}
              {activeSection === 'contact' && (
                <div className="text-center py-8">
                  <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">お困りのことがございましたら、<br />LINEトークでお気軽にお問い合わせください。</p>
                  <button 
                    onClick={onBack}
                    className="line-button px-6 py-2 rounded-lg"
                  >
                    トークに戻る
                  </button>
                </div>
              )}
              {activeSection === 'terms' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">利用規約・プライバシー</h3>
                  <div className="space-y-3">
                    <button className="w-full text-left p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="font-medium text-gray-900">利用規約</div>
                      <div className="text-sm text-gray-600">サービスの利用条件について</div>
                    </button>
                    <button className="w-full text-left p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="font-medium text-gray-900">プライバシーポリシー</div>
                      <div className="text-sm text-gray-600">個人情報の取り扱いについて</div>
                    </button>
                    <button className="w-full text-left p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="font-medium text-gray-900">特定商取引法に基づく表記</div>
                      <div className="text-sm text-gray-600">事業者情報・取引条件について</div>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}