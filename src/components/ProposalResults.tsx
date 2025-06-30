'use client'

import { useState } from 'react'
import { Proposal, AIRecommendation } from '@/types'

interface ProposalResultsProps {
  proposal: Proposal
  onBack: () => void
}

export default function ProposalResults({ proposal, onBack }: ProposalResultsProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'recommendations' | 'services'>('overview')

  const generatePDF = async () => {
    try {
      const response = await fetch('/api/generate-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ proposalId: proposal.id }),
      })
      
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.style.display = 'none'
        a.href = url
        a.download = `AI活用提案書_${proposal.companyName}.pdf`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
      }
    } catch (error) {
      console.error('PDF generation failed:', error)
    }
  }

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'low': return 'bg-green-100 text-green-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'high': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getComplexityText = (complexity: string) => {
    switch (complexity) {
      case 'low': return '低'
      case 'medium': return '中'
      case 'high': return '高'
      default: return '不明'
    }
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold mb-2">AI活用提案書</h1>
              <h2 className="text-xl opacity-90">{proposal.companyName} 様</h2>
              <p className="text-sm opacity-75 mt-2">
                作成日: {new Date(proposal.createdAt).toLocaleDateString('ja-JP')}
              </p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={generatePDF}
                className="bg-white text-blue-600 px-4 py-2 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
              >
                PDF ダウンロード
              </button>
              <button
                onClick={onBack}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-400 transition-colors"
              >
                戻る
              </button>
            </div>
          </div>
        </div>

        <div className="border-b">
          <nav className="flex">
            {[
              { id: 'overview', label: '概要' },
              { id: 'recommendations', label: '提案内容' },
              { id: 'services', label: 'サービス' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-6 py-4 font-medium text-sm border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="space-y-8">
              <section>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">課題サマリー</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-700 leading-relaxed">{proposal.summary}</p>
                </div>
              </section>

              <section>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">導入効果サマリー</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {proposal.recommendations.map((rec, index) => (
                    <div key={index} className="bg-blue-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-blue-900 mb-2">{rec.category}</h4>
                      <p className="text-2xl font-bold text-blue-600 mb-1">
                        {rec.timeSavingEstimate}時間/月
                      </p>
                      <p className="text-sm text-blue-700">削減予想</p>
                    </div>
                  ))}
                </div>
              </section>

              <section>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">導入ステップ</h3>
                <div className="space-y-3">
                  {proposal.implementationSteps.map((step, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                        {index + 1}
                      </div>
                      <p className="text-gray-700 pt-1">{step}</p>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          )}

          {activeTab === 'recommendations' && (
            <div className="space-y-6">
              {proposal.recommendations.map((recommendation, index) => (
                <div key={index} className="border rounded-lg p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-1">
                        {recommendation.solution}
                      </h3>
                      <span className="inline-block bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full">
                        {recommendation.category}
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-green-600 mb-1">
                        {recommendation.timeSavingEstimate}時間/月
                      </div>
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getComplexityColor(recommendation.implementationComplexity)}`}>
                        難易度: {getComplexityText(recommendation.implementationComplexity)}
                      </span>
                    </div>
                  </div>

                  <p className="text-gray-700 mb-4 leading-relaxed">
                    {recommendation.description}
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">期待される効果</h4>
                      <ul className="space-y-1">
                        {recommendation.expectedBenefits.map((benefit, i) => (
                          <li key={i} className="flex items-start space-x-2">
                            <span className="text-green-500 mt-1">✓</span>
                            <span className="text-gray-700 text-sm">{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">推奨ツール</h4>
                      <div className="flex flex-wrap gap-2">
                        {recommendation.suggestedTools.map((tool, i) => (
                          <span key={i} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                            {tool}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'services' && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                  当社サービスメニュー
                </h3>
                <p className="text-gray-600">
                  提案内容の実現に向けて、最適なサービスをご提供いたします
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {proposal.serviceOptions.map((service, index) => (
                  <div key={index} className="border rounded-lg p-6 hover:shadow-lg transition-shadow">
                    <div className="text-center mb-4">
                      <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <span className="text-2xl">
                          {service.type === 'training' ? '🎓' : 
                           service.type === 'poc' ? '🔬' : '⚙️'}
                        </span>
                      </div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-2">
                        {service.name}
                      </h4>
                    </div>

                    <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                      {service.description}
                    </p>

                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">期間:</span>
                        <span className="font-medium">{service.duration}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">料金:</span>
                        <span className="font-medium text-blue-600">{service.price}</span>
                      </div>
                    </div>

                    <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium">
                      詳細を問い合わせる
                    </button>
                  </div>
                ))}
              </div>

              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg mt-8">
                <h4 className="text-lg font-semibold text-gray-900 mb-3">
                  次のステップ
                </h4>
                <div className="space-y-2 text-sm text-gray-700">
                  <p>1. 本提案書をご検討いただき、ご質問やご要望をお聞かせください</p>
                  <p>2. 無料相談会にて、詳細なヒアリングと具体的な実装方法をご提案</p>
                  <p>3. PoC実施による効果検証（希望される場合）</p>
                  <p>4. 本格導入・開発プロジェクトの開始</p>
                </div>
                <div className="mt-4 pt-4 border-t border-blue-200">
                  <p className="text-sm text-blue-700">
                    <strong>お問い合わせ:</strong> 3営業日以内にご担当者よりご連絡させていただきます
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}