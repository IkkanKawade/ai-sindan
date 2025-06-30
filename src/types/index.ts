export interface SurveyData {
  companyName: string
  industry: string
  employeeCount: string
  department: string
  currentChallenges: string[]
  workflowDescription: string
  budget: string
  timeline: string
  contactInfo: {
    name: string
    email: string
    phone: string
    position: string
  }
}

export interface AIRecommendation {
  category: string
  solution: string
  description: string
  expectedBenefits: string[]
  timeSavingEstimate: number
  implementationComplexity: 'low' | 'medium' | 'high'
  suggestedTools: string[]
}

export interface Proposal {
  id: string
  companyName: string
  summary: string
  recommendations: AIRecommendation[]
  developmentScope: string[]
  implementationSteps: string[]
  serviceOptions: ServiceOption[]
  createdAt: Date
}

export interface ServiceOption {
  type: 'training' | 'development' | 'poc'
  name: string
  description: string
  duration: string
  price: string
}