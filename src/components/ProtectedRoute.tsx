import React from 'react';
import { Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { OnboardingProgress, Phase } from '../types/onboarding';

interface ProtectedRouteProps {
  element: React.ReactElement;
  requiresOnboarding?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ element, requiresOnboarding = true }) => {
  const progressData = Cookies.get('companyOnboardingProgress');
  let progress: OnboardingProgress | null = null;

  try {
    if (progressData) {
      progress = JSON.parse(progressData) as OnboardingProgress;
    }
  } catch (error) {
    console.error('Error parsing onboarding progress:', error);
  }

  // If no progress data is found, redirect to upload page
  if (!progress) {
    return <Navigate to="/upload" replace />;
  }

  // Find phase 1 and check if step 3 is completed
  const phase1 = progress.phases.find(phase => phase.id === 1);
  const step3 = phase1?.steps.find(step => step.id === 3);
  const isPhase1Step3Completed = step3?.status === 'completed';

  // Allow access to upload page if in phase 2 and step 3 is not completed
  if (progress.currentPhase === 2 && 
      !isPhase1Step3Completed && 
      window.location.pathname !== '/upload') {
    return <Navigate to="/upload" replace />;
  }

  // Allow access to other sections if phase > 2 and step 3 of phase 1 is completed
  if (progress.currentPhase > 2 && isPhase1Step3Completed) {
    return element;
  }

  // Default: only allow access to upload page
  if (window.location.pathname === '/upload') {
    return element;
  }

  return <Navigate to="/upload" replace />;
};

export default ProtectedRoute; 