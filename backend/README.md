# Career Platform Backend

## AI-Powered Career Generation System

This backend provides intelligent career recommendations using advanced AI algorithms and machine learning techniques.

### Features

- **AI-Powered Analysis**: Uses OpenAI GPT or Google Gemini for intelligent career assessment
- **Personalized Roadmaps**: Generates custom learning paths based on user profile and goals
- **Market Insights**: Provides real-time industry trends and job market analysis
- **Accessibility Support**: Considers special needs and provides appropriate accommodations
- **Fallback System**: Rule-based recommendations when AI services are unavailable

### Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Configure Environment**
   ```bash
   cp .env.example .env
   ```
   
   Add your AI service API key to the `.env` file:
   - For OpenAI: Add your `OPENAI_API_KEY`
   - For Google Gemini: Add your `GEMINI_API_KEY`

3. **Start the Server**
   ```bash
   npm start
   ```

### API Endpoints

#### Career Assessment
- `POST /api/career/assess` - Generate AI-powered career recommendations
- `GET /api/users/:userId/roadmaps` - Get user's personalized roadmaps
- `PUT /api/roadmaps/:roadmapId/progress` - Update roadmap progress

#### Onboarding Integration
- `POST /api/onboarding/:userId/process` - Process onboarding data
- `GET /api/onboarding/:userId/status` - Get onboarding status
- `POST /api/onboarding/:userId/complete` - Complete onboarding

### AI Integration

The system supports multiple AI providers:

#### OpenAI Integration
```javascript
// Automatically detected if API key starts with 'sk-'
OPENAI_API_KEY=sk-your-key-here
```

#### Google Gemini Integration
```javascript
// Automatically detected if API key starts with 'AIza'
GEMINI_API_KEY=AIza-your-key-here
```

### Career Algorithm Features

1. **Intelligent Analysis**
   - Personality assessment using AI
   - Skills gap analysis
   - Interest profiling
   - Values alignment

2. **Personalized Roadmaps**
   - Phase-based learning paths
   - Adaptive duration based on user profile
   - Accessibility considerations
   - Resource recommendations

3. **Market Intelligence**
   - Industry trend analysis
   - Salary insights
   - Job availability forecasting
   - Future-proofing scores

### Example Usage

```javascript
// Generate career recommendations
const result = await fetch('/api/career/assess', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    userId: '1',
    answers: {
      1: 'Remote/flexible',
      2: 4,
      3: ['Problem solving', 'Data analysis'],
      // ... more answers
    },
    userProfile: {
      age: 20,
      education: { level: 'High school' },
      isPWD: false
    }
  })
});

const recommendations = await result.json();
```

### Response Format

```json
{
  "success": true,
  "data": {
    "recommendations": [
      {
        "title": "Software Developer",
        "match": "92%",
        "description": "Design and develop software applications",
        "personalizedRoadmap": [
          {
            "phase": "Foundation",
            "duration": "2-3 months",
            "skills": ["HTML/CSS", "JavaScript"],
            "milestones": ["Build first webpage"],
            "personalizedTips": ["Focus on hands-on practice"]
          }
        ],
        "marketInsights": {
          "demandScore": 95,
          "salaryTrend": "increasing",
          "futureOutlook": "excellent"
        }
      }
    ],
    "analysis": {
      "personality": {
        "type": "analytical",
        "traits": ["detail-oriented", "logical"]
      },
      "interests": [
        {"category": "technology", "score": 85}
      ]
    },
    "confidence": 87,
    "aiGenerated": true
  }
}
```

### Fallback System

If AI services are unavailable, the system automatically falls back to:
- Rule-based career matching
- Template-based roadmap generation
- Static market insights
- Reduced confidence scores

### Accessibility Features

The system considers various accessibility needs:
- Visual impairments (screen reader compatibility)
- Hearing impairments (text-based resources)
- Mobility limitations (ergonomic considerations)
- Learning differences (adaptive learning paths)

### Performance Optimization

- Caching of AI responses
- Async processing for roadmap generation
- Fallback mechanisms for reliability
- Rate limiting for API calls

### Development

To extend the career algorithm:

1. **Add New Career Paths**
   - Update `db.json` with new career data
   - Add category mappings in `career-algorithm.js`

2. **Enhance AI Prompts**
   - Modify prompt templates in `buildAnalysisPrompt()`
   - Add new analysis categories

3. **Custom Roadmap Templates**
   - Add templates in `generateRuleBasedRoadmap()`
   - Include industry-specific resources

### Monitoring

The system logs:
- AI API usage and costs
- Fallback activations
- User assessment patterns
- Performance metrics

### Security

- API keys stored in environment variables
- Input validation and sanitization
- Rate limiting on AI endpoints
- User data privacy protection