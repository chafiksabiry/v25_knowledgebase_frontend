export interface Step {
  id: number;
  status: 'pending' | 'in_progress' | 'completed';
  completedAt?: string;
  disabled?: boolean;
  _id: string;
}

export interface Phase {
  id: number;
  status: 'pending' | 'in_progress' | 'completed';
  steps: Step[];
  _id: string;
}

export interface OnboardingProgress {
  _id: string;
  companyId: string;
  currentPhase: number;
  completedSteps: number[];
  phases: Phase[];
  updatedAt: string;
  __v: number;
}
 