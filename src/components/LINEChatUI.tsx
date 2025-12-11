'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, MoreHorizontal, Plus, Send, Zap, BarChart3, User } from 'lucide-react';
import { ChatMessage } from '@/types';
import { generateId, formatTime, cn } from '@/utils';

interface LINEChatUIProps {
  onNavigateToApp: (tab?: 'apply' | 'credits') => void;
  onNavigateToMypage: () => void;
  className?: string;
}

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: generateId(),
    from: 'bot',
    text: 'Decoponミニアプリへようこそ！カーボンクレジットをクーポンに交換できます。下のメニューからお選びください。',
    time: formatTime()
  }
];

export function LINEChatUI({
  onNavigateToApp,
  onNavigateToMypage,
  className
}: LINEChatUIProps) {
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // メッセージ自動スクロール
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ 
      behavior: 'smooth',
      block: 'end'
    });
  }, [messages]);

  const addMessage = (from: 'user' | 'bot', text: string) => {
    const newMessage: ChatMessage = {
      id: generateId(),
      from,
      text,
      time: formatTime()
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const handleSendMessage = () => {
    if (!inputText.trim()) return;

    // ユーザーメッセージ追加
    addMessage('user', inputText.trim());
    setInputText('');

    // ボットの自動応答
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      addMessage('bot', 'ありがとうございます。下のメニューから操作を選択してください。');
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleRichMenuAction = (action: string) => {
    let userMessage = '';
    
    switch (action) {
      case 'apply':
        userMessage = 'クレジットを申請したい';
        onNavigateToApp('apply');
        break;
      case 'credits':
        userMessage = '保有クレジットを確認したい';
        onNavigateToApp('credits');
        break;
      case 'mypage':
        userMessage = 'マイページを見たい';
        onNavigateToMypage();
        break;
      default:
        return;
    }

    addMessage('user', userMessage);
  };

  const messageVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.3 }
    }
  };

  return (
    <div className={cn('flex flex-col h-full bg-line-bg', className)}>
      {/* ヘッダー */}
      <div className="h-14 bg-white border-b border-gray-200 flex items-center px-4 shadow-sm">
        <button className="mr-3 p-1">
          <ChevronLeft className="w-6 h-6 text-gray-600" />
        </button>
        
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-carbon-primary to-carbon-secondary flex items-center justify-center text-white font-bold shadow-sm">
          D
        </div>
        
        <div className="ml-3 flex-1">
          <div className="flex items-center gap-1">
            <h1 className="font-semibold text-gray-900">Decopon（公式）</h1>
            <div className="w-4 h-4 rounded-full bg-line-green flex items-center justify-center">
              <span className="text-white text-xs">✓</span>
            </div>
          </div>
          <p className="text-xs text-gray-500">応答時間: 通常2〜3営業日</p>
        </div>

        <button className="p-2">
          <MoreHorizontal className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      {/* メッセージエリア */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* 日付セパレーター */}
        <div className="text-center">
          <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded-full">
            今日
          </span>
        </div>

        {/* メッセージリスト */}
        <AnimatePresence mode="popLayout">
          {messages.map((message) => (
            <motion.div
              key={message.id}
              variants={messageVariants}
              initial="hidden"
              animate="visible"
              className={cn(
                'flex items-end gap-2',
                message.from === 'user' ? 'justify-end' : 'justify-start'
              )}
            >
              {/* ボットアバター */}
              {message.from === 'bot' && (
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-carbon-primary to-carbon-secondary flex items-center justify-center text-white text-sm font-bold shadow-sm">
                  D
                </div>
              )}

              {/* メッセージバブル */}
              <div className={cn(
                'max-w-[85%] px-4 py-3 rounded-2xl shadow-sm',
                message.from === 'bot' 
                  ? 'bg-white text-gray-800 rounded-tl-md' 
                  : 'bg-line-message text-gray-800 rounded-tr-md'
              )}>
                <p className="text-sm leading-relaxed whitespace-pre-wrap">
                  {message.text}
                </p>
              </div>

              {/* 時刻 */}
              <div className="text-xs text-gray-500 mb-1 min-w-0">
                {message.time}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* タイピングインジケーター */}
        {isTyping && (
          <motion.div
            className="flex items-end gap-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-carbon-primary to-carbon-secondary flex items-center justify-center text-white text-sm font-bold">
              D
            </div>
            <div className="bg-white px-4 py-3 rounded-2xl rounded-tl-md shadow-sm">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
              </div>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* リッチメニュー */}
      <div className="bg-[#FFF6D6] border-t border-gray-200 p-4">
        <div className="grid grid-cols-2 grid-rows-2 gap-3 h-72">
          {/* 申請する（左側2行結合） */}
          <button
            onClick={() => handleRichMenuAction('apply')}
            className="row-span-2 rich-menu-button rich-menu-primary group"
          >
            <Zap className="w-8 h-8 text-carbon-primary group-hover:scale-110 transition-transform" />
            <span className="font-semibold text-gray-900">申請する</span>
            <span className="text-xs text-gray-600">クレジット申請</span>
          </button>

          {/* 保有クレジット（右上） */}
          <button
            onClick={() => handleRichMenuAction('credits')}
            className="rich-menu-button rich-menu-secondary group"
          >
            <BarChart3 className="w-6 h-6 text-carbon-primary group-hover:scale-110 transition-transform" />
            <span className="text-sm font-medium text-gray-900">保有クレジット</span>
          </button>

          {/* マイページ（右下） */}
          <button
            onClick={() => handleRichMenuAction('mypage')}
            className="rich-menu-button rich-menu-secondary group"
          >
            <User className="w-6 h-6 text-carbon-primary group-hover:scale-110 transition-transform" />
            <span className="text-sm font-medium text-gray-900">マイページ</span>
          </button>
        </div>
      </div>

      {/* 入力エリア */}
      <div className="bg-white border-t border-gray-200 p-3">
        <div className="flex items-center gap-2">
          <button className="p-2 text-gray-500">
            <Plus className="w-5 h-5" />
          </button>
          
          <div className="flex-1 relative">
            <input
              ref={inputRef}
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="メッセージを入力"
              className="w-full px-4 py-2 bg-gray-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-line-green/30"
            />
          </div>

          <button
            onClick={handleSendMessage}
            disabled={!inputText.trim()}
            className={cn(
              'p-2 rounded-full transition-all',
              inputText.trim()
                ? 'bg-line-green text-white hover:bg-line-green-dark'
                : 'text-gray-400'
            )}
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}