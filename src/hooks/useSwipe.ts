'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { SwipeState } from '@/types';
import { calculateSwipeProgress } from '@/utils';

interface UseSwipeProps {
  onComplete: () => void;
  threshold?: number; // 完了に必要な進捗率（0-100）
  disabled?: boolean;
}

export function useSwipe({ 
  onComplete, 
  threshold = 75, 
  disabled = false 
}: UseSwipeProps) {
  const [swipeState, setSwipeState] = useState<SwipeState>({
    isDragging: false,
    startX: 0,
    currentX: 0,
    progress: 0,
    isCompleted: false
  });

  const containerRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>();

  const resetSwipe = useCallback(() => {
    setSwipeState({
      isDragging: false,
      startX: 0,
      currentX: 0,
      progress: 0,
      isCompleted: false
    });
  }, []);

  const updateProgress = useCallback((clientX: number) => {
    if (!containerRef.current || disabled) return;

    const containerWidth = containerRef.current.offsetWidth;
    const progress = calculateSwipeProgress(
      swipeState.startX,
      clientX,
      containerWidth
    );

    // requestAnimationFrame でスムーズな更新
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
    }

    rafRef.current = requestAnimationFrame(() => {
      setSwipeState(prev => ({
        ...prev,
        currentX: clientX,
        progress: Math.min(progress, 100)
      }));

      // 閾値を超えた場合の完了処理
      if (progress >= threshold && !swipeState.isCompleted) {
        setSwipeState(prev => ({ ...prev, isCompleted: true }));
        onComplete();
      }
    });
  }, [swipeState.startX, swipeState.isCompleted, threshold, onComplete, disabled]);

  const handleStart = useCallback((clientX: number) => {
    if (disabled) return;

    setSwipeState(prev => ({
      ...prev,
      isDragging: true,
      startX: clientX,
      currentX: clientX,
      progress: 0,
      isCompleted: false
    }));
  }, [disabled]);

  const handleMove = useCallback((clientX: number) => {
    if (!swipeState.isDragging || disabled) return;
    updateProgress(clientX);
  }, [swipeState.isDragging, updateProgress, disabled]);

  const handleEnd = useCallback(() => {
    if (disabled) return;

    setSwipeState(prev => ({
      ...prev,
      isDragging: false
    }));

    // 閾値に達していない場合はリセット
    if (swipeState.progress < threshold) {
      setTimeout(resetSwipe, 200);
    }
  }, [swipeState.progress, threshold, resetSwipe, disabled]);

  // マウスイベント
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    handleStart(e.clientX);
  }, [handleStart]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    handleMove(e.clientX);
  }, [handleMove]);

  const handleMouseUp = useCallback(() => {
    handleEnd();
  }, [handleEnd]);

  // タッチイベント
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    e.preventDefault();
    const touch = e.touches[0];
    if (touch) {
      handleStart(touch.clientX);
    }
  }, [handleStart]);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    e.preventDefault();
    const touch = e.touches[0];
    if (touch) {
      handleMove(touch.clientX);
    }
  }, [handleMove]);

  const handleTouchEnd = useCallback(() => {
    handleEnd();
  }, [handleEnd]);

  // グローバルイベントリスナーの設定
  useEffect(() => {
    if (swipeState.isDragging) {
      // マウス
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      
      // タッチ
      document.addEventListener('touchmove', handleTouchMove, { passive: false });
      document.addEventListener('touchend', handleTouchEnd);

      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.removeEventListener('touchmove', handleTouchMove);
        document.removeEventListener('touchend', handleTouchEnd);
      };
    }
  }, [
    swipeState.isDragging, 
    handleMouseMove, 
    handleMouseUp, 
    handleTouchMove, 
    handleTouchEnd
  ]);

  // クリーンアップ
  useEffect(() => {
    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  return {
    swipeState,
    containerRef,
    resetSwipe,
    handlers: {
      onMouseDown: handleMouseDown,
      onTouchStart: handleTouchStart
    }
  };
}