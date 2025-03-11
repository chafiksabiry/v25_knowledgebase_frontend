import { Contact, AIInsight, KnowledgeItem, CallRecord, LearningMetric, LearningInsight, TrainingActivity, User, Company } from '../types';
import { format, subDays } from 'date-fns';

// Generate random dates within the last 30 days
const getRandomRecentDate = () => {
  const daysAgo = Math.floor(Math.random() * 30);
  return format(subDays(new Date(), daysAgo), 'yyyy-MM-dd');
};

// Mock companies
export const mockCompanies: Company[] = [
  {
    id: 'comp-1',
    name: 'Acme Corporation',
    plan: 'enterprise',
    industry: 'Technology',
    contactCount: 156,
    userCount: 12,
    createdAt: format(subDays(new Date(), 365), 'yyyy-MM-dd'),
    logo: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=64&h=64&fit=crop&auto=format',
    settings: {
      aiFeatures: true,
      knowledgeBase: true,
      callRecording: true,
      analytics: true
    }
  },
  {
    id: 'comp-2',
    name: 'GlobalTech Solutions',
    plan: 'professional',
    industry: 'Software',
    contactCount: 87,
    userCount: 8,
    createdAt: format(subDays(new Date(), 180), 'yyyy-MM-dd'),
    logo: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=64&h=64&fit=crop&auto=format',
    settings: {
      aiFeatures: true,
      knowledgeBase: true,
      callRecording: true,
      analytics: false
    }
  },
  {
    id: 'comp-3',
    name: 'HealthPlus Medical',
    plan: 'basic',
    industry: 'Healthcare',
    contactCount: 42,
    userCount: 5,
    createdAt: format(subDays(new Date(), 90), 'yyyy-MM-dd'),
    settings: {
      aiFeatures: false,
      knowledgeBase: true,
      callRecording: false,
      analytics: false
    }
  }
];

// Mock users
export const mockUsers: User[] = [
  {
    id: 'user-1',
    name: 'Alex Morgan',
    email: 'alex@acmecorp.com',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&auto=format',
    companyId: 'comp-1',
    department: 'Sales',
    lastActive: format(new Date(), 'yyyy-MM-dd')
  },
  {
    id: 'user-2',
    name: 'Sarah Johnson',
    email: 'sarah@acmecorp.com',
    role: 'manager',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=32&h=32&fit=crop&auto=format',
    companyId: 'comp-1',
    department: 'Sales',
    lastActive: format(subDays(new Date(), 1), 'yyyy-MM-dd')
  },
  {
    id: 'user-3',
    name: 'Michael Chen',
    email: 'michael@acmecorp.com',
    role: 'rep',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=32&h=32&fit=crop&auto=format',
    companyId: 'comp-1',
    department: 'Sales',
    lastActive: format(subDays(new Date(), 2), 'yyyy-MM-dd')
  },
  {
    id: 'user-4',
    name: 'Emily Rodriguez',
    email: 'emily@globaltech.com',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=32&h=32&fit=crop&auto=format',
    companyId: 'comp-2',
    department: 'Marketing',
    lastActive: format(new Date(), 'yyyy-MM-dd')
  },
  {
    id: 'user-5',
    name: 'David Kim',
    email: 'david@healthplus.com',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&auto=format',
    companyId: 'comp-3',
    department: 'Operations',
    lastActive: format(new Date(), 'yyyy-MM-dd')
  }
];

