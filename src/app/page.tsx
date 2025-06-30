'use client'

import { useState } from 'react'
import SurveyForm from '@/components/SurveyForm'
import ProposalResults from '@/components/ProposalResults'
import { SurveyData, Proposal } from '@/types'

export default function Home() {
  const [currentStep, setCurrentStep] = useState<'survey' | 'results'>('survey')
  const [proposal, setProposal] = useState<Proposal | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleSurveySubmit = async (data: SurveyData) => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      const result = await response.json()
      setProposal(result)
      setCurrentStep('results')
    } catch (error) {
      console.error('Error submitting survey:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleBackToSurvey = () => {
    setCurrentStep('survey')
    setProposal(null)
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            AI活用ニーズ調査システム
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            貴社の業務課題をお聞かせください。AIが最適な効率化提案を自動生成いたします。
          </p>
        </header>

        {isLoading && (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
            <div className="ml-4 text-lg">AIが分析中です...</div>
          </div>
        )}

        {!isLoading && currentStep === 'survey' && (
          <SurveyForm onSubmit={handleSurveySubmit} />
        )}

        {!isLoading && currentStep === 'results' && proposal && (
          <ProposalResults 
            proposal={proposal} 
            onBack={handleBackToSurvey}
          />
        )}
      </div>
    </main>
  )
}