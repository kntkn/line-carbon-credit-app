'use client';

import React, { useEffect, useRef } from 'react';
import { generateBarcodeData } from '@/utils';

interface BarcodeProps {
  data: string;
  className?: string;
  showText?: boolean;
}

export function Barcode({ data, className = '', showText = true }: BarcodeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // バーコードデータを生成（決定的）
    const barcodeData = generateBarcodeData(data);
    
    // キャンバスサイズを設定
    const width = 280;
    const height = 120;
    canvas.width = width;
    canvas.height = height;

    // 背景を白に
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, width, height);

    // バーの描画
    ctx.fillStyle = 'black';
    
    const barWidth = width / barcodeData.length;
    let currentX = 0;

    // 各桁を細いバーと太いバーのパターンに変換
    for (let i = 0; i < barcodeData.length; i++) {
      const digit = parseInt(barcodeData[i]);
      
      // 0-9 の数字を バーパターンに変換（簡易版）
      const patterns = [
        [1, 1, 0, 0], // 0
        [0, 1, 1, 0], // 1  
        [0, 0, 1, 1], // 2
        [1, 0, 0, 1], // 3
        [1, 1, 1, 0], // 4
        [0, 1, 1, 1], // 5
        [1, 0, 1, 0], // 6
        [0, 1, 0, 1], // 7
        [1, 0, 1, 1], // 8
        [1, 1, 0, 1], // 9
      ];

      const pattern = patterns[digit];
      
      for (let j = 0; j < pattern.length; j++) {
        if (pattern[j] === 1) {
          ctx.fillRect(
            currentX + j * (barWidth / 4),
            10,
            Math.max(1, barWidth / 4),
            height - 30
          );
        }
      }
      
      currentX += barWidth;
    }

    // 数字の描画（下部）
    if (showText) {
      ctx.fillStyle = 'black';
      ctx.font = '12px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(
        barcodeData,
        width / 2,
        height - 8
      );
    }
  }, [data, showText]);

  return (
    <div className={`inline-block ${className}`}>
      <div className="bg-white p-4 rounded-lg border-2 border-dashed border-gray-300 shadow-sm">
        <canvas 
          ref={canvasRef}
          className="block mx-auto"
          style={{ maxWidth: '100%', height: 'auto' }}
        />
      </div>
    </div>
  );
}