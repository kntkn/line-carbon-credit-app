'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Clock, Tag, CheckCircle2 } from 'lucide-react';
import { Coupon } from '@/types';
import { formatYen, formatDate, cn } from '@/utils';

interface CouponCardProps {
  coupon: Coupon;
  variant?: 'compact' | 'detailed';
  onClick?: () => void;
  disabled?: boolean;
  showStatus?: boolean;
}

const statusConfig = {
  redeemable: {
    label: '引き換え可能',
    color: 'text-green-600 bg-green-50',
    border: 'border-green-200'
  },
  usable: {
    label: '利用可能',
    color: 'text-blue-600 bg-blue-50',
    border: 'border-blue-200'
  },
  used: {
    label: '使用済み',
    color: 'text-gray-500 bg-gray-50',
    border: 'border-gray-200'
  }
} as const;

export function CouponCard({
  coupon,
  variant = 'compact',
  onClick,
  disabled = false,
  showStatus = true
}: CouponCardProps) {
  const statusStyle = statusConfig[coupon.status];
  const isClickable = onClick && !disabled;

  if (variant === 'compact') {
    return (
      <motion.div
        className={cn(
          'line-card p-4 relative',
          isClickable && 'cursor-pointer hover:shadow-md',
          disabled && 'opacity-50 cursor-not-allowed',
          coupon.status === 'used' && 'opacity-75'
        )}
        whileTap={isClickable ? { scale: 0.98 } : undefined}
        onClick={isClickable ? onClick : undefined}
      >
        {/* ステータスバッジ */}
        {showStatus && (
          <div className={cn(
            'absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-medium',
            statusStyle.color,
            statusStyle.border
          )}>
            {statusStyle.label}
          </div>
        )}

        {/* アイコンとブランド名 */}
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-carbon-primary to-carbon-secondary flex items-center justify-center text-2xl text-white shadow-sm">
            {coupon.icon || '🎟️'}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 truncate">
              {coupon.brand}
            </h3>
            <p className="text-sm text-gray-500">
              {formatYen(coupon.face)}割引
            </p>
          </div>
        </div>

        {/* 説明（短縮版） */}
        {coupon.description && (
          <p className="text-sm text-gray-600 line-clamp-2 mb-2">
            {coupon.description}
          </p>
        )}

        {/* 必要クレジット */}
        {coupon.status === 'redeemable' && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">必要クレジット</span>
            <span className="font-medium text-carbon-primary">
              {coupon.needCredits}t
            </span>
          </div>
        )}

        {/* 有効期限 */}
        {coupon.expiresAt && (
          <div className="flex items-center gap-1 text-xs text-gray-500 mt-2">
            <Clock className="w-3 h-3" />
            <span>期限: {formatDate(coupon.expiresAt)}</span>
          </div>
        )}

        {/* 使用済み日時 */}
        {coupon.status === 'used' && coupon.usedAt && (
          <div className="flex items-center gap-1 text-xs text-gray-500 mt-2">
            <CheckCircle2 className="w-3 h-3" />
            <span>使用日: {formatDate(coupon.usedAt)}</span>
          </div>
        )}
      </motion.div>
    );
  }

  // Detailed variant
  return (
    <motion.div
      className={cn(
        'line-card p-6 space-y-4',
        isClickable && 'cursor-pointer hover:shadow-lg',
        disabled && 'opacity-50 cursor-not-allowed'
      )}
      whileTap={isClickable ? { scale: 0.98 } : undefined}
      onClick={isClickable ? onClick : undefined}
    >
      {/* ヘッダー */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-carbon-primary to-carbon-secondary flex items-center justify-center text-3xl text-white shadow-md">
            {coupon.icon || '🎟️'}
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">
              {coupon.brand}
            </h3>
            <p className="text-lg text-carbon-primary font-semibold">
              {formatYen(coupon.face)}割引
            </p>
          </div>
        </div>

        {showStatus && (
          <div className={cn(
            'px-3 py-1.5 rounded-full text-sm font-medium flex items-center gap-1',
            statusStyle.color,
            statusStyle.border
          )}>
            <Tag className="w-3 h-3" />
            {statusStyle.label}
          </div>
        )}
      </div>

      {/* 説明 */}
      {coupon.description && (
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-gray-700 leading-relaxed">
            {coupon.description}
          </p>
        </div>
      )}

      {/* 対象商品 */}
      {coupon.products && coupon.products.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-gray-900 mb-2">
            対象商品・サービス
          </h4>
          <ul className="space-y-1">
            {coupon.products.map((product, index) => (
              <li key={index} className="text-sm text-gray-600 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-carbon-primary" />
                {product}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* メタ情報 */}
      <div className="space-y-2 pt-2 border-t border-gray-100">
        {/* 必要クレジット */}
        {coupon.status === 'redeemable' && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">必要クレジット</span>
            <span className="font-semibold text-carbon-primary">
              {coupon.needCredits}t CO₂
            </span>
          </div>
        )}

        {/* クーポンコード */}
        {coupon.code && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">コード</span>
            <code className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">
              {coupon.code}
            </code>
          </div>
        )}

        {/* PIN */}
        {coupon.pin && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">PIN</span>
            <code className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">
              {coupon.pin}
            </code>
          </div>
        )}

        {/* 有効期限 */}
        {coupon.expiresAt && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">有効期限</span>
            <span className="text-sm font-medium">
              {formatDate(coupon.expiresAt)}
            </span>
          </div>
        )}

        {/* 使用日時 */}
        {coupon.status === 'used' && coupon.usedAt && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">使用日時</span>
            <span className="text-sm font-medium">
              {formatDate(coupon.usedAt)}
            </span>
          </div>
        )}
      </div>
    </motion.div>
  );
}