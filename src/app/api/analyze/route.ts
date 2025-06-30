import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import { SurveyData, AIRecommendation, Proposal, ServiceOption } from '@/types'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

const SERVICE_OPTIONS: ServiceOption[] = [
  {
    type: 'training',
    name: 'AI活用研修プログラム',
    description: 'ChatGPT・生成AI活用の基礎から実践まで、貴社の業務に特化した研修を実施',
    duration: '2日間',
    price: '50万円〜'
  },
  {
    type: 'poc',
    name: 'PoC（概念実証）支援',
    description: '小規模な実証実験で効果を確認してから本格導入を検討',
    duration: '1-2ヶ月',
    price: '100万円〜'
  },
  {
    type: 'development',
    name: 'AI システム開発',
    description: '貴社専用のAIシステム・ツールを開発・運用支援',
    duration: '3-6ヶ月',
    price: '300万円〜'
  }
]

export async function POST(request: NextRequest) {
  try {
    const surveyData: SurveyData = await request.json()

    const prompt = `
以下の企業情報を分析し、AI活用による業務効率化の提案を作成してください。

企業情報:
- 会社名: ${surveyData.companyName}
- 業種: ${surveyData.industry}
- 従業員数: ${surveyData.employeeCount}
- 対象部門: ${surveyData.department}
- 現在の課題: ${surveyData.currentChallenges.join(', ')}
- 業務フロー詳細: ${surveyData.workflowDescription}
- 予算: ${surveyData.budget}
- 導入時期: ${surveyData.timeline}

以下の形式でJSONレスポンスを生成してください:

{
  "summary": "企業の課題を3行程度で要約",
  "recommendations": [
    {
      "category": "カテゴリ名（例：営業効率化、顧客対応自動化等）",
      "solution": "具体的なソリューション名",
      "description": "解決策の詳細説明",
      "expectedBenefits": ["期待される効果1", "期待される効果2"],
      "timeSavingEstimate": 削減時間数（時間/月）,
      "implementationComplexity": "low/medium/high",
      "suggestedTools": ["推奨ツール1", "推奨ツール2"]
    }
  ],
  "developmentScope": ["開発範囲1", "開発範囲2"],
  "implementationSteps": ["実装ステップ1", "実装ステップ2"]
}

実用性と具体性を重視し、ROIが明確になるよう数値も含めて提案してください。
`

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "あなたはAI活用コンサルタントとして、企業の業務効率化提案を行う専門家です。具体的で実行可能な提案を心がけてください。"
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
    })

    const aiResponse = completion.choices[0].message.content
    if (!aiResponse) {
      throw new Error('AI response is empty')
    }

    let parsedResponse
    try {
      parsedResponse = JSON.parse(aiResponse)
    } catch (e) {
      console.error('Failed to parse AI response:', aiResponse)
      throw new Error('Failed to parse AI response')
    }

    const proposal: Proposal = {
      id: `proposal_${Date.now()}`,
      companyName: surveyData.companyName,
      summary: parsedResponse.summary,
      recommendations: parsedResponse.recommendations,
      developmentScope: parsedResponse.developmentScope,
      implementationSteps: parsedResponse.implementationSteps,
      serviceOptions: SERVICE_OPTIONS,
      createdAt: new Date()
    }

    // 営業通知とCRM連携
    if (process.env.NODE_ENV === 'production') {
      // 本番環境でのみ通知を送信
      await notifySalesTeam(surveyData, proposal)
    }

    return NextResponse.json(proposal)
  } catch (error) {
    console.error('Error in analyze API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

async function notifySalesTeam(surveyData: SurveyData, proposal: Proposal) {
  // Slack通知やメール送信のロジックをここに実装
  console.log('Notifying sales team for:', surveyData.companyName)
  
  // 例: Slackへの通知
  if (process.env.SLACK_WEBHOOK_URL) {
    try {
      await fetch(process.env.SLACK_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: `新しいAI活用ニーズ調査が完了しました！\n会社名: ${surveyData.companyName}\n業種: ${surveyData.industry}\n担当者: ${surveyData.contactInfo.name} (${surveyData.contactInfo.email})\n予算: ${surveyData.budget}\n提案ID: ${proposal.id}`
        })
      })
    } catch (error) {
      console.error('Failed to send Slack notification:', error)
    }
  }
}