export const mockContacts: Contact[] = [
  {
    id: '1',
    name: 'John Smith',
    email: 'john.smith@example.com',
    phone: '(555) 123-4567',
    company: 'Acme Inc.',
    position: 'CTO',
    lastContact: getRandomRecentDate(),
    status: 'active',
    notes: 'Interested in our enterprise solution. Follow up next week.',
    tags: ['tech', 'enterprise', 'high-priority'],
    assignedTo: 'user-3',
    companyId: 'comp-1'
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    email: 'sarah.j@techcorp.com',
    phone: '(555) 987-6543',
    company: 'TechCorp',
    position: 'Marketing Director',
    lastContact: getRandomRecentDate(),
    status: 'customer',
    notes: 'Current customer, looking to upgrade their plan.',
    tags: ['marketing', 'existing-customer'],
    assignedTo: 'user-2',
    companyId: 'comp-1'
  },
  {
    id: '3',
    name: 'Michael Chen',
    email: 'mchen@startupinc.io',
    phone: '(555) 234-5678',
    company: 'Startup Inc.',
    position: 'Founder',
    lastContact: getRandomRecentDate(),
    status: 'lead',
    notes: 'Met at TechConf 2025. Interested in our API integration.',
    tags: ['startup', 'api', 'new-lead'],
    assignedTo: 'user-3',
    companyId: 'comp-1'
  },
  {
    id: '4',
    name: 'Emily Rodriguez',
    email: 'emily.r@bigcorp.com',
    phone: '(555) 345-6789',
    company: 'BigCorp',
    position: 'IT Manager',
    lastContact: getRandomRecentDate(),
    status: 'inactive',
    notes: 'No response to last three emails. Consider different approach.',
    tags: ['enterprise', 'follow-up-needed'],
    assignedTo: 'user-2',
    companyId: 'comp-1'
  },
  {
    id: '5',
    name: 'David Kim',
    email: 'dkim@innovate.co',
    phone: '(555) 456-7890',
    company: 'Innovate Co.',
    position: 'Product Manager',
    lastContact: getRandomRecentDate(),
    status: 'active',
    notes: 'Scheduled demo for next Tuesday. Prepare custom presentation.',
    tags: ['product', 'demo-scheduled'],
    assignedTo: 'user-3',
    companyId: 'comp-2'
  },
  {
    id: '6',
    name: 'Lisa Wang',
    email: 'lwang@globaltech.com',
    phone: '(555) 567-8901',
    company: 'Global Tech',
    position: 'COO',
    lastContact: getRandomRecentDate(),
    status: 'customer',
    notes: 'Long-term customer. Annual review coming up next month.',
    tags: ['executive', 'existing-customer', 'review'],
    assignedTo: 'user-4',
    companyId: 'comp-2'
  },
  {
    id: '7',
    name: 'Robert Taylor',
    email: 'rtaylor@newventure.net',
    phone: '(555) 678-9012',
    company: 'New Venture',
    position: 'Sales Director',
    lastContact: getRandomRecentDate(),
    status: 'lead',
    notes: 'Referred by Lisa Wang. Interested in our sales analytics tools.',
    tags: ['sales', 'referral', 'analytics'],
    assignedTo: 'user-4',
    companyId: 'comp-2'
  },
  {
    id: '8',
    name: 'Jennifer Adams',
    email: 'jadams@mediagroup.org',
    phone: '(555) 789-0123',
    company: 'Media Group',
    position: 'Creative Director',
    lastContact: getRandomRecentDate(),
    status: 'active',
    notes: 'Working on proposal for their Q3 campaign.',
    tags: ['media', 'creative', 'proposal'],
    assignedTo: 'user-5',
    companyId: 'comp-3'
  }
];

export const mockInsights: AIInsight[] = [
  {
    id: '1',
    contactId: '1',
    type: 'follow-up',
    content: 'John Smith hasn\'t been contacted in 7 days. Consider scheduling a follow-up call to discuss enterprise solution.',
    createdAt: format(new Date(), 'yyyy-MM-dd'),
    companyId: 'comp-1'
  },
  {
    id: '2',
    contactId: '2',
    type: 'opportunity',
    content: 'Sarah Johnson\'s company is expanding their marketing department. This may be a good time to discuss our premium plan.',
    createdAt: format(new Date(), 'yyyy-MM-dd'),
    companyId: 'comp-1'
  },
  {
    id: '3',
    contactId: '4',
    type: 'risk',
    content: 'Emily Rodriguez has not responded to the last three emails. Consider a different communication approach or escalation.',
    createdAt: format(new Date(), 'yyyy-MM-dd'),
    companyId: 'comp-1'
  },
  {
    id: '4',
    contactId: '5',
    type: 'suggestion',
    content: 'Based on David Kim\'s interests, consider showcasing our new analytics dashboard during the scheduled demo.',
    createdAt: format(new Date(), 'yyyy-MM-dd'),
    companyId: 'comp-2'
  },
  {
    id: '5',
    contactId: '7',
    type: 'opportunity',
    content: 'Robert Taylor was referred by an existing customer. Leverage this connection in your next interaction.',
    createdAt: format(new Date(), 'yyyy-MM-dd'),
    companyId: 'comp-2'
  }
];

export const mockKnowledgeBase: KnowledgeItem[] = [
  {
    id: '1',
    name: 'Product Overview Guide',
    description: 'Comprehensive overview of our product suite with feature descriptions and use cases.',
    type: 'document',
    fileUrl: '/documents/product-overview.pdf',
    uploadedAt: format(subDays(new Date(), 45), 'yyyy-MM-dd'),
    uploadedBy: 'Alex Morgan',
    tags: ['product', 'overview', 'features'],
    usagePercentage: 87,
    companyId: 'comp-1',
    isPublic: true
  },
  {
    id: '2',
    name: 'API Documentation',
    description: 'Technical documentation for our API endpoints, authentication, and example requests.',
    type: 'document',
    fileUrl: '/documents/api-docs.pdf',
    uploadedAt: format(subDays(new Date(), 30), 'yyyy-MM-dd'),
    uploadedBy: 'Alex Morgan',
    tags: ['api', 'technical', 'integration'],
    usagePercentage: 65,
    companyId: 'comp-1',
    isPublic: true
  },
  {
    id: '3',
    name: 'Product Demo Video',
    description: 'Walkthrough of key product features and benefits for new customers.',
    type: 'video',
    fileUrl: '/videos/product-demo.mp4',
    uploadedAt: format(subDays(new Date(), 20), 'yyyy-MM-dd'),
    uploadedBy: 'Sarah Johnson',
    tags: ['demo', 'video', 'features'],
    usagePercentage: 92,
    companyId: 'comp-1',
    isPublic: true
  },
  {
    id: '4',
    name: 'Quick Start Guide',
    description: 'Step-by-step guide to get started with our platform in under 10 minutes.',
    type: 'document',
    fileUrl: '/documents/quick-start.pdf',
    uploadedAt: format(subDays(new Date(), 15), 'yyyy-MM-dd'),
    uploadedBy: 'Alex Morgan',
    tags: ['onboarding', 'guide', 'beginner'],
    usagePercentage: 78,
    companyId: 'comp-1',
    isPublic: true
  },
  {
    id: '5',
    name: 'Pricing Comparison Sheet',
    description: 'Detailed comparison of our pricing tiers with competitor analysis.',
    type: 'document',
    fileUrl: '/documents/pricing-comparison.xlsx',
    uploadedAt: format(subDays(new Date(), 10), 'yyyy-MM-dd'),
    uploadedBy: 'Robert Taylor',
    tags: ['pricing', 'sales', 'comparison'],
    usagePercentage: 54,
    companyId: 'comp-2',
    isPublic: false
  },
  {
    id: '6',
    name: 'Customer Success Stories',
    description: 'Collection of case studies and testimonials from our top customers.',
    type: 'link',
    fileUrl: 'https://example.com/success-stories',
    uploadedAt: format(subDays(new Date(), 7), 'yyyy-MM-dd'),
    uploadedBy: 'Emily Rodriguez',
    tags: ['case-study', 'testimonial', 'success'],
    usagePercentage: 42,
    companyId: 'comp-2',
    isPublic: true
  },
  {
    id: '7',
    name: 'Advanced Integration Tutorial',
    description: 'Technical tutorial for advanced API integration scenarios and custom workflows.',
    type: 'video',
    fileUrl: '/videos/advanced-integration.mp4',
    uploadedAt: format(subDays(new Date(), 5), 'yyyy-MM-dd'),
    uploadedBy: 'David Kim',
    tags: ['advanced', 'integration', 'tutorial'],
    usagePercentage: 31,
    companyId: 'comp-3',
    isPublic: false
  },
  {
    id: '8',
    name: 'Product Roadmap',
    description: 'Overview of upcoming features and product development timeline.',
    type: 'document',
    fileUrl: '/documents/roadmap-2025.pdf',
    uploadedAt: format(subDays(new Date(), 2), 'yyyy-MM-dd'),
    uploadedBy: 'Lisa Wang',
    tags: ['roadmap', 'future', 'development'],
    usagePercentage: 67,
    companyId: 'comp-1',
    isPublic: false
  }
];

export const mockCallRecords: CallRecord[] = [
  {
    id: '1',
    contactId: '1',
    date: format(subDays(new Date(), 7), 'yyyy-MM-dd'),
    duration: 15, // minutes
    recordingUrl: '/recordings/call-john-smith-20250315.mp3',
    transcriptUrl: '/transcripts/call-john-smith-20250315.txt',
    summary: 'Discussed enterprise solution requirements. John expressed interest in the API integration capabilities and asked about custom reporting features.',
    sentiment: 'positive',
    tags: ['enterprise', 'api', 'reporting'],
    aiInsights: [
      'Customer showed interest in API documentation - consider sharing the Advanced Integration Tutorial',
      'Follow up with pricing details for enterprise tier',
      'Schedule technical demo with product team'
    ],
    repId: 'user-3',
    companyId: 'comp-1'
  },
  {
    id: '2',
    contactId: '2',
    date: format(subDays(new Date(), 5), 'yyyy-MM-dd'),
    duration: 22, // minutes
    recordingUrl: '/recordings/call-sarah-johnson-20250317.mp3',
    transcriptUrl: '/transcripts/call-sarah-johnson-20250317.txt',
    summary: 'Sarah discussed upgrading their current plan to accommodate their expanding marketing team. She requested information about additional user seats and advanced analytics features.',
    sentiment: 'positive',
    tags: ['upgrade', 'analytics', 'expansion'],
    aiInsights: [
      'Customer mentioned team growth - highlight team collaboration features',
      'Share analytics documentation and case studies',
      'Potential upsell opportunity for premium tier'
    ],
    repId: 'user-2',
    companyId: 'comp-1'
  },
  {
    id: '3',
    contactId: '5',
    date: format(subDays(new Date(), 3), 'yyyy-MM-dd'),
    duration: 18, // minutes
    recordingUrl: '/recordings/call-david-kim-20250319.mp3',
    transcriptUrl: '/transcripts/call-david-kim-20250319.txt',
    summary: 'Preliminary discussion about upcoming product demo. David shared specific use cases they want to see addressed during the presentation.',
    sentiment: 'neutral',
    tags: ['demo', 'preparation', 'use-cases'],
    aiInsights: [
      'Customer emphasized mobile capabilities - include mobile demo in presentation',
      'Prepare responses to integration questions with legacy systems',
      'Research their industry to provide relevant examples'
    ],
    repId: 'user-3',
    companyId: 'comp-2'
  },
  {
    id: '4',
    contactId: '7',
    date: format(subDays(new Date(), 1), 'yyyy-MM-dd'),
    duration: 25, // minutes
    recordingUrl: '/recordings/call-robert-taylor-20250321.mp3',
    transcriptUrl: '/transcripts/call-robert-taylor-20250321.txt',
    summary: 'Initial discovery call with Robert about sales analytics tools. He described their current process and pain points with tracking sales performance.',
    sentiment: 'positive',
    tags: ['discovery', 'sales-analytics', 'pain-points'],
    aiInsights: [
      'Customer mentioned Excel-based reporting - highlight automated reporting features',
      'Address data security concerns mentioned at 12:45 in the call',
      'Send comparison sheet showing time savings vs. current process'
    ],
    repId: 'user-4',
    companyId: 'comp-2'
  }
];

export const mockLearningMetrics: LearningMetric[] = [
  {
    id: '1',
    name: 'Knowledge Coverage',
    value: 78,
    change: 5.2,
    trend: 'up',
    period: '30days',
    companyId: 'comp-1'
  },
  {
    id: '2',
    name: 'Response Accuracy',
    value: 92,
    change: 3.7,
    trend: 'up',
    period: '30days',
    companyId: 'comp-1'
  },
  {
    id: '3',
    name: 'Knowledge Gaps Identified',
    value: 12,
    change: -2,
    trend: 'down',
    period: '30days',
    companyId: 'comp-1'
  },
  {
    id: '4',
    name: 'Customer Satisfaction',
    value: 87,
    change: 4.3,
    trend: 'up',
    period: '30days',
    companyId: 'comp-1'
  },
  {
    id: '5',
    name: 'First Call Resolution',
    value: 72,
    change: 6.8,
    trend: 'up',
    period: '30days',
    companyId: 'comp-1'
  }
];

export const mockLearningInsights: LearningInsight[] = [
  {
    id: '1',
    title: 'API Authentication Knowledge Gap',
    description: 'Multiple customer interactions reveal confusion about OAuth implementation. Consider enhancing API documentation.',
    impact: 'high',
    status: 'open',
    createdAt: format(subDays(new Date(), 3), 'yyyy-MM-dd'),
    relatedDocuments: ['2', '7'],
    companyId: 'comp-1'
  },
  {
    id: '2',
    title: 'Pricing Explanation Improvement',
    description: 'AI has learned to better explain enterprise pricing tiers, resulting in 27% higher conversion rate.',
    impact: 'medium',
    status: 'implemented',
    createdAt: format(subDays(new Date(), 7), 'yyyy-MM-dd'),
    relatedDocuments: ['5'],
    companyId: 'comp-1'
  },
  {
    id: '3',
    title: 'Mobile SDK Documentation Need',
    description: 'Customers frequently asking about mobile capabilities not covered in current documentation.',
    impact: 'medium',
    status: 'in-progress',
    createdAt: format(subDays(new Date(), 5), 'yyyy-MM-dd'),
    relatedDocuments: ['1', '4'],
    companyId: 'comp-1'
  },
  {
    id: '4',
    title: 'Technical Term Clarification',
    description: 'AI has identified 12 technical terms that cause confusion during customer interactions.',
    impact: 'low',
    status: 'open',
    createdAt: format(subDays(new Date(), 2), 'yyyy-MM-dd'),
    relatedDocuments: ['2'],
    companyId: 'comp-2'
  },
  {
    id: '5',
    title: 'Integration Use Case Patterns',
    description: 'AI has identified common integration patterns that could be documented as templates.',
    impact: 'high',
    status: 'in-progress',
    createdAt: format(subDays(new Date(), 4), 'yyyy-MM-dd'),
    relatedDocuments: ['2', '7'],
    companyId: 'comp-2'
  }
];

export const mockTrainingActivities: TrainingActivity[] = [
  {
    id: '1',
    title: 'API Documentation Enhancement',
    description: 'Training the AI on improved API documentation with more examples and use cases.',
    status: 'completed',
    completedAt: format(subDays(new Date(), 2), 'yyyy-MM-dd'),
    improvement: '18% accuracy increase in API-related queries',
    companyId: 'comp-1'
  },
  {
    id: '2',
    title: 'Customer Objection Handling',
    description: 'Training the AI to better handle common customer objections about pricing and features.',
    status: 'in-progress',
    startedAt: format(subDays(new Date(), 1), 'yyyy-MM-dd'),
    progress: '68%',
    companyId: 'comp-1'
  },
  {
    id: '3',
    title: 'Technical Support Escalation',
    description: 'Teaching the AI to recognize when to escalate technical issues to the support team.',
    status: 'scheduled',
    scheduledFor: format(subDays(new Date(), -3), 'yyyy-MM-dd'),
    companyId: 'comp-1'
  },
  {
    id: '4',
    title: 'Industry-Specific Knowledge',
    description: 'Enhancing AI understanding of healthcare industry terminology and compliance requirements.',
    status: 'completed',
    completedAt: format(subDays(new Date(), 10), 'yyyy-MM-dd'),
    improvement: '32% better handling of healthcare client interactions',
    companyId: 'comp-3'
  },
  {
    id: '5',
    title: 'Sentiment Analysis Refinement',
    description: 'Improving AI ability to detect subtle emotional cues in customer communications.',
    status: 'in-progress',
    startedAt: format(subDays(new Date(), 4), 'yyyy-MM-dd'),
    progress: '45%',
    companyId: 'comp-2'
  }
];