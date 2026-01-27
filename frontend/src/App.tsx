import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import { ThemeProvider } from './contexts/ThemeContext';
import { OnboardingProvider } from './contexts/OnboardingContext';
import { TrainerProvider } from './contexts/TrainerContext';
import { RecommendationsProvider } from './contexts/RecommendationsContext';
import { LearningPathProvider } from './contexts/LearningPathContext';
import { RealTimeProvider } from './contexts/RealTimeContext';
import './App.css'

function App() {
  return (
    <ThemeProvider>
      <OnboardingProvider>
        <TrainerProvider>
          <RecommendationsProvider>
            <LearningPathProvider>
              <RealTimeProvider>
                <RouterProvider router={router} />
              </RealTimeProvider>
            </LearningPathProvider>
          </RecommendationsProvider>
        </TrainerProvider>
      </OnboardingProvider>
    </ThemeProvider>
  )
}

export default App
