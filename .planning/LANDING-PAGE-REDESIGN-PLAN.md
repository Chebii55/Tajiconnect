# TajiConnect Landing Page Redesign & Testing Plan

## Executive Summary

**Current State:** The landing page is just a basic login form with no value proposition, features, or social proof. The `Landing.tsx` component (271 lines) exists but is NOT routed - users go directly to `/login`.

**Goal:** Create a world-class, conversion-optimized landing page targeting African youth, with comprehensive unit test coverage across all 154 components.

---

## Part 1: Landing Page Redesign

### 1.1 Current Problems

| Issue | Impact |
|-------|--------|
| No landing page routed | Users miss value proposition |
| No hero section | No first impression |
| No social proof | No trust building |
| No feature showcase | No differentiation |
| No animations | Feels static/dated |
| Not using theme system | Inconsistent colors |
| No mobile optimization | Poor mobile conversion |

### 1.2 Design Vision

**Theme:** "Your Career Journey Starts Here"
**Style:** Modern glassmorphism + animated gradients + African-inspired warmth
**Colors:** Forest green (#1E4F2A) + Gold (#FDC500) + Warm neutrals

### 1.3 Page Sections (Top to Bottom)

#### Section 1: Animated Hero
```
┌─────────────────────────────────────────────────────────────────┐
│  [Navbar: Logo | Features | Courses | About | [Login] [Sign Up]]│
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│     ╭──────────────────╮        ┌─────────────────────────┐    │
│     │  Animated        │        │  Build Skills That      │    │
│     │  African Youth   │        │  Get You Hired          │    │
│     │  Illustration    │        │                         │    │
│     │  (Lottie/3D)     │        │  Free career courses    │    │
│     ╰──────────────────╯        │  for African youth.     │    │
│                                 │                         │    │
│                                 │  [Start Learning Free]  │    │
│                                 │  [Explore Courses]      │    │
│                                 └─────────────────────────┘    │
│                                                                 │
│  ────────────── Trusted By 10,000+ Learners ──────────────     │
│  [Safaricom] [MTN] [Jumia] [Andela] [Flutterwave] [Local Gov]  │
└─────────────────────────────────────────────────────────────────┘
```

**Features:**
- Animated gradient background (green → gold shimmer)
- Lottie animation of African youth achieving goals
- Typewriter effect on headline
- Floating 3D elements (diploma, briefcase, code brackets)
- Real-time counter: "234 joined this week"

#### Section 2: Social Proof Bar
```
┌─────────────────────────────────────────────────────────────────┐
│  ★★★★★ 4.9/5 from 2,000+ reviews                               │
│                                                                 │
│  "TajiConnect helped me land    "From zero coding to      │
│   my first tech job in 3        software engineer in      │
│   months!" - Amara, Kenya       6 months" - Kwame, Ghana  │
└─────────────────────────────────────────────────────────────────┘
```

#### Section 3: Features Grid (Animated Cards)
```
┌─────────────────────────────────────────────────────────────────┐
│                  Why Choose TajiConnect?                        │
│                                                                 │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐             │
│  │ 🎯          │  │ 🎮          │  │ 💼          │             │
│  │ Personalized│  │ Gamified    │  │ Job         │             │
│  │ Learning    │  │ Experience  │  │ Connections │             │
│  │ Paths       │  │             │  │             │             │
│  └─────────────┘  └─────────────┘  └─────────────┘             │
│                                                                 │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐             │
│  │ 📊          │  │ 🏆          │  │ 🌍          │             │
│  │ Progress    │  │ Certificates│  │ African     │             │
│  │ Analytics   │  │ & Badges    │  │ Focused     │             │
│  └─────────────┘  └─────────────┘  └─────────────┘             │
└─────────────────────────────────────────────────────────────────┘
```

**Animations:**
- Cards fade-in on scroll (staggered)
- Icons animate on hover (bounce/pulse)
- Glassmorphism effect on cards

#### Section 4: How It Works (Timeline)
```
┌─────────────────────────────────────────────────────────────────┐
│              Your Journey to Success                            │
│                                                                 │
│   ①────────────②────────────③────────────④                     │
│   Sign Up    Take Quiz    Learn Skills    Get Hired             │
│   (Free)     (2 mins)     (At your pace)  (We help!)           │
│                                                                 │
│                    [Start Your Journey]                         │
└─────────────────────────────────────────────────────────────────┘
```

#### Section 5: Stats Counter (Animated)
```
┌─────────────────────────────────────────────────────────────────┐
│  ┌────────────┐  ┌────────────┐  ┌────────────┐  ┌────────────┐│
│  │   10,000+  │  │    50+     │  │    85%     │  │    100+    ││
│  │  Learners  │  │  Courses   │  │ Job Rate   │  │ Employers  ││
│  └────────────┘  └────────────┘  └────────────┘  └────────────┘│
└─────────────────────────────────────────────────────────────────┘
```

**Animation:** Numbers count up when section scrolls into view

#### Section 6: Testimonials Carousel
```
┌─────────────────────────────────────────────────────────────────┐
│                 Success Stories                                 │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  [Photo]  "TajiConnect transformed my career..."        │   │
│  │           - Amara Okonkwo, Software Developer           │   │
│  │             Lagos, Nigeria → Google                     │   │
│  │             ★★★★★                                       │   │
│  └─────────────────────────────────────────────────────────┘   │
│                    ○ ● ○ ○                                      │
└─────────────────────────────────────────────────────────────────┘
```

#### Section 7: Course Categories Preview
```
┌─────────────────────────────────────────────────────────────────┐
│              Explore Learning Paths                             │
│                                                                 │
│  [Tech & Coding] [Business] [Creative] [Data Science]          │
│                                                                 │
│  ┌───────────┐ ┌───────────┐ ┌───────────┐                     │
│  │ Course 1  │ │ Course 2  │ │ Course 3  │                     │
│  │ Card      │ │ Card      │ │ Card      │                     │
│  └───────────┘ └───────────┘ └───────────┘                     │
│                                                                 │
│                  [View All Courses →]                           │
└─────────────────────────────────────────────────────────────────┘
```

#### Section 8: CTA Banner
```
┌─────────────────────────────────────────────────────────────────┐
│  ╔═══════════════════════════════════════════════════════════╗ │
│  ║  Ready to Start Your Career Journey?                      ║ │
│  ║                                                           ║ │
│  ║  Join 10,000+ African youth building their future.       ║ │
│  ║                                                           ║ │
│  ║  [Get Started Free]  No credit card required.            ║ │
│  ╚═══════════════════════════════════════════════════════════╝ │
└─────────────────────────────────────────────────────────────────┘
```

#### Section 9: Footer
```
┌─────────────────────────────────────────────────────────────────┐
│  TajiConnect                                                    │
│  Empowering African Youth                                       │
│                                                                 │
│  Platform      Resources     Company      Connect               │
│  ─────────     ─────────     ───────      ───────               │
│  Courses       Blog          About        Twitter               │
│  Jobs          Help Center   Careers      LinkedIn              │
│  Certificates  API Docs      Press        Instagram             │
│                                                                 │
│  ─────────────────────────────────────────────────────────────  │
│  © 2026 TajiConnect | Privacy | Terms | Cookies                 │
└─────────────────────────────────────────────────────────────────┘
```

### 1.4 Technical Implementation

#### Dependencies to Install
```bash
npm install framer-motion lottie-react @gsap/react gsap
```

#### Component Structure
```
src/components/landing/
├── LandingPage.tsx           # Main orchestrator
├── sections/
│   ├── HeroSection.tsx       # Animated hero
│   ├── SocialProofBar.tsx    # Logo bar + mini testimonials
│   ├── FeaturesGrid.tsx      # 6 animated feature cards
│   ├── HowItWorks.tsx        # Timeline component
│   ├── StatsCounter.tsx      # Animated numbers
│   ├── TestimonialsCarousel.tsx
│   ├── CourseCategories.tsx
│   ├── CTABanner.tsx
│   └── LandingFooter.tsx
├── animations/
│   ├── FadeInOnScroll.tsx    # Reusable scroll animation wrapper
│   ├── CountUp.tsx           # Number animation
│   ├── TypewriterText.tsx    # Typing effect
│   └── FloatingElements.tsx  # 3D floating objects
├── ui/
│   ├── GlassCard.tsx         # Glassmorphism card
│   ├── AnimatedButton.tsx    # Hover/click animations
│   ├── GradientText.tsx      # Animated gradient text
│   └── TestimonialCard.tsx
└── data/
    ├── testimonials.ts
    ├── features.ts
    └── stats.ts
```

#### Animation Specifications

| Element | Animation | Duration | Trigger |
|---------|-----------|----------|---------|
| Hero headline | Typewriter + fade | 2s | Page load |
| Hero illustration | Lottie loop | Continuous | Page load |
| Partner logos | Slide in from bottom | 0.5s stagger | Page load |
| Feature cards | Fade up + scale | 0.6s | Scroll into view |
| Stats numbers | Count up | 2s | Scroll into view |
| Testimonials | Slide carousel | 5s auto | Auto + manual |
| CTA buttons | Scale + glow | 0.2s | Hover |
| Floating elements | Float + rotate | 4s loop | Continuous |

### 1.5 Mobile Responsive Design

#### Breakpoints
- **Mobile:** 375px - 767px
- **Tablet:** 768px - 1023px
- **Desktop:** 1024px+

#### Mobile Optimizations
- Sticky CTA button at bottom
- Collapsible feature cards
- Swipeable testimonials
- Reduced animations (respect prefers-reduced-motion)
- Touch-optimized tap targets (44px minimum)

### 1.6 Performance Targets

| Metric | Target |
|--------|--------|
| First Contentful Paint | < 1.5s |
| Largest Contentful Paint | < 2.5s |
| Time to Interactive | < 3s |
| Cumulative Layout Shift | < 0.1 |
| Total Page Weight | < 500KB |
| Lighthouse Score | > 90 |

---

## Part 2: Comprehensive Unit Testing Plan

### 2.1 Current State

| Metric | Current | Target |
|--------|---------|--------|
| Test Framework | Playwright only | Vitest + RTL + Playwright |
| Components Tested | 13.6% | 80%+ |
| Unit Test Files | 0 | 150+ |
| Coverage | Unknown | 80%+ |

### 2.2 Testing Stack to Install

```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom @vitest/coverage-v8 msw
```

### 2.3 Test Configuration

**vitest.config.ts:**
```typescript
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: ['node_modules/', 'src/test/'],
      thresholds: {
        statements: 80,
        branches: 80,
        functions: 80,
        lines: 80
      }
    }
  }
})
```

### 2.4 Test Categories & Priority

#### Priority 1: Critical Path (Week 1-2)
| Component Area | Files | Test Focus |
|---------------|-------|------------|
| Auth | 5 | Login, register, protected routes |
| Gamification Store | 1 | XP, levels, streaks, badges |
| Goals Store | 1 | Daily goals, progress |
| Video Store | 1 | Progress, bookmarks |
| Event Bus | 1 | Event emission, subscription |
| Hooks | 10+ | Custom hooks |

#### Priority 2: Core Features (Week 3-4)
| Component Area | Files | Test Focus |
|---------------|-------|------------|
| Gamification UI | 16 | Badge display, XP animations, streaks |
| Learning | 18 | Course player, video, quizzes |
| Onboarding | 13 | Flow, psychometric tests |
| Goals | 4 | Progress, settings |

#### Priority 3: Supporting Features (Week 5-6)
| Component Area | Files | Test Focus |
|---------------|-------|------------|
| Career | 5 | Pathways, assessments |
| Jobs | 5 | Listings, applications |
| Assessments | 5 | Tests, results |
| Progress | 5 | Analytics, tracking |
| Notifications | 3 | Display, preferences |

#### Priority 4: Admin/Trainer (Week 7-8)
| Component Area | Files | Test Focus |
|---------------|-------|------------|
| Trainer | 18 | Course management, analytics |
| Settings | 3 | User preferences |
| UI Components | 12 | Reusable components |

### 2.5 Test File Structure

```
src/
├── test/
│   ├── setup.ts              # Global test setup
│   ├── mocks/
│   │   ├── handlers.ts       # MSW API mocks
│   │   ├── server.ts         # MSW server
│   │   └── data/             # Mock data
│   └── utils/
│       ├── render.tsx        # Custom render with providers
│       └── test-utils.ts     # Helper functions
├── components/
│   ├── auth/
│   │   ├── Login.tsx
│   │   └── Login.test.tsx    # Co-located test
│   ├── gamification/
│   │   ├── BadgeCard.tsx
│   │   └── BadgeCard.test.tsx
│   └── ...
├── stores/
│   ├── gamificationStore.ts
│   └── gamificationStore.test.ts
└── hooks/
    ├── useVideoQuiz.ts
    └── useVideoQuiz.test.ts
```

### 2.6 Test Templates

#### Component Test Template
```typescript
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { ComponentName } from './ComponentName'

describe('ComponentName', () => {
  it('renders correctly', () => {
    render(<ComponentName />)
    expect(screen.getByRole('button')).toBeInTheDocument()
  })

  it('handles user interaction', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(<ComponentName onClick={onClick} />)

    await user.click(screen.getByRole('button'))
    expect(onClick).toHaveBeenCalledOnce()
  })

  it('displays error state', () => {
    render(<ComponentName error="Something went wrong" />)
    expect(screen.getByRole('alert')).toHaveTextContent('Something went wrong')
  })
})
```

#### Store Test Template
```typescript
import { describe, it, expect, beforeEach } from 'vitest'
import { useGamificationStore } from './gamificationStore'

describe('gamificationStore', () => {
  beforeEach(() => {
    useGamificationStore.setState({
      currentXP: 0,
      level: 1,
      streak: 0
    })
  })

  it('awards XP correctly', () => {
    const { awardXP } = useGamificationStore.getState()
    awardXP(100, 'lesson_complete')

    const { currentXP } = useGamificationStore.getState()
    expect(currentXP).toBe(100)
  })

  it('levels up when XP threshold reached', () => {
    const { awardXP } = useGamificationStore.getState()
    awardXP(200, 'lesson_complete') // Assuming 200 XP for level 2

    const { level } = useGamificationStore.getState()
    expect(level).toBe(2)
  })
})
```

#### Hook Test Template
```typescript
import { renderHook, act } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { useVideoQuiz } from './useVideoQuiz'

describe('useVideoQuiz', () => {
  const quizTriggers = [
    { timestamp: 30, quizId: 'q1', required: true },
    { timestamp: 60, quizId: 'q2', required: false }
  ]

  it('triggers quiz at correct timestamp', () => {
    const { result } = renderHook(() =>
      useVideoQuiz({ currentTime: 30, quizTriggers })
    )

    expect(result.current.activeQuiz).toEqual({
      quizId: 'q1',
      required: true
    })
  })

  it('marks quiz as answered', () => {
    const { result } = renderHook(() =>
      useVideoQuiz({ currentTime: 30, quizTriggers })
    )

    act(() => {
      result.current.markAnswered('q1')
    })

    expect(result.current.answeredQuizzes).toContain('q1')
  })
})
```

### 2.7 Package.json Scripts

```json
{
  "scripts": {
    "test": "vitest",
    "test:watch": "vitest --watch",
    "test:coverage": "vitest --coverage",
    "test:ui": "vitest --ui",
    "test:e2e": "playwright test",
    "test:all": "npm run test:coverage && npm run test:e2e"
  }
}
```

### 2.8 CI/CD Integration

**.github/workflows/test.yml:**
```yaml
name: Test Suite

on: [push, pull_request]

jobs:
  unit-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm run test:coverage
      - uses: codecov/codecov-action@v4
        with:
          files: ./coverage/coverage-final.json

  e2e-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: npm ci
      - run: npx playwright install --with-deps
      - run: npm run test:e2e
```

---

## Part 3: Implementation Timeline

### Phase 1: Foundation (Week 1)
- [ ] Install testing dependencies (Vitest, RTL, MSW)
- [ ] Configure Vitest with coverage
- [ ] Create test utilities and mocks
- [ ] Write store tests (gamification, goals, video)
- [ ] Install animation libraries (Framer Motion, Lottie)

### Phase 2: Core Tests (Week 2)
- [ ] Auth component tests
- [ ] Gamification component tests (16 components)
- [ ] Hook tests
- [ ] Event bus tests

### Phase 3: Landing Page (Week 3)
- [ ] Create landing page component structure
- [ ] Build HeroSection with animations
- [ ] Build FeaturesGrid with scroll animations
- [ ] Build StatsCounter with count-up
- [ ] Route landing page to `/`

### Phase 4: Landing Polish (Week 4)
- [ ] Build TestimonialsCarousel
- [ ] Build CTABanner
- [ ] Add mobile responsive styles
- [ ] Performance optimization
- [ ] A11y audit

### Phase 5: Feature Tests (Week 5-6)
- [ ] Learning component tests
- [ ] Video component tests
- [ ] Onboarding tests
- [ ] Goals tests

### Phase 6: Complete Coverage (Week 7-8)
- [ ] Career/Jobs tests
- [ ] Trainer module tests
- [ ] UI component tests
- [ ] E2E test expansion
- [ ] CI/CD setup

---

## Success Metrics

### Landing Page
| Metric | Target |
|--------|--------|
| Bounce Rate | < 40% |
| Time on Page | > 2 min |
| CTA Click Rate | > 5% |
| Mobile Conversion | > 3% |
| Lighthouse Score | > 90 |

### Testing
| Metric | Target |
|--------|--------|
| Unit Test Coverage | > 80% |
| Component Tests | 154 files |
| Store Tests | 5 stores |
| Hook Tests | 10+ hooks |
| E2E Tests | 30+ scenarios |
| CI Pass Rate | > 95% |

---

## Appendix: Research Sources

1. Modern LMS landing pages (Coursera, Duolingo, Maven, Teachable)
2. Animation libraries (Framer Motion, GSAP, Lottie)
3. African EdTech market research
4. Conversion optimization studies
5. React Testing Library best practices
6. Vitest documentation

*Plan created: 2026-02-02*
*Based on comprehensive codebase and market research*
