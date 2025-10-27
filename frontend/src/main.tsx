import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import './index.css'
import { router } from './router'
import { ThemeProvider } from './contexts/ThemeContext'
import { OnboardingProvider } from './contexts/OnboardingContext'
import { TrainerProvider } from './contexts/TrainerContext'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <OnboardingProvider>
        <TrainerProvider>
          <RouterProvider router={router} />
        </TrainerProvider>
      </OnboardingProvider>
    </ThemeProvider>
  </StrictMode>,
)
