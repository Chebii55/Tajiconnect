import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import { ThemeProvider } from './contexts/ThemeContext';
import { OnboardingProvider } from './contexts/OnboardingContext';
import { TrainerProvider } from './contexts/TrainerContext';
import { RecommendationsProvider } from './contexts/RecommendationsContext';
import { LearningPathProvider } from './contexts/LearningPathContext';
import { RealTimeProvider } from './contexts/RealTimeContext';
import PerformanceMonitor from './components/dev/PerformanceMonitor';
import './App.css'

function App() {
  console.log('App component rendering...');
  
  return (
    <div>
      <h1>TajiConnect Loading...</h1>
      <ThemeProvider>
        <OnboardingProvider>
          <TrainerProvider>
            <RecommendationsProvider>
              <LearningPathProvider>
                <RealTimeProvider>
                  <RouterProvider router={router} />
                  <PerformanceMonitor />
                </RealTimeProvider>
              </LearningPathProvider>
            </RecommendationsProvider>
          </TrainerProvider>
        </OnboardingProvider>
      </ThemeProvider>
    </div>
  )
}

export default App
