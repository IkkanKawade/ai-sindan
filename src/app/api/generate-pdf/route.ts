import { NextRequest, NextResponse } from 'next/server'
import { Proposal } from '@/types'

// 仮のデータストア（実際はデータベースから取得）
const proposals: { [key: string]: Proposal } = {}

export async function POST(request: NextRequest) {
  try {
    const { proposalId } = await request.json()
    
    // 実際の実装では、データベースから提案データを取得
    const proposal = proposals[proposalId]
    if (!proposal) {
      return NextResponse.json(
        { error: 'Proposal not found' },
        { status: 404 }
      )
    }

    // シンプルなHTMLからPDFへの変換（将来的にはPuppeteerやjsPDFを使用）
    const htmlContent = generateProposalHTML(proposal)
    
    return new NextResponse(htmlContent, {
      headers: {
        'Content-Type': 'text/html',
        'Content-Disposition': `inline; filename="AI活用提案書_${proposal.companyName}.html"`,
      },
    })
  } catch (error) {
    console.error('PDF generation error:', error)
    return NextResponse.json(
      { error: 'PDF generation failed' },
      { status: 500 }
    )
  }
}

function generateProposalHTML(proposal: Proposal): string {
  return `
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>AI活用提案書 - ${proposal.companyName}</title>
  <style>
    body { font-family: 'Helvetica Neue', Arial, sans-serif; margin: 0; padding: 20px; line-height: 1.6; }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; margin-bottom: 30px; }
    .company-name { font-size: 24px; font-weight: bold; margin-bottom: 10px; }
    .date { opacity: 0.9; }
    .section { margin-bottom: 30px; }
    .section-title { font-size: 20px; font-weight: bold; color: #333; border-bottom: 2px solid #667eea; padding-bottom: 10px; margin-bottom: 15px; }
    .recommendation { background: #f8f9fa; padding: 20px; margin-bottom: 15px; border-radius: 8px; }
    .recommendation-title { font-size: 16px; font-weight: bold; color: #333; margin-bottom: 5px; }
    .category { background: #e3f2fd; color: #1565c0; padding: 4px 12px; border-radius: 4px; font-size: 12px; margin-bottom: 10px; display: inline-block; }
    .benefits { margin-top: 15px; }
    .benefit-item { margin-bottom: 5px; }
    .service { background: #fff; border: 1px solid #ddd; padding: 15px; margin-bottom: 15px; border-radius: 6px; }
    .service-title { font-weight: bold; margin-bottom: 8px; }
    .print-styles { display: none; }
    @media print {
      .print-styles { display: block; }
      body { margin: 0; }
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>AI活用提案書</h1>
    <div class="company-name">${proposal.companyName} 様</div>
    <div class="date">作成日: ${new Date(proposal.createdAt).toLocaleDateString('ja-JP')}</div>
  </div>

  <div class="section">
    <h2 class="section-title">課題サマリー</h2>
    <p>${proposal.summary}</p>
  </div>

  <div class="section">
    <h2 class="section-title">AI活用提案</h2>
    ${proposal.recommendations.map(rec => `
      <div class="recommendation">
        <div class="recommendation-title">${rec.solution}</div>
        <span class="category">${rec.category}</span>
        <p>${rec.description}</p>
        <p><strong>期待される効果: ${rec.timeSavingEstimate}時間/月の削減</strong></p>
        <div class="benefits">
          ${rec.expectedBenefits.map(benefit => `<div class="benefit-item">• ${benefit}</div>`).join('')}
        </div>
      </div>
    `).join('')}
  </div>

  <div class="section">
    <h2 class="section-title">導入ステップ</h2>
    ${proposal.implementationSteps.map((step, index) => `
      <div>${index + 1}. ${step}</div>
    `).join('')}
  </div>

  <div class="section">
    <h2 class="section-title">サービスメニュー</h2>
    ${proposal.serviceOptions.map(service => `
      <div class="service">
        <div class="service-title">${service.name}</div>
        <p>${service.description}</p>
        <p>期間: ${service.duration} / 料金: ${service.price}</p>
      </div>
    `).join('')}
  </div>

  <div class="section">
    <h2 class="section-title">お問い合わせ</h2>
    <p>本提案についてご質問やご相談がございましたら、お気軽にお問い合わせください。</p>
    <p>3営業日以内に担当者よりご連絡させていただきます。</p>
  </div>

  <script>
    // 自動的に印刷ダイアログを開く
    window.onload = function() {
      if (window.location.search.includes('print=true')) {
        window.print();
      }
    }
  </script>
</body>
</html>
  `
}

// 提案データを保存する関数（実際の実装では不要）
export function saveProposal(proposal: Proposal) {
  proposals[proposal.id] = proposal
}