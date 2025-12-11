'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { useSwipe } from '@/hooks/useSwipe';
import { cn } from '@/utils';

interface SwipeToConfirmProps {
  children: React.ReactNode;
  onComplete: () => void;
  disabled?: boolean;
  threshold?: number;
  className?: string;
  variant?: 'default' | 'danger' | 'success';
}

const variants = {
  default: {
    track: 'bg-gradient-to-r from-gray-100 to-gray-200',
    progress: 'bg-gradient-to-r from-carbon-primary to-carbon-secondary',
    thumb: 'bg-white text-gray-600 shadow-lg',
    text: 'text-gray-700'
  },
  danger: {
    track: 'bg-gradient-to-r from-red-100 to-red-200',
    progress: 'bg-gradient-to-r from-red-500 to-red-600',
    thumb: 'bg-white text-red-600 shadow-lg',
    text: 'text-red-700'
  },
  success: {
    track: 'bg-gradient-to-r from-green-100 to-green-200',
    progress: 'bg-gradient-to-r from-green-500 to-green-600',
    thumb: 'bg-white text-green-600 shadow-lg',
    text: 'text-green-700'
  }
} as const;

export function SwipeToConfirm({
  children,
  onComplete,
  disabled = false,
  threshold = 75,
  className,
  variant = 'default'
}: SwipeToConfirmProps) {
  const { swipeState, containerRef, resetSwipe, handlers } = useSwipe({
    onComplete,
    threshold,
    disabled
  });

  const variantStyles = variants[variant];
  const thumbPosition = Math.min(swipeState.progress, 100 - 12); // 12% はサムの幅

  return (
    <div 
      className={cn(
        'select-none touch-none',
        disabled && 'pointer-events-none opacity-50',
        className
      )}
    >
      {/* トラック */}
      <div
        ref={containerRef}
        className={cn(
          'relative h-14 w-full rounded-full shadow-inner overflow-hidden cursor-pointer',
          variantStyles.track
        )}
        {...handlers}
      >
        {/* プログレス */}
        <motion.div
          className={cn(
            'absolute inset-0 rounded-full',
            variantStyles.progress
          )}
          style={{
            clipPath: `inset(0 ${100 - swipeState.progress}% 0 0)`
          }}
        />

        {/* テキスト */}
        <div className={cn(
          'absolute inset-0 flex items-center justify-center text-sm font-medium pointer-events-none',
          variantStyles.text
        )}>
          {children}
        </div>

        {/* サム（つまみ） */}
        <motion.div
          className={cn(
            'absolute top-1 h-12 w-12 rounded-full flex items-center justify-center cursor-grab',
            variantStyles.thumb,
            swipeState.isDragging && 'cursor-grabbing'
          )}
          style={{
            left: `${thumbPosition}%`,
            transform: 'translateX(-50%)'
          }}
          animate={{
            scale: swipeState.isDragging ? 1.05 : 1,
          }}
          transition={{
            type: 'spring',
            stiffness: 300,
            damping: 30
          }}
        >
          <ChevronRight 
            className={cn(
              'w-5 h-5 transition-transform duration-200',
              swipeState.progress > 50 && 'transform rotate-12'
            )}
          />
        </motion.div>

        {/* 完了時のエフェクト */}
        {swipeState.isCompleted && (
          <motion.div
            className="absolute inset-0 bg-white/30 rounded-full"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.2 }}
          />
        )}
      </div>

      {/* ヘルプテキスト */}
      <div className="mt-2 text-xs text-center text-gray-500">
        {swipeState.isDragging ? (
          <span>離して確定...</span>
        ) : swipeState.isCompleted ? (
          <span className="text-green-600">✓ 完了</span>
        ) : (
          <span>右にスワイプして確定</span>
        )}
      </div>
    </div>
  );
}