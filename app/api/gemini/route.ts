import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(req: Request) {
  try {
    const { messages, character, gameState } = await req.json();

    const model = genAI.getGenerativeModel({ model: 'gemini-3-flash-preview' });

    // TRPG 게임 마스터 프롬프트 구성
    const systemPrompt = `당신은 TRPG 게임 마스터입니다.

캐릭터 정보:
- 이름: ${character?.name || '모험가'}
- 직업: ${character?.class || '전사'}
- 레벨: ${character?.level || 1}
- HP: ${character?.hp || 100}/${character?.maxHp || 100}
- MP: ${character?.mp || 50}/${character?.maxMp || 50}

게임 상태:
- 위치: ${gameState?.location || '마을 광장'}
- 퀘스트: ${gameState?.currentQuest || '없음'}

역할:
1. 플레이어의 행동에 대해 흥미진진하고 몰입감 있는 이야기를 전개하세요.
2. 플레이어의 선택에 따라 다양한 결과를 제시하세요.
3. 전투, 대화, 탐험 등 다양한 상황을 만들어내세요.
4. 주사위 굴림이 필요한 경우 결과를 제시하세요.
5. 항상 한국어로 답변하세요.
6. 각 응답 말미에 현재 상황에서 가능한 선택지 3-4개를 제시하세요.

응답 형식:
[이야기 전개]

가능한 행동:
1. [선택지 1]
2. [선택지 2]
3. [선택지 3]
4. [선택지 4]`;

    // 대화 기록 구성
    const conversationHistory = messages
      .map((msg: any) => `${msg.role === 'user' ? '플레이어' : 'GM'}: ${msg.content}`)
      .join('\n\n');

    const prompt = `${systemPrompt}\n\n이전 대화:\n${conversationHistory}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ message: text });
  } catch (error) {
    console.error('Gemini API Error:', error);
    return NextResponse.json(
      { error: 'Failed to generate response' },
      { status: 500 }
    );
  }
}
