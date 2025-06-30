'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { SurveyData } from '@/types'

interface SurveyFormProps {
  onSubmit: (data: SurveyData) => void
}

const INDUSTRIES = [
  '製造業', 'IT・ソフトウェア', '金融・保険', '小売・EC', '医療・福祉',
  'コンサルティング', '不動産', '建設', '教育', 'その他'
]

const EMPLOYEE_COUNTS = [
  '1-10名', '11-50名', '51-100名', '101-300名', '301-1000名', '1000名以上'
]

const DEPARTMENTS = [
  '営業・マーケティング', 'バックオフィス', 'カスタマーサポート', 
  '人事・総務', '経営企画', '開発・技術', 'その他'
]

const CHALLENGE_OPTIONS = [
  '営業活動の効率化', 'マーケティング施策の最適化', '顧客対応の自動化',
  'データ分析・レポート作成', '書類作成の自動化', '社内ナレッジ管理',
  '業務プロセスの標準化', 'コスト削減', 'その他'
]

const BUDGETS = [
  '50万円未満', '50-100万円', '100-300万円', '300-500万円', '500万円以上', '未定'
]

const TIMELINES = [
  '1ヶ月以内', '3ヶ月以内', '6ヶ月以内', '1年以内', '未定'
]

export default function SurveyForm({ onSubmit }: SurveyFormProps) {
  const { register, handleSubmit, watch, formState: { errors } } = useForm<SurveyData>()
  const [selectedChallenges, setSelectedChallenges] = useState<string[]>([])

  const handleChallengeChange = (challenge: string) => {
    setSelectedChallenges(prev => 
      prev.includes(challenge) 
        ? prev.filter(c => c !== challenge)
        : [...prev, challenge]
    )
  }

  const onSubmitForm = (data: any) => {
    const formattedData: SurveyData = {
      ...data,
      currentChallenges: selectedChallenges,
      contactInfo: {
        name: data.contactName,
        email: data.contactEmail,
        phone: data.contactPhone,
        position: data.contactPosition,
      }
    }
    onSubmit(formattedData)
  }

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
      <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-8">
        
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-gray-900 border-b pb-2">
            基本情報
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                会社名 *
              </label>
              <input
                {...register('companyName', { required: '会社名は必須です' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="株式会社○○"
              />
              {errors.companyName && (
                <p className="text-red-500 text-sm mt-1">{errors.companyName.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                業種 *
              </label>
              <select
                {...register('industry', { required: '業種は必須です' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">選択してください</option>
                {INDUSTRIES.map(industry => (
                  <option key={industry} value={industry}>{industry}</option>
                ))}
              </select>
              {errors.industry && (
                <p className="text-red-500 text-sm mt-1">{errors.industry.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                従業員数 *
              </label>
              <select
                {...register('employeeCount', { required: '従業員数は必須です' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">選択してください</option>
                {EMPLOYEE_COUNTS.map(count => (
                  <option key={count} value={count}>{count}</option>
                ))}
              </select>
              {errors.employeeCount && (
                <p className="text-red-500 text-sm mt-1">{errors.employeeCount.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                対象部門 *
              </label>
              <select
                {...register('department', { required: '対象部門は必須です' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">選択してください</option>
                {DEPARTMENTS.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
              {errors.department && (
                <p className="text-red-500 text-sm mt-1">{errors.department.message}</p>
              )}
            </div>
          </div>
        </section>

        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-gray-900 border-b pb-2">
            課題・ニーズ
          </h2>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              現在の課題（複数選択可） *
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {CHALLENGE_OPTIONS.map(challenge => (
                <label key={challenge} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={selectedChallenges.includes(challenge)}
                    onChange={() => handleChallengeChange(challenge)}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">{challenge}</span>
                </label>
              ))}
            </div>
            {selectedChallenges.length === 0 && (
              <p className="text-red-500 text-sm mt-1">少なくとも1つの課題を選択してください</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              具体的な業務フロー・課題の詳細 *
            </label>
            <textarea
              {...register('workflowDescription', { required: '業務フローの記入は必須です' })}
              rows={5}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="現在の業務フローや具体的な課題について詳しくお聞かせください。例：営業資料作成に1件あたり2時間かかっている、顧客からの問い合わせ対応が属人化している等"
            />
            {errors.workflowDescription && (
              <p className="text-red-500 text-sm mt-1">{errors.workflowDescription.message}</p>
            )}
          </div>
        </section>

        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-gray-900 border-b pb-2">
            導入検討条件
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                予算感
              </label>
              <select
                {...register('budget')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">選択してください</option>
                {BUDGETS.map(budget => (
                  <option key={budget} value={budget}>{budget}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                導入希望時期
              </label>
              <select
                {...register('timeline')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">選択してください</option>
                {TIMELINES.map(timeline => (
                  <option key={timeline} value={timeline}>{timeline}</option>
                ))}
              </select>
            </div>
          </div>
        </section>

        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-gray-900 border-b pb-2">
            ご担当者様情報
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                お名前 *
              </label>
              <input
                {...register('contactName', { required: 'お名前は必須です' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="山田太郎"
              />
              {errors.contactName && (
                <p className="text-red-500 text-sm mt-1">{errors.contactName.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                役職
              </label>
              <input
                {...register('contactPosition')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="営業部長"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                メールアドレス *
              </label>
              <input
                type="email"
                {...register('contactEmail', { 
                  required: 'メールアドレスは必須です',
                  pattern: {
                    value: /\S+@\S+\.\S+/,
                    message: '有効なメールアドレスを入力してください'
                  }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="example@company.com"
              />
              {errors.contactEmail && (
                <p className="text-red-500 text-sm mt-1">{errors.contactEmail.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                電話番号
              </label>
              <input
                {...register('contactPhone')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="03-1234-5678"
              />
            </div>
          </div>
        </section>

        <div className="flex justify-center pt-6">
          <button
            type="submit"
            disabled={selectedChallenges.length === 0}
            className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            AI分析を実行する
          </button>
        </div>
      </form>
    </div>
  )
}