import { NextRequest, NextResponse } from 'next/server'
import { Document, Page, Text, View, StyleSheet, PDFViewer, pdf } from '@react-pdf/renderer'
import { Proposal } from '@/types'

// 仮のデータストア（実際はデータベースから取得）
const proposals: { [key: string]: Proposal } = {}

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    padding: 30,
    fontFamily: 'Helvetica',
  },
  header: {
    marginBottom: 20,
    paddingBottom: 10,
    borderBottomWidth: 2,
    borderBottomColor: '#2563eb',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#4b5563',
    marginBottom: 5,
  },
  date: {
    fontSize: 12,
    color: '#6b7280',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 10,
    paddingBottom: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  paragraph: {
    fontSize: 12,
    lineHeight: 1.5,
    color: '#374151',
    marginBottom: 10,
  },
  recommendationCard: {
    marginBottom: 15,
    padding: 15,
    backgroundColor: '#f9fafb',
    borderRadius: 5,
  },
  recommendationTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 5,
  },
  recommendationCategory: {
    fontSize: 10,
    color: '#2563eb',
    backgroundColor: '#dbeafe',
    padding: '2 8',
    borderRadius: 3,
    marginBottom: 8,
  },
  benefitsList: {
    marginLeft: 10,
  },
  benefitItem: {
    fontSize: 10,
    color: '#374151',
    marginBottom: 3,
  },
  stepItem: {
    fontSize: 12,
    color: '#374151',
    marginBottom: 8,
    paddingLeft: 15,
  },
  serviceCard: {
    marginBottom: 15,
    padding: 12,
    backgroundColor: '#f3f4f6',
    borderRadius: 5,
  },
  serviceTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 5,
  },
  serviceDescription: {
    fontSize: 10,
    color: '#6b7280',
    marginBottom: 8,
  },
  serviceDetails: {
    fontSize: 10,
    color: '#374151',
  },
})

const ProposalPDF = ({ proposal }: { proposal: Proposal }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.title}>AI活用提案書</Text>
        <Text style={styles.subtitle}>{proposal.companyName} 様</Text>
        <Text style={styles.date}>
          作成日: {new Date(proposal.createdAt).toLocaleDateString('ja-JP')}
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>課題サマリー</Text>
        <Text style={styles.paragraph}>{proposal.summary}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>AI活用提案</Text>
        {proposal.recommendations.map((rec, index) => (
          <View key={index} style={styles.recommendationCard}>
            <Text style={styles.recommendationTitle}>{rec.solution}</Text>
            <Text style={styles.recommendationCategory}>{rec.category}</Text>
            <Text style={styles.paragraph}>{rec.description}</Text>
            
            <Text style={[styles.paragraph, { fontWeight: 'bold' }]}>
              期待される効果: {rec.timeSavingEstimate}時間/月の削減
            </Text>
            
            <View style={styles.benefitsList}>
              {rec.expectedBenefits.map((benefit, i) => (
                <Text key={i} style={styles.benefitItem}>• {benefit}</Text>
              ))}
            </View>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>導入ステップ</Text>
        {proposal.implementationSteps.map((step, index) => (
          <Text key={index} style={styles.stepItem}>
            {index + 1}. {step}
          </Text>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>サービスメニュー</Text>
        {proposal.serviceOptions.map((service, index) => (
          <View key={index} style={styles.serviceCard}>
            <Text style={styles.serviceTitle}>{service.name}</Text>
            <Text style={styles.serviceDescription}>{service.description}</Text>
            <Text style={styles.serviceDetails}>
              期間: {service.duration} / 料金: {service.price}
            </Text>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>お問い合わせ</Text>
        <Text style={styles.paragraph}>
          本提案についてご質問やご相談がございましたら、お気軽にお問い合わせください。
        </Text>
        <Text style={styles.paragraph}>
          3営業日以内に担当者よりご連絡させていただきます。
        </Text>
      </View>
    </Page>
  </Document>
)

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

    const pdfBuffer = await pdf(<ProposalPDF proposal={proposal} />).toBuffer()

    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="AI活用提案書_${proposal.companyName}.pdf"`,
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

// 提案データを保存する関数（実際の実装では不要）
export function saveProposal(proposal: Proposal) {
  proposals[proposal.id] = proposal
}