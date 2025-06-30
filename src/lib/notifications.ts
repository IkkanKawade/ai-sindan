import nodemailer from 'nodemailer'
import { SurveyData, Proposal } from '@/types'

const transporter = nodemailer.createTransporter({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

export async function sendSlackNotification(surveyData: SurveyData, proposal: Proposal) {
  if (!process.env.SLACK_WEBHOOK_URL) return

  const message = {
    text: "🎯 新しいAI活用ニーズ調査が完了しました！",
    attachments: [
      {
        color: "good",
        fields: [
          {
            title: "会社名",
            value: surveyData.companyName,
            short: true
          },
          {
            title: "業種",
            value: surveyData.industry,
            short: true
          },
          {
            title: "従業員数",
            value: surveyData.employeeCount,
            short: true
          },
          {
            title: "予算",
            value: surveyData.budget || "未設定",
            short: true
          },
          {
            title: "担当者",
            value: `${surveyData.contactInfo.name} (${surveyData.contactInfo.position})`,
            short: false
          },
          {
            title: "メールアドレス",
            value: surveyData.contactInfo.email,
            short: false
          },
          {
            title: "課題",
            value: surveyData.currentChallenges.join(', '),
            short: false
          },
          {
            title: "提案ID",
            value: proposal.id,
            short: false
          }
        ],
        footer: "AI活用ニーズ調査システム",
        ts: Math.floor(Date.now() / 1000)
      }
    ]
  }

  try {
    await fetch(process.env.SLACK_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(message)
    })
  } catch (error) {
    console.error('Slack notification failed:', error)
  }
}

export async function sendEmailNotification(surveyData: SurveyData, proposal: Proposal) {
  if (!process.env.SMTP_HOST) return

  const emailHtml = `
    <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center;">
        <h1 style="margin: 0; font-size: 24px;">🎯 新しいAI活用ニーズ調査</h1>
        <p style="margin: 10px 0 0 0; opacity: 0.9;">提案が自動生成されました</p>
      </div>
      
      <div style="padding: 30px; background: #f8f9fa;">
        <h2 style="color: #333; margin-top: 0;">企業情報</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px 0; font-weight: bold; color: #555;">会社名:</td>
            <td style="padding: 8px 0; color: #333;">${surveyData.companyName}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: bold; color: #555;">業種:</td>
            <td style="padding: 8px 0; color: #333;">${surveyData.industry}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: bold; color: #555;">従業員数:</td>
            <td style="padding: 8px 0; color: #333;">${surveyData.employeeCount}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: bold; color: #555;">予算:</td>
            <td style="padding: 8px 0; color: #333;">${surveyData.budget || '未設定'}</td>
          </tr>
        </table>
      </div>
      
      <div style="padding: 30px; background: white;">
        <h2 style="color: #333; margin-top: 0;">担当者情報</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px 0; font-weight: bold; color: #555;">お名前:</td>
            <td style="padding: 8px 0; color: #333;">${surveyData.contactInfo.name}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: bold; color: #555;">役職:</td>
            <td style="padding: 8px 0; color: #333;">${surveyData.contactInfo.position || '未設定'}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: bold; color: #555;">メール:</td>
            <td style="padding: 8px 0; color: #333;">${surveyData.contactInfo.email}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: bold; color: #555;">電話:</td>
            <td style="padding: 8px 0; color: #333;">${surveyData.contactInfo.phone || '未設定'}</td>
          </tr>
        </table>
      </div>
      
      <div style="padding: 30px; background: #f8f9fa;">
        <h2 style="color: #333; margin-top: 0;">課題・ニーズ</h2>
        <div style="margin-bottom: 15px;">
          <strong style="color: #555;">選択された課題:</strong>
          <div style="margin-top: 5px;">
            ${surveyData.currentChallenges.map(challenge => 
              `<span style="display: inline-block; background: #e3f2fd; color: #1565c0; padding: 4px 8px; margin: 2px; border-radius: 4px; font-size: 12px;">${challenge}</span>`
            ).join('')}
          </div>
        </div>
        <div>
          <strong style="color: #555;">業務フロー詳細:</strong>
          <div style="background: white; padding: 15px; margin-top: 5px; border-radius: 4px; border-left: 4px solid #2196f3;">
            ${surveyData.workflowDescription}
          </div>
        </div>
      </div>
      
      <div style="padding: 30px; background: white;">
        <h2 style="color: #333; margin-top: 0;">AI提案サマリー</h2>
        <div style="background: #f5f5f5; padding: 15px; border-radius: 4px; margin-bottom: 15px;">
          ${proposal.summary}
        </div>
        <div style="display: flex; flex-wrap: wrap; gap: 10px;">
          ${proposal.recommendations.map(rec => 
            `<div style="flex: 1; min-width: 200px; background: #e8f5e8; padding: 15px; border-radius: 4px;">
              <strong style="color: #2e7d32;">${rec.category}</strong>
              <div style="font-size: 24px; font-weight: bold; color: #2e7d32; margin: 5px 0;">${rec.timeSavingEstimate}時間/月</div>
              <div style="font-size: 12px; color: #555;">削減予想</div>
            </div>`
          ).join('')}
        </div>
      </div>
      
      <div style="padding: 30px; background: #667eea; color: white; text-align: center;">
        <h3 style="margin: 0 0 10px 0;">次のアクション</h3>
        <p style="margin: 0; opacity: 0.9;">提案ID: ${proposal.id}</p>
        <p style="margin: 10px 0 0 0; opacity: 0.9;">3営業日以内にお客様へご連絡ください</p>
      </div>
    </div>
  `

  const mailOptions = {
    from: process.env.SMTP_FROM,
    to: process.env.SALES_EMAIL,
    subject: `[AI活用ニーズ調査] ${surveyData.companyName}様からの新しい調査完了`,
    html: emailHtml,
  }

  try {
    await transporter.sendMail(mailOptions)
  } catch (error) {
    console.error('Email notification failed:', error)
  }
}

export async function sendCustomerThankYouEmail(surveyData: SurveyData, proposal: Proposal) {
  if (!process.env.SMTP_HOST) return

  const customerEmailHtml = `
    <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center;">
        <h1 style="margin: 0; font-size: 24px;">AI活用提案書をお送りいたします</h1>
        <p style="margin: 10px 0 0 0; opacity: 0.9;">${surveyData.companyName} 様</p>
      </div>
      
      <div style="padding: 30px; background: white;">
        <p style="color: #333; line-height: 1.6;">
          ${surveyData.contactInfo.name} 様
        </p>
        <p style="color: #333; line-height: 1.6;">
          この度は、AI活用ニーズ調査にご協力いただき、誠にありがとうございました。
        </p>
        <p style="color: #333; line-height: 1.6;">
          お聞かせいただいた課題を基に、AIによる自動分析を行い、貴社に最適な業務効率化提案を作成させていただきました。
        </p>
        
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #333; margin: 0 0 15px 0;">提案サマリー</h3>
          <p style="color: #555; line-height: 1.6; margin: 0;">
            ${proposal.summary}
          </p>
        </div>
        
        <div style="display: flex; flex-wrap: wrap; gap: 15px; margin: 20px 0;">
          ${proposal.recommendations.map(rec => 
            `<div style="flex: 1; min-width: 200px; background: #e3f2fd; padding: 15px; border-radius: 6px; text-align: center;">
              <div style="font-weight: bold; color: #1565c0; margin-bottom: 5px;">${rec.category}</div>
              <div style="font-size: 28px; font-weight: bold; color: #1565c0;">${rec.timeSavingEstimate}</div>
              <div style="font-size: 12px; color: #555;">時間/月の削減予想</div>
            </div>`
          ).join('')}
        </div>
        
        <p style="color: #333; line-height: 1.6;">
          詳細な提案書は、オンラインでご確認いただけます。また、PDF版のダウンロードも可能です。
        </p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${process.env.BASE_URL}/proposal/${proposal.id}" 
             style="display: inline-block; background: #667eea; color: white; padding: 15px 30px; text-decoration: none; border-radius: 6px; font-weight: bold;">
            提案書を確認する
          </a>
        </div>
        
        <p style="color: #333; line-height: 1.6;">
          ご質問やご相談がございましたら、お気軽にお声がけください。3営業日以内に担当者よりご連絡させていただきます。
        </p>
        
        <div style="background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 6px; margin: 20px 0;">
          <p style="margin: 0; color: #856404; font-size: 14px;">
            <strong>次のステップ:</strong><br>
            1. オンライン提案書のご確認<br>
            2. 無料相談会での詳細ヒアリング<br>
            3. PoC実施による効果検証（ご希望の場合）<br>
            4. 本格導入プロジェクトの開始
          </p>
        </div>
      </div>
      
      <div style="padding: 20px; background: #f8f9fa; text-align: center; border-top: 1px solid #dee2e6;">
        <p style="margin: 0; color: #6c757d; font-size: 12px;">
          このメールは AI活用ニーズ調査システムより自動送信されています。<br>
          ご不明な点がございましたら、お気軽にお問い合わせください。
        </p>
      </div>
    </div>
  `

  const customerMailOptions = {
    from: process.env.SMTP_FROM,
    to: surveyData.contactInfo.email,
    subject: `【AI活用提案書】${surveyData.companyName}様専用の業務効率化提案をお送りします`,
    html: customerEmailHtml,
  }

  try {
    await transporter.sendMail(customerMailOptions)
  } catch (error) {
    console.error('Customer email notification failed:', error)
  }
}

export async function updateCRM(surveyData: SurveyData, proposal: Proposal) {
  // CRM連携のサンプル実装（Salesforce、HubSpot等）
  if (!process.env.CRM_API_URL || !process.env.CRM_API_KEY) return

  const crmData = {
    companyName: surveyData.companyName,
    industry: surveyData.industry,
    employeeCount: surveyData.employeeCount,
    contactName: surveyData.contactInfo.name,
    contactEmail: surveyData.contactInfo.email,
    contactPhone: surveyData.contactInfo.phone,
    position: surveyData.contactInfo.position,
    challenges: surveyData.currentChallenges,
    budget: surveyData.budget,
    timeline: surveyData.timeline,
    proposalId: proposal.id,
    proposalSummary: proposal.summary,
    expectedSavings: proposal.recommendations.reduce((total, rec) => total + rec.timeSavingEstimate, 0),
    status: 'lead',
    source: 'AI活用ニーズ調査',
    createdAt: new Date().toISOString()
  }

  try {
    await fetch(process.env.CRM_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.CRM_API_KEY}`,
      },
      body: JSON.stringify(crmData)
    })
  } catch (error) {
    console.error('CRM update failed:', error)
  }
}