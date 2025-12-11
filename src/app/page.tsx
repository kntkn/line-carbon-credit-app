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
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-green-800 to-teal-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* 背景エフェクト */}
      <div className="absolute inset-0 opacity-20">
        <div className="w-full h-full bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.03%22%3E%3Cpath%20d%3D%22M30%2030c0-11.046-8.954-20-20-20s-20%208.954-20%2020%208.954%2020%2020%2020%2020-8.954%2020-20z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]" />
      </div>
      
      {/* グラデーションオーバーレイ */}
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-emerald-500/5 to-transparent" />

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
    </div>
  );
}