'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { iPhoneFrame as IPhoneFrame } from '@/components/iPhoneFrame';
import { LINEChatUI } from '@/components/LINEChatUI';
import { MainApp } from '@/components/MainApp';
import { MyPage } from '@/components/MyPage';
import { LiffScreen, MainTab } from '@/types';

export default function Home() {
  const [currentScreen, setCurrentScreen] = useState<LiffScreen>('chat');
  const [currentTab, setCurrentTab] = useState<MainTab>('apply');

  const handleNavigateToApp = (tab?: MainTab) => {
    setCurrentTab(tab || 'apply');
    setCurrentScreen('main');
  };

  const handleNavigateToMypage = () => {
    setCurrentScreen('mypage');
  };

  const handleBackToChat = () => {
    setCurrentScreen('chat');
  };

  const screenVariants = {
    enter: {
      x: 300,
      opacity: 0,
      scale: 0.95
    },
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 30,
        opacity: { duration: 0.2 }
      }
    },
    exit: {
      x: -300,
      opacity: 0,
      scale: 0.95,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 30,
        opacity: { duration: 0.2 }
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-gray-50 to-white flex items-center justify-center p-4">
      {/* デスクトップ用の説明テキスト */}
      <div className="hidden lg:block absolute top-8 left-8 max-w-md">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Decopon LINEミニアプリ
          </h1>
          <p className="text-gray-700 leading-relaxed mb-4">
            カーボンクレジットをクーポンに交換できるLINEミニアプリのプロトタイプです。
            iPhone風のフレームでネイティブな操作感を体験できます。
          </p>
          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full" />
              スワイプでクーポン引き換え
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-blue-500 rounded-full" />
              ワンタイムバーコード生成
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-purple-500 rounded-full" />
              LINEライクなUI/UX
            </div>
          </div>
        </div>
      </div>

      {/* メインアプリケーション */}
      <IPhoneFrame className="shadow-2xl">
        <div className="h-full flex flex-col relative overflow-hidden">
          <AnimatePresence mode="wait">
            {currentScreen === 'chat' && (
              <motion.div
                key="chat"
                variants={screenVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="absolute inset-0"
              >
                <LINEChatUI
                  onNavigateToApp={handleNavigateToApp}
                  onNavigateToMypage={handleNavigateToMypage}
                  className="h-full"
                />
              </motion.div>
            )}

            {currentScreen === 'main' && (
              <motion.div
                key="main"
                variants={screenVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="absolute inset-0"
              >
                <MainApp
                  initialTab={currentTab}
                  onBack={handleBackToChat}
                  className="h-full"
                />
              </motion.div>
            )}

            {currentScreen === 'mypage' && (
              <motion.div
                key="mypage"
                variants={screenVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="absolute inset-0"
              >
                <MyPage
                  onBack={handleBackToChat}
                  className="h-full"
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </IPhoneFrame>

      {/* モバイル用の説明テキスト */}
      <div className="lg:hidden absolute bottom-4 left-4 right-4">
        <div className="bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-lg text-center">
          <p className="text-sm text-gray-700">
            📱 LINEミニアプリプロトタイプ
          </p>
          <p className="text-xs text-gray-500 mt-1">
            カーボンクレジット × クーポン交換
          </p>
        </div>
      </div>
    </div>
  );
}