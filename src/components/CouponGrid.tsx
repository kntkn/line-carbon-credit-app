'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Coupon } from '@/types';
import { CouponCard } from './CouponCard';
import { cn } from '@/utils';

interface CouponGridProps {
  coupons: Coupon[];
  mode: 'redeemable' | 'usable' | 'used';
  onCouponClick?: (coupon: Coupon) => void;
  canInteract?: (coupon: Coupon) => boolean;
  className?: string;
  columns?: 1 | 2 | 3;
  variant?: 'compact' | 'detailed';
}

const modeConfig = {
  redeemable: {
    title: '引き換え可能',
    emptyMessage: '引き換え可能なクーポンがありません',
    icon: '🎯'
  },
  usable: {
    title: '利用可能',
    emptyMessage: 'まだ利用可能なクーポンがありません',
    icon: '🎫'
  },
  used: {
    title: '使用済み',
    emptyMessage: '使用履歴がありません',
    icon: '✅'
  }
} as const;

export function CouponGrid({
  coupons,
  mode,
  onCouponClick,
  canInteract,
  className,
  columns = 2,
  variant = 'compact'
}: CouponGridProps) {
  const config = modeConfig[mode];
  const filteredCoupons = coupons.filter(coupon => coupon.status === mode);

  const gridColumns = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
  } as const;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 24
      }
    }
  };

  if (filteredCoupons.length === 0) {
    return (
      <div className={cn('text-center py-8', className)}>
        <div className="text-4xl mb-4">{config.icon}</div>
        <p className="text-gray-500 text-sm">{config.emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className={cn('space-y-4', className)}>
      {/* セクションヘッダー */}
      <div className="flex items-center gap-2">
        <span className="text-xl">{config.icon}</span>
        <h3 className="font-semibold text-gray-900">{config.title}</h3>
        <span className="text-sm text-gray-500">({filteredCoupons.length})</span>
      </div>

      {/* グリッド */}
      <motion.div
        className={cn(
          'grid gap-4',
          gridColumns[columns]
        )}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <AnimatePresence mode="popLayout">
          {filteredCoupons.map((coupon) => {
            const isInteractive = canInteract ? canInteract(coupon) : true;
            
            return (
              <motion.div
                key={coupon.id}
                variants={itemVariants}
                layout
                exit={{
                  scale: 0.8,
                  opacity: 0,
                  transition: { duration: 0.2 }
                }}
              >
                <CouponCard
                  coupon={coupon}
                  variant={variant}
                  onClick={
                    onCouponClick && isInteractive 
                      ? () => onCouponClick(coupon)
                      : undefined
                  }
                  disabled={!isInteractive}
                  showStatus={false} // グリッドではステータスは表示しない
                />
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>

      {/* サマリー（使用済みの場合） */}
      {mode === 'used' && filteredCoupons.length > 0 && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <div className="text-sm text-gray-600 text-center">
            累計 <span className="font-semibold text-gray-900">
              {filteredCoupons.reduce((sum, coupon) => sum + coupon.face, 0).toLocaleString()}円
            </span> 分のクーポンを利用しました
          </div>
        </div>
      )}
    </div>
  );
}