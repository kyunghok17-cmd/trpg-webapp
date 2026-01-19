'use client';

import { useState, useRef, useEffect } from 'react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface Character {
  name: string;
  class: string;
  level: number;
  hp: number;
  maxHp: number;
  mp: number;
  maxMp: number;
}

interface GameState {
  location: string;
  currentQuest: string;
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [character, setCharacter] = useState<Character>({
    name: '모험가',
    class: '전사',
    level: 1,
    hp: 100,
    maxHp: 100,
    mp: 50,
    maxMp: 50,
  });
  const [gameState, setGameState] = useState<GameState>({
    location: '마을 광장',
    currentQuest: '없음',
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const startGame = async () => {
    setGameStarted(true);
    setLoading(true);

    const initialMessage = '게임을 시작합니다. 나는 모험을 시작하려는 초보 모험가입니다.';
    const newMessages = [{ role: 'user' as const, content: initialMessage }];

    try {
      const response = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages,
          character,
          gameState,
        }),
      });

      const data = await response.json();
      setMessages([
        ...newMessages,
        { role: 'assistant', content: data.message },
      ]);
    } catch (error) {
      console.error('Error:', error);
      setMessages([
        ...newMessages,
        {
          role: 'assistant',
          content: '오류가 발생했습니다. 다시 시도해주세요.',
        },
      ]);
    }

    setLoading(false);
  };

  const sendMessage = async (message?: string) => {
    const messageToSend = message || input;
    if (!messageToSend.trim() || loading) return;

    const newMessages = [...messages, { role: 'user' as const, content: messageToSend }];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages,
          character,
          gameState,
        }),
      });

      const data = await response.json();
      setMessages([...newMessages, { role: 'assistant', content: data.message }]);
    } catch (error) {
      console.error('Error:', error);
      setMessages([
        ...newMessages,
        {
          role: 'assistant',
          content: '오류가 발생했습니다. 다시 시도해주세요.',
        },
      ]);
    }

    setLoading(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (!gameStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full bg-black/30 backdrop-blur-md rounded-2xl p-8 border border-purple-500/30 shadow-2xl">
          <h1 className="text-5xl font-bold text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
            ⚔️ TRPG Adventure ⚔️
          </h1>

          <div className="space-y-6 mb-8">
            <div>
              <label className="block text-purple-300 mb-2 font-semibold">캐릭터 이름</label>
              <input
                type="text"
                value={character.name}
                onChange={(e) => setCharacter({ ...character, name: e.target.value })}
                className="w-full px-4 py-3 bg-white/10 border border-purple-500/50 rounded-lg text-white placeholder-purple-300/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="당신의 이름을 입력하세요"
              />
            </div>

            <div>
              <label className="block text-purple-300 mb-2 font-semibold">직업</label>
              <select
                value={character.class}
                onChange={(e) => setCharacter({ ...character, class: e.target.value })}
                className="w-full px-4 py-3 bg-white/10 border border-purple-500/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="전사">⚔️ 전사</option>
                <option value="마법사">🔮 마법사</option>
                <option value="도적">🗡️ 도적</option>
                <option value="성기사">✨ 성기사</option>
                <option value="궁수">🏹 궁수</option>
              </select>
            </div>
          </div>

          <button
            onClick={startGame}
            disabled={loading}
            className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold rounded-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
          >
            {loading ? '게임 준비 중...' : '🎮 모험 시작하기'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <div className="container mx-auto p-4 h-screen flex flex-col">
        {/* 상단 캐릭터 상태 바 */}
        <div className="bg-black/30 backdrop-blur-md rounded-xl p-4 mb-4 border border-purple-500/30">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-purple-300">
                {character.name} <span className="text-sm text-purple-400">Lv.{character.level}</span>
              </h2>
              <p className="text-purple-400">{character.class}</p>
            </div>
            <div className="text-right space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-red-400 font-semibold">HP:</span>
                <div className="w-32 h-3 bg-black/50 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-red-600 to-red-400 transition-all"
                    style={{ width: `${(character.hp / character.maxHp) * 100}%` }}
                  />
                </div>
                <span className="text-white text-sm">{character.hp}/{character.maxHp}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-blue-400 font-semibold">MP:</span>
                <div className="w-32 h-3 bg-black/50 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-600 to-blue-400 transition-all"
                    style={{ width: `${(character.mp / character.maxMp) * 100}%` }}
                  />
                </div>
                <span className="text-white text-sm">{character.mp}/{character.maxMp}</span>
              </div>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-purple-500/30 text-sm">
            <span className="text-purple-400">📍 위치: </span>
            <span className="text-white">{gameState.location}</span>
            <span className="text-purple-400 ml-4">📜 퀘스트: </span>
            <span className="text-white">{gameState.currentQuest}</span>
          </div>
        </div>

        {/* 메시지 영역 */}
        <div className="flex-1 bg-black/30 backdrop-blur-md rounded-xl p-6 overflow-y-auto mb-4 border border-purple-500/30">
          <div className="space-y-4">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-4 rounded-lg ${
                    msg.role === 'user'
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                      : 'bg-white/10 text-purple-100 border border-purple-500/30'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white/10 text-purple-100 p-4 rounded-lg border border-purple-500/30">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce delay-100" />
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce delay-200" />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* 입력 영역 */}
        <div className="bg-black/30 backdrop-blur-md rounded-xl p-4 border border-purple-500/30">
          <div className="flex gap-2">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="행동을 입력하세요... (Enter로 전송, Shift+Enter로 줄바꿈)"
              className="flex-1 px-4 py-3 bg-white/10 border border-purple-500/50 rounded-lg text-white placeholder-purple-300/50 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
              rows={2}
              disabled={loading}
            />
            <button
              onClick={() => sendMessage()}
              disabled={loading || !input.trim()}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              전송
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
