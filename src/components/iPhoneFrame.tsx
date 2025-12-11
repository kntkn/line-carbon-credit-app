'use client';

import React from 'react';
import { cn } from '@/utils';

interface iPhoneFrameProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'iphone14' | 'iphoneSE';
}

export function iPhoneFrame({ 
  children, 
  className, 
  variant = 'iphone14' 
}: iPhoneFrameProps) {
  const frameConfig = {
    iphone14: {
      container: 'w-[390px] h-[844px]',
      screen: 'inset-[8px] rounded-[38px]',
      notch: 'top-0 left-1/2 -translate-x-1/2 w-[126px] h-[30px] bg-black rounded-b-2xl',
      buttons: (
        <>
          {/* 音量ボタン */}
          <div className="absolute left-[-3px] top-[160px] w-2 h-12 bg-gray-800 rounded-r" />
          <div className="absolute left-[-3px] top-[200px] w-2 h-12 bg-gray-800 rounded-r" />
          {/* 電源ボタン */}
          <div className="absolute right-[-3px] top-[220px] w-2 h-16 bg-gray-800 rounded-l" />
        </>
      )
    },
    iphoneSE: {
      container: 'w-[375px] h-[667px]',
      screen: 'inset-[8px] rounded-[32px]',
      notch: null,
      buttons: (
        <>
          {/* 音量ボタン */}
          <div className="absolute left-[-2px] top-[130px] w-1.5 h-8 bg-gray-800 rounded-r" />
          <div className="absolute left-[-2px] top-[170px] w-1.5 h-8 bg-gray-800 rounded-r" />
          {/* 電源ボタン */}
          <div className="absolute right-[-2px] top-[150px] w-1.5 h-12 bg-gray-800 rounded-l" />
        </>
      )
    }
  };

  const config = frameConfig[variant];

  return (
    <div className={cn('relative mx-auto', className)}>
      {/* デバイスフレーム */}
      <div className={cn(
        'relative bg-gray-900 rounded-[48px] shadow-2xl',
        config.container
      )}>
        {/* 物理ボタン */}
        {config.buttons}

        {/* ノッチ（iPhone 14のみ） */}
        {config.notch && (
          <div className={cn('absolute z-20', config.notch)} />
        )}

        {/* スクリーン */}
        <div className={cn(
          'absolute bg-white overflow-hidden',
          config.screen
        )}>
          {/* ステータスバー空間 */}
          <div className="h-6 bg-transparent" />
          
          {/* アプリコンテンツ */}
          <div className="h-full bg-white relative">
            {children}
          </div>
        </div>

        {/* リフレクション効果 */}
        <div className={cn(
          'absolute pointer-events-none bg-gradient-to-br from-white/10 to-transparent',
          config.screen
        )} />
      </div>

      {/* 影 */}
      <div className="absolute inset-0 -z-10 blur-2xl opacity-20 bg-gray-900 scale-95" />
    </div>
  );
}