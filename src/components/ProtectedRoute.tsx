import React from 'react';
import { Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { OnboardingProgress, Phase } from '../types/onboarding';

interface ProtectedRouteProps {
  element: React.ReactElement;
  requiresOnboarding?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ element }) => {
  const isInAppMode = import.meta.env.VITE_RUN_MODE === 'in-app';
  
  // If not in in-app mode, return the element without restrictions
  if (!isInAppMode) {
    return element;
  }

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

  // Vérifier si l'étape 7 est complétée
  const isStep7Completed = progress.completedSteps?.includes(7);

  // Si l'étape 7 est complétée, accès complet
  if (isStep7Completed) {
    return element;
  }

  // Sinon, rediriger vers upload (sauf si déjà sur upload)
  if (window.location.pathname === '/upload') {
    return element;
  }

  return <Navigate to="/upload" replace />;
};

export default ProtectedRoute; 