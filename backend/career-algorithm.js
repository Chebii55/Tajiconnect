const fs = require('fs');
const path = require('path');

class AICareerAlgorithm {
  constructor(apiKey = null) {
    this.apiKey = apiKey || process.env.OPENAI_API_KEY || process.env.GEMINI_API_KEY;
    this.dbPath = path.join(__dirname, 'db.json');
    this.careerDatabase = this.loadCareerDatabase();
    this.industryTrends = this.loadIndustryTrends();
    this.skillsMatrix = this.loadSkillsMatrix();
  }

  loadCareerDatabase() {
    try {
      const data = fs.readFileSync(this.dbPath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.error('Error loading database:', error);
      return {};
    }
  }

  loadIndustryTrends() {
    return {
      'technology': {
        growth: 'high',
        demandScore: 95,
        emergingSkills: ['AI/ML', 'Cloud Computing', 'Cybersecurity', 'DevOps', 'Blockchain'],
        salaryTrend: 'increasing',
        jobAvailability: 'abundant',
        futureOutlook: 'excellent'
      },
      'healthcare': {
        growth: 'high',
        demandScore: 90,
        emergingSkills: ['Telemedicine', 'Health Informatics', 'Biotechnology', 'Mental Health'],
        salaryTrend: 'stable',
        jobAvailability: 'high',
        futureOutlook: 'very good'
      },
      'finance': {
        growth: 'moderate',
        demandScore: 75,
        emergingSkills: ['FinTech', 'Cryptocurrency', 'Risk Analysis', 'Regulatory Compliance'],
        salaryTrend: 'stable',
        jobAvailability: 'moderate',
        futureOutlook: 'good'
      },
      'education': {
        growth: 'moderate',
        demandScore: 70,
        emergingSkills: ['EdTech', 'Online Learning', 'Curriculum Design', 'Learning Analytics'],
        salaryTrend: 'slow increase',
        jobAvailability: 'moderate',
        futureOutlook: 'stable'
      },
      'creative': {
        growth: 'moderate',
        demandScore: 65,
        emergingSkills: ['Digital Marketing', 'Content Creation', 'UX/UI Design', 'Video Production'],
        salaryTrend: 'variable',
        jobAvailability: 'competitive',
        futureOutlook: 'evolving'
      }
    };
  }

  loadSkillsMatrix() {
    return {
      'programming': {
        relatedSkills: ['Problem Solving', 'Logic', 'Mathematics', 'System Design'],
        careers: ['Software Developer', 'Data Scientist', 'DevOps Engineer', 'Cybersecurity Analyst'],
        difficulty: 'high',
        timeToMaster: '2-4 years',
        marketDemand: 'very high'
      },
      'communication': {
        relatedSkills: ['Public Speaking', 'Writing', 'Presentation', 'Interpersonal Skills'],
        careers: ['Project Manager', 'Sales Manager', 'Teacher', 'Marketing Manager'],
        difficulty: 'moderate',
        timeToMaster: '1-2 years',
        marketDemand: 'high'
      },
      'data-analysis': {
        relatedSkills: ['Statistics', 'Critical Thinking', 'Research', 'Visualization'],
        careers: ['Data Scientist', 'Business Analyst', 'Market Researcher', 'Financial Analyst'],
        difficulty: 'high',
        timeToMaster: '2-3 years',
        marketDemand: 'very high'
      },
      'design': {
        relatedSkills: ['Creativity', 'Visual Arts', 'User Experience', 'Color Theory'],
        careers: ['UX Designer', 'Graphic Designer', 'Product Designer', 'Art Director'],
        difficulty: 'moderate',
        timeToMaster: '1-3 years',
        marketDemand: 'moderate'
      },
      'leadership': {
        relatedSkills: ['Team Management', 'Decision Making', 'Strategic Planning', 'Motivation'],
        careers: ['Project Manager', 'Team Lead', 'Executive', 'Entrepreneur'],
        difficulty: 'high',
        timeToMaster: '3-5 years',
        marketDemand: 'high'
      }
    };
  }

  // Main AI career generation function
  async generateAICareerRecommendations(assessmentData, userProfile) {
    try {
      // Step 1: Analyze user responses using AI
      const userAnalysis = await this.analyzeUserWithAI(assessmentData, userProfile);
      
      // Step 2: Match with career database
      const careerMatches = this.matchCareersWithAI(userAnalysis, userProfile);
      
      // Step 3: Generate personalized roadmaps
      const personalizedPaths = await this.generatePersonalizedRoadmaps(careerMatches, userProfile, userAnalysis);
      
      // Step 4: Add market insights
      const enrichedRecommendations = this.addMarketInsights(personalizedPaths);
      
      return {
        recommendations: enrichedRecommendations,
        analysis: userAnalysis,
        confidence: this.calculateConfidenceScore(userAnalysis, careerMatches),
        marketInsights: this.getMarketInsights(enrichedRecommendations)
      };
    } catch (error) {
      console.error('AI Career Generation Error:', error);
      // Fallback to rule-based system
      return this.generateRuleBasedRecommendations(assessmentData, userProfile);
    }
  }

  // AI-powered user analysis
  async analyzeUserWithAI(assessmentData, userProfile) {
    if (!this.apiKey) {
      return this.analyzeUserRuleBased(assessmentData, userProfile);
    }

    try {
      const prompt = this.buildAnalysisPrompt(assessmentData, userProfile);
      const aiResponse = await this.callAIService(prompt, 'analysis');
      
      return this.parseAIAnalysis(aiResponse);
    } catch (error) {
      console.error('AI Analysis Error:', error);
      return this.analyzeUserRuleBased(assessmentData, userProfile);
    }
  }

  buildAnalysisPrompt(assessmentData, userProfile) {
    const { answers } = assessmentData;
    
    return `
Analyze this career assessment data and provide insights:

User Profile:
- Age: ${userProfile.age || 'Not specified'}
- Education: ${userProfile.education?.level || 'Not specified'}
- Special Needs: ${userProfile.isPWD ? `Yes (${userProfile.impairmentType || 'Not specified'})` : 'No'}
- Hobbies: ${userProfile.hobbies?.join(', ') || 'Not specified'}
- Talents: ${userProfile.talents?.join(', ') || 'Not specified'}

Assessment Responses:
${Object.entries(answers).map(([q, a]) => `Question ${q}: ${Array.isArray(a) ? a.join(', ') : a}`).join('\n')}

Please analyze and return a JSON response with:
{
  "personality": {
    "type": "analytical/creative/social/enterprising",
    "traits": ["trait1", "trait2", "trait3"],
    "workStyle": "independent/collaborative/leadership",
    "stressHandling": "low/moderate/high"
  },
  "interests": [
    {"category": "technology", "score": 85, "confidence": "high"},
    {"category": "creative", "score": 70, "confidence": "moderate"}
  ],
  "skills": {
    "technical": {"level": 75, "potential": 90},
    "communication": {"level": 60, "potential": 80},
    "leadership": {"level": 50, "potential": 85}
  },
  "values": {
    "primary": "career_growth/work_life_balance/high_salary/impact",
    "secondary": "job_security/flexibility/recognition",
    "salaryImportance": 70
  },
  "learningStyle": "visual/auditory/kinesthetic/mixed",
  "careerReadiness": 65,
  "recommendations": ["specific career advice"]
}

Focus on providing actionable insights based on the assessment data.
`;
  }

  async callAIService(prompt, type = 'analysis') {
    // This is a placeholder for AI service integration
    // You can integrate with OpenAI, Google Gemini, or other AI services
    
    if (this.apiKey && this.apiKey.startsWith('sk-')) {
      // OpenAI integration
      return await this.callOpenAI(prompt, type);
    } else if (this.apiKey && this.apiKey.startsWith('AIza')) {
      // Google Gemini integration
      return await this.callGemini(prompt, type);
    } else {
      // Fallback to mock AI response
      return this.generateMockAIResponse(prompt, type);
    }
  }

  async callOpenAI(prompt, type) {
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: 'You are an expert career counselor and psychologist specializing in career assessment and guidance. Provide detailed, actionable insights based on assessment data.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: 1500,
          temperature: 0.7
        })
      });

      const data = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      console.error('OpenAI API Error:', error);
      throw error;
    }
  }

  async callGemini(prompt, type) {
    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1500,
          }
        })
      });

      const data = await response.json();
      return data.candidates[0].content.parts[0].text;
    } catch (error) {
      console.error('Gemini API Error:', error);
      throw error;
    }
  }

  generateMockAIResponse(prompt, type) {
    // Mock AI response for testing without API key
    if (type === 'analysis') {
      return JSON.stringify({
        personality: {
          type: "analytical",
          traits: ["detail-oriented", "logical", "curious"],
          workStyle: "independent",
          stressHandling: "moderate"
        },
        interests: [
          {"category": "technology", "score": 85, "confidence": "high"},
          {"category": "problem-solving", "score": 80, "confidence": "high"},
          {"category": "creative", "score": 60, "confidence": "moderate"}
        ],
        skills: {
          technical: {"level": 70, "potential": 90},
          communication: {"level": 65, "potential": 80},
          leadership: {"level": 45, "potential": 75}
        },
        values: {
          primary: "career_growth",
          secondary: "work_life_balance",
          salaryImportance: 75
        },
        learningStyle: "visual",
        careerReadiness: 75,
        recommendations: [
          "Focus on developing technical skills through hands-on projects",
          "Consider roles that combine analytical thinking with technology",
          "Build communication skills to complement technical abilities"
        ]
      });
    }
    
    return "Mock AI response for career guidance.";
  }

  parseAIAnalysis(aiResponse) {
    try {
      // Try to parse JSON response
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      
      // Fallback parsing if JSON is not properly formatted
      return this.extractInsightsFromText(aiResponse);
    } catch (error) {
      console.error('Error parsing AI response:', error);
      return this.generateDefaultAnalysis();
    }
  }

  extractInsightsFromText(text) {
    // Extract insights from unstructured AI response
    const analysis = this.generateDefaultAnalysis();
    
    // Look for personality indicators
    if (text.toLowerCase().includes('analytical') || text.toLowerCase().includes('logical')) {
      analysis.personality.type = 'analytical';
    } else if (text.toLowerCase().includes('creative') || text.toLowerCase().includes('artistic')) {
      analysis.personality.type = 'creative';
    } else if (text.toLowerCase().includes('social') || text.toLowerCase().includes('people')) {
      analysis.personality.type = 'social';
    }
    
    // Extract recommendations
    const recommendations = [];
    const lines = text.split('\n');
    lines.forEach(line => {
      if (line.includes('recommend') || line.includes('suggest') || line.includes('consider')) {
        recommendations.push(line.trim());
      }
    });
    
    if (recommendations.length > 0) {
      analysis.recommendations = recommendations.slice(0, 3);
    }
    
    return analysis;
  }

  generateDefaultAnalysis() {
    return {
      personality: {
        type: "balanced",
        traits: ["adaptable", "curious", "motivated"],
        workStyle: "collaborative",
        stressHandling: "moderate"
      },
      interests: [
        {"category": "technology", "score": 70, "confidence": "moderate"},
        {"category": "problem-solving", "score": 75, "confidence": "moderate"}
      ],
      skills: {
        technical: {"level": 60, "potential": 80},
        communication: {"level": 65, "potential": 85},
        leadership: {"level": 50, "potential": 75}
      },
      values: {
        primary: "career_growth",
        secondary: "work_life_balance",
        salaryImportance: 70
      },
      learningStyle: "mixed",
      careerReadiness: 70,
      recommendations: [
        "Explore various career options to find your passion",
        "Develop both technical and soft skills",
        "Consider internships or job shadowing opportunities"
      ]
    };
  }

  // Rule-based analysis fallback
  analyzeUserRuleBased(assessmentData, userProfile) {
    const { answers } = assessmentData;
    const analysis = this.generateDefaultAnalysis();
    
    // Analyze interests based on answers
    const interestScores = {};
    
    // Question 1: Work environment
    if (answers[1] === 'Corporate office') {
      interestScores.business = (interestScores.business || 0) + 20;
    } else if (answers[1] === 'Remote/flexible') {
      interestScores.technology = (interestScores.technology || 0) + 15;
    } else if (answers[1] === 'Creative studio') {
      interestScores.creative = (interestScores.creative || 0) + 25;
    }
    
    // Question 3: Activity interests
    if (Array.isArray(answers[3])) {
      answers[3].forEach(activity => {
        if (activity.includes('Problem solving') || activity.includes('Data analysis')) {
          interestScores.technology = (interestScores.technology || 0) + 15;
        } else if (activity.includes('Creative design')) {
          interestScores.creative = (interestScores.creative || 0) + 20;
        } else if (activity.includes('Teaching') || activity.includes('Helping')) {
          interestScores.social = (interestScores.social || 0) + 20;
        }
      });
    }
    
    // Convert to analysis format
    analysis.interests = Object.entries(interestScores)
      .map(([category, score]) => ({
        category,
        score: Math.min(score, 100),
        confidence: score > 30 ? 'high' : score > 15 ? 'moderate' : 'low'
      }))
      .sort((a, b) => b.score - a.score);
    
    // Analyze skills
    if (answers[4]) analysis.skills.communication.level = answers[4] * 20;
    if (answers[6]) analysis.skills.leadership.level = answers[6] * 20;
    
    // Analyze values
    if (answers[7]) analysis.values.primary = answers[7].toLowerCase().replace(' ', '_');
    if (answers[8]) analysis.values.salaryImportance = answers[8] * 20;
    
    return analysis;
  }

  // AI-enhanced career matching
  matchCareersWithAI(userAnalysis, userProfile) {
    const allCareers = this.getAllCareers();
    const scoredCareers = [];
    
    allCareers.forEach(career => {
      let score = 0;
      let confidence = 0;
      
      // Interest matching (40% weight)
      userAnalysis.interests.forEach(interest => {
        if (career.categories && career.categories.includes(interest.category)) {
          score += (interest.score / 100) * 40;
          confidence += interest.confidence === 'high' ? 15 : interest.confidence === 'moderate' ? 10 : 5;
        }
      });
      
      // Skills matching (30% weight)
      const skillMatch = this.calculateSkillMatch(career.requiredSkills, userAnalysis.skills);
      score += skillMatch * 30;
      confidence += skillMatch > 0.7 ? 15 : skillMatch > 0.4 ? 10 : 5;
      
      // Values alignment (20% weight)
      const valueMatch = this.calculateValueMatch(career, userAnalysis.values);
      score += valueMatch * 20;
      confidence += valueMatch > 0.7 ? 10 : valueMatch > 0.4 ? 5 : 0;
      
      // Market demand bonus (10% weight)
      const marketScore = this.getMarketDemandScore(career.category);
      score += marketScore * 10;
      confidence += marketScore > 0.8 ? 10 : marketScore > 0.6 ? 5 : 0;
      
      // Accessibility considerations
      if (userProfile.isPWD) {
        const accessibilityScore = this.calculateAccessibilityScore(career, userProfile.impairmentType);
        score *= accessibilityScore;
      }
      
      scoredCareers.push({
        ...career,
        matchScore: Math.min(Math.round(score), 100),
        confidence: Math.min(Math.round(confidence), 100),
        reasoning: this.generateMatchReasoning(career, userAnalysis, score)
      });
    });
    
    return scoredCareers
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, 5);
  }

  getAllCareers() {
    const careers = this.careerDatabase.careerPaths || [];
    
    // Enhanced career data with AI insights
    return careers.map(career => ({
      ...career,
      categories: this.mapCareerToCategories(career),
      marketDemand: this.getMarketDemandScore(career.category),
      accessibilityRating: this.getAccessibilityRating(career),
      futureProofScore: this.getFutureProofScore(career),
      requiredSkills: career.skills || []
    }));
  }

  mapCareerToCategories(career) {
    const categoryMap = {
      'Frontend Developer': ['technology', 'creative', 'problem-solving'],
      'Backend Developer': ['technology', 'problem-solving', 'analytical'],
      'Data Scientist': ['technology', 'analytical', 'research'],
      'UX Designer': ['creative', 'technology', 'user-focused'],
      'Project Manager': ['leadership', 'business', 'communication'],
      'Digital Marketing Manager': ['creative', 'business', 'communication']
    };
    
    return categoryMap[career.title] || ['general'];
  }

  calculateSkillMatch(requiredSkills, userSkills) {
    if (!requiredSkills || requiredSkills.length === 0) return 0.5;
    
    let matchCount = 0;
    const userSkillNames = Object.keys(userSkills);
    
    requiredSkills.forEach(skill => {
      const normalizedSkill = skill.toLowerCase();
      const hasSkill = userSkillNames.some(userSkill => 
        userSkill.toLowerCase().includes(normalizedSkill) ||
        normalizedSkill.includes(userSkill.toLowerCase())
      );
      
      if (hasSkill) matchCount++;
    });
    
    return matchCount / requiredSkills.length;
  }

  calculateValueMatch(career, userValues) {
    let match = 0.5; // Base match
    
    // Salary alignment
    if (userValues.salaryImportance > 70 && career.averageSalary) {
      const salaryRange = this.parseSalaryRange(career.averageSalary);
      if (salaryRange.max > 100000) match += 0.3;
      else if (salaryRange.max > 70000) match += 0.2;
    }
    
    // Growth potential
    if (userValues.primary === 'career_growth' && career.jobGrowth) {
      const growthRate = parseInt(career.jobGrowth);
      if (growthRate > 15) match += 0.3;
      else if (growthRate > 10) match += 0.2;
    }
    
    return Math.min(match, 1);
  }

  parseSalaryRange(salaryString) {
    const numbers = salaryString.match(/[\d,]+/g);
    if (numbers && numbers.length >= 2) {
      return {
        min: parseInt(numbers[0].replace(/,/g, '')),
        max: parseInt(numbers[1].replace(/,/g, ''))
      };
    }
    return { min: 50000, max: 80000 }; // Default range
  }

  getMarketDemandScore(category) {
    const categoryLower = category?.toLowerCase() || '';
    
    if (categoryLower.includes('technology') || categoryLower.includes('data')) return 0.95;
    if (categoryLower.includes('health')) return 0.90;
    if (categoryLower.includes('business')) return 0.75;
    if (categoryLower.includes('education')) return 0.70;
    if (categoryLower.includes('creative')) return 0.65;
    
    return 0.60; // Default
  }

  calculateAccessibilityScore(career, impairmentType) {
    if (!impairmentType) return 1.0;
    
    const accessibilityRatings = {
      'Visual': {
        'Software Developer': 0.9, // Screen readers available
        'Data Scientist': 0.8,
        'Digital Marketing Manager': 0.7,
        'UX Designer': 0.6, // Visual-heavy role
        'default': 0.7
      },
      'Hearing': {
        'Software Developer': 0.95,
        'Data Scientist': 0.95,
        'UX Designer': 0.9,
        'Project Manager': 0.7, // Communication-heavy
        'default': 0.8
      },
      'Mobility': {
        'Software Developer': 0.95, // Remote-friendly
        'Data Scientist': 0.95,
        'Digital Marketing Manager': 0.9,
        'default': 0.85
      }
    };
    
    const ratings = accessibilityRatings[impairmentType];
    return ratings ? (ratings[career.title] || ratings.default) : 1.0;
  }

  getAccessibilityRating(career) {
    // Rate careers on accessibility (1-5 scale)
    const remoteFreindly = ['Software Developer', 'Data Scientist', 'Digital Marketing Manager'];
    const communicationHeavy = ['Project Manager', 'Sales Manager', 'Teacher'];
    
    if (remoteFreindly.includes(career.title)) return 5;
    if (communicationHeavy.includes(career.title)) return 3;
    return 4; // Default
  }

  getFutureProofScore(career) {
    const futureProofCareers = {
      'Software Developer': 95,
      'Data Scientist': 98,
      'Cybersecurity Analyst': 96,
      'UX Designer': 85,
      'Digital Marketing Manager': 80,
      'Project Manager': 75
    };
    
    return futureProofCareers[career.title] || 70;
  }

  generateMatchReasoning(career, userAnalysis, score) {
    const reasons = [];
    
    // Interest alignment
    const topInterest = userAnalysis.interests[0];
    if (topInterest && career.categories.includes(topInterest.category)) {
      reasons.push(`Strong alignment with your ${topInterest.category} interests`);
    }
    
    // Skills match
    const skillMatch = this.calculateSkillMatch(career.requiredSkills, userAnalysis.skills);
    if (skillMatch > 0.6) {
      reasons.push(`Good match with your existing skills`);
    } else if (skillMatch < 0.3) {
      reasons.push(`Opportunity to develop new skills in ${career.requiredSkills.slice(0, 2).join(' and ')}`);
    }
    
    // Market demand
    const marketScore = this.getMarketDemandScore(career.category);
    if (marketScore > 0.8) {
      reasons.push(`High market demand and job security`);
    }
    
    // Values alignment
    if (userAnalysis.values.primary === 'career_growth' && career.jobGrowth) {
      reasons.push(`Excellent growth potential (${career.jobGrowth} projected growth)`);
    }
    
    return reasons.slice(0, 3); // Top 3 reasons
  }

  // Generate personalized roadmaps with AI
  async generatePersonalizedRoadmaps(careerMatches, userProfile, userAnalysis) {
    const roadmaps = [];
    
    for (const career of careerMatches) {
      try {
        const roadmap = await this.generateCareerRoadmap(career, userProfile, userAnalysis);
        roadmaps.push({
          ...career,
          match: `${career.matchScore}%`,
          color: this.getCareerColor(roadmaps.length),
          personalizedRoadmap: roadmap,
          estimatedDuration: this.calculateTotalDuration(roadmap),
          difficultyLevel: this.calculateDifficultyLevel(roadmap, userAnalysis),
          personalizedTips: await this.generatePersonalizedTips(career, userProfile, userAnalysis)
        });
      } catch (error) {
        console.error(`Error generating roadmap for ${career.title}:`, error);
        // Add career without detailed roadmap
        roadmaps.push({
          ...career,
          match: `${career.matchScore}%`,
          color: this.getCareerColor(roadmaps.length),
          personalizedRoadmap: this.generateBasicRoadmap(career),
          personalizedTips: []
        });
      }
    }
    
    return roadmaps;
  }

  async generateCareerRoadmap(career, userProfile, userAnalysis) {
    if (this.apiKey) {
      try {
        return await this.generateAIRoadmap(career, userProfile, userAnalysis);
      } catch (error) {
        console.error('AI roadmap generation failed:', error);
      }
    }
    
    return this.generateRuleBasedRoadmap(career, userProfile, userAnalysis);
  }

  async generateAIRoadmap(career, userProfile, userAnalysis) {
    const prompt = `
Create a personalized learning roadmap for: ${career.title}

User Profile:
- Age: ${userProfile.age}
- Education: ${userProfile.education?.level}
- Current Skills: ${Object.keys(userAnalysis.skills).join(', ')}
- Learning Style: ${userAnalysis.learningStyle}
- Career Readiness: ${userAnalysis.careerReadiness}%
- Special Considerations: ${userProfile.isPWD ? userProfile.impairmentType : 'None'}

Career Requirements:
- Required Skills: ${career.requiredSkills?.join(', ')}
- Difficulty: ${career.difficulty}
- Duration: ${career.duration}

Please create a JSON roadmap with 4 phases:
{
  "phases": [
    {
      "phase": "Foundation",
      "duration": "2-3 months",
      "skills": ["skill1", "skill2"],
      "milestones": ["milestone1", "milestone2"],
      "resources": ["resource1", "resource2"],
      "personalizedTips": ["tip1", "tip2"],
      "assessments": ["assessment1"]
    }
  ]
}

Make it specific to the user's background and learning style.
`;

    const aiResponse = await this.callAIService(prompt, 'roadmap');
    return this.parseRoadmapResponse(aiResponse);
  }

  parseRoadmapResponse(response) {
    try {
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return parsed.phases || parsed;
      }
    } catch (error) {
      console.error('Error parsing roadmap response:', error);
    }
    
    return this.generateBasicRoadmap({ title: 'Generic Career' });
  }

  generateRuleBasedRoadmap(career, userProfile, userAnalysis) {
    const roadmapTemplates = {
      'Software Developer': [
        {
          phase: 'Foundation',
          duration: '2-3 months',
          skills: ['HTML/CSS', 'JavaScript Basics', 'Git/Version Control'],
          milestones: ['Build first webpage', 'Complete JavaScript course', 'Create GitHub profile'],
          resources: ['FreeCodeCamp', 'MDN Web Docs', 'GitHub Learning Lab'],
          assessments: ['HTML/CSS Quiz', 'JavaScript Fundamentals Test']
        },
        {
          phase: 'Intermediate',
          duration: '3-4 months',
          skills: ['React/Vue.js', 'Backend Basics', 'Database Fundamentals'],
          milestones: ['Build interactive web app', 'Create REST API', 'Deploy first project'],
          resources: ['React Documentation', 'Node.js Tutorials', 'MongoDB University'],
          assessments: ['React Component Test', 'API Development Project']
        },
        {
          phase: 'Advanced',
          duration: '4-6 months',
          skills: ['Full-stack Development', 'Testing', 'DevOps Basics'],
          milestones: ['Complete full-stack project', 'Implement CI/CD', 'Contribute to open source'],
          resources: ['Jest Documentation', 'Docker Tutorials', 'AWS Free Tier'],
          assessments: ['Full-stack Portfolio Project', 'Code Review Exercise']
        },
        {
          phase: 'Professional',
          duration: '2-3 months',
          skills: ['System Design', 'Code Review', 'Team Collaboration'],
          milestones: ['Build portfolio', 'Practice interviews', 'Apply for positions'],
          resources: ['System Design Primer', 'LeetCode', 'LinkedIn Learning'],
          assessments: ['Technical Interview Practice', 'Portfolio Review']
        }
      ],
      'Data Scientist': [
        {
          phase: 'Foundation',
          duration: '3-4 months',
          skills: ['Python/R', 'Statistics', 'Data Manipulation'],
          milestones: ['Complete Python course', 'Learn pandas/numpy', 'First data analysis project'],
          resources: ['Python.org Tutorial', 'Kaggle Learn', 'Coursera Statistics'],
          assessments: ['Python Programming Test', 'Statistics Quiz']
        },
        {
          phase: 'Intermediate',
          duration: '4-5 months',
          skills: ['Machine Learning', 'Data Visualization', 'SQL'],
          milestones: ['Build ML model', 'Create data dashboard', 'Database projects'],
          resources: ['Scikit-learn Docs', 'Tableau Public', 'SQLBolt'],
          assessments: ['ML Model Project', 'Data Visualization Portfolio']
        },
        {
          phase: 'Advanced',
          duration: '5-6 months',
          skills: ['Deep Learning', 'Big Data Tools', 'MLOps'],
          milestones: ['Neural network project', 'Work with big datasets', 'Deploy ML model'],
          resources: ['TensorFlow Tutorials', 'Apache Spark Docs', 'MLflow'],
          assessments: ['Deep Learning Project', 'Model Deployment Exercise']
        },
        {
          phase: 'Professional',
          duration: '2-3 months',
          skills: ['Business Intelligence', 'Communication', 'Domain Expertise'],
          milestones: ['Business case study', 'Present findings', 'Build portfolio'],
          resources: ['Tableau', 'Power BI', 'Storytelling with Data'],
          assessments: ['Business Case Presentation', 'Portfolio Review']
        }
      ]
    };
    
    let roadmap = roadmapTemplates[career.title] || this.generateBasicRoadmap(career);
    
    // Personalize based on user profile
    return this.personalizeRoadmap(roadmap, userProfile, userAnalysis);
  }

  generateBasicRoadmap(career) {
    return [
      {
        phase: 'Foundation',
        duration: '2-3 months',
        skills: career.requiredSkills?.slice(0, 3) || ['Basic Skills'],
        milestones: ['Complete basic training', 'First practical project'],
        resources: ['Online courses', 'Documentation'],
        assessments: ['Skills assessment']
      },
      {
        phase: 'Intermediate',
        duration: '3-4 months',
        skills: career.requiredSkills?.slice(3, 6) || ['Intermediate Skills'],
        milestones: ['Intermediate project', 'Skill certification'],
        resources: ['Advanced courses', 'Practice projects'],
        assessments: ['Certification exam']
      },
      {
        phase: 'Advanced',
        duration: '4-5 months',
        skills: career.requiredSkills || ['Advanced Skills'],
        milestones: ['Advanced project', 'Portfolio development'],
        resources: ['Specialized training', 'Industry resources'],
        assessments: ['Portfolio review']
      },
      {
        phase: 'Professional',
        duration: '2-3 months',
        skills: ['Professional Skills', 'Industry Knowledge'],
        milestones: ['Job preparation', 'Network building'],
        resources: ['Career services', 'Professional networks'],
        assessments: ['Interview preparation']
      }
    ];
  }

  personalizeRoadmap(roadmap, userProfile, userAnalysis) {
    const adjustmentFactor = this.calculateAdjustmentFactor(userProfile, userAnalysis);
    
    return roadmap.map(phase => ({
      ...phase,
      duration: this.adjustDuration(phase.duration, adjustmentFactor),
      personalizedTips: this.generatePhaseSpecificTips(phase, userProfile, userAnalysis),
      adaptations: this.generateAdaptations(phase, userProfile)
    }));
  }

  calculateAdjustmentFactor(userProfile, userAnalysis) {
    let factor = 1.0;
    
    // Education level adjustment
    if (userProfile.education?.level?.includes('Bachelor')) factor *= 0.8;
    else if (userProfile.education?.level?.includes('Master')) factor *= 0.7;
    else if (userProfile.education?.level === 'High school') factor *= 1.2;
    
    // Age adjustment
    if (userProfile.age < 20) factor *= 1.1;
    else if (userProfile.age > 30) factor *= 0.9;
    
    // Career readiness adjustment
    if (userAnalysis.careerReadiness > 80) factor *= 0.9;
    else if (userAnalysis.careerReadiness < 50) factor *= 1.3;
    
    // Learning style adjustment
    if (userAnalysis.learningStyle === 'kinesthetic') factor *= 1.1;
    else if (userAnalysis.learningStyle === 'visual') factor *= 0.95;
    
    return Math.max(0.6, Math.min(1.5, factor)); // Clamp between 0.6 and 1.5
  }

  adjustDuration(duration, factor) {
    const [min, max] = duration.split('-').map(d => parseInt(d.split(' ')[0]));
    const adjustedMin = Math.ceil(min * factor);
    const adjustedMax = Math.ceil(max * factor);
    return `${adjustedMin}-${adjustedMax} months`;
  }

  generatePhaseSpecificTips(phase, userProfile, userAnalysis) {
    const tips = [];
    
    // Learning style tips
    if (userAnalysis.learningStyle === 'visual') {
      tips.push('Use diagrams, charts, and visual aids to understand concepts better');
    } else if (userAnalysis.learningStyle === 'kinesthetic') {
      tips.push('Focus on hands-on projects and practical exercises');
    } else if (userAnalysis.learningStyle === 'auditory') {
      tips.push('Consider podcasts, video tutorials, and discussion groups');
    }
    
    // Phase-specific tips
    if (phase.phase === 'Foundation') {
      tips.push('Start with small, achievable goals to build confidence');
      if (userProfile.age < 20) {
        tips.push('Take your time to build strong fundamentals - you have the advantage of time');
      }
    } else if (phase.phase === 'Professional') {
      tips.push('Start networking and building professional relationships early');
      tips.push('Create a strong online presence and portfolio');
    }
    
    // Accessibility tips
    if (userProfile.isPWD) {
      tips.push('Explore accessibility tools and resources specific to your needs');
      if (userProfile.impairmentType === 'Visual') {
        tips.push('Familiarize yourself with screen readers and keyboard navigation');
      }
    }
    
    return tips.slice(0, 3); // Limit to 3 tips per phase
  }

  generateAdaptations(phase, userProfile) {
    const adaptations = [];
    
    if (userProfile.isPWD) {
      switch (userProfile.impairmentType) {
        case 'Visual':
          adaptations.push('Use screen reader compatible resources');
          adaptations.push('Focus on keyboard shortcuts and navigation');
          break;
        case 'Hearing':
          adaptations.push('Prioritize text-based and visual learning materials');
          adaptations.push('Use closed captions for video content');
          break;
        case 'Mobility':
          adaptations.push('Ensure ergonomic workspace setup');
          adaptations.push('Consider voice recognition software');
          break;
      }
    }
    
    return adaptations;
  }

  async generatePersonalizedTips(career, userProfile, userAnalysis) {
    const tips = [];
    
    // Career-specific tips
    if (career.title.includes('Developer')) {
      tips.push('Build a strong GitHub portfolio with diverse projects');
      tips.push('Contribute to open source projects to gain experience');
    } else if (career.title.includes('Data')) {
      tips.push('Work on real-world datasets to build practical experience');
      tips.push('Learn to communicate technical findings to non-technical audiences');
    }
    
    // Personality-based tips
    if (userAnalysis.personality?.type === 'analytical') {
      tips.push('Leverage your analytical strengths in problem-solving roles');
    } else if (userAnalysis.personality?.type === 'creative') {
      tips.push('Look for roles that combine creativity with technical skills');
    }
    
    // Market-based tips
    const marketTrend = this.industryTrends[career.category?.toLowerCase()];
    if (marketTrend?.emergingSkills) {
      tips.push(`Consider learning emerging skills: ${marketTrend.emergingSkills.slice(0, 2).join(', ')}`);
    }
    
    return tips.slice(0, 4);
  }

  calculateTotalDuration(roadmap) {
    let totalMonths = 0;
    roadmap.forEach(phase => {
      const [min, max] = phase.duration.split('-').map(d => parseInt(d.split(' ')[0]));
      totalMonths += Math.ceil((min + max) / 2);
    });
    return `${totalMonths} months`;
  }

  calculateDifficultyLevel(roadmap, userAnalysis) {
    const skillComplexity = roadmap.reduce((sum, phase) => {
      return sum + (phase.skills?.length || 0);
    }, 0);
    
    const userReadiness = userAnalysis.careerReadiness || 50;
    
    if (skillComplexity > 15 && userReadiness < 60) return 'High';
    if (skillComplexity > 10 || userReadiness < 70) return 'Moderate';
    return 'Beginner-Friendly';
  }

  getCareerColor(index) {
    const colors = [
      'bg-blue-600',
      'bg-green-600',
      'bg-purple-600',
      'bg-orange-600',
      'bg-red-600',
      'bg-indigo-600',
      'bg-pink-600',
      'bg-teal-600'
    ];
    return colors[index] || 'bg-gray-600';
  }

  addMarketInsights(recommendations) {
    return recommendations.map(career => ({
      ...career,
      marketInsights: {
        demandScore: this.getMarketDemandScore(career.category),
        salaryTrend: this.getSalaryTrend(career.category),
        jobAvailability: this.getJobAvailability(career.category),
        futureOutlook: this.getFutureOutlook(career.category),
        emergingSkills: this.getEmergingSkills(career.category)
      }
    }));
  }

  getSalaryTrend(category) {
    const trends = this.industryTrends[category?.toLowerCase()];
    return trends?.salaryTrend || 'stable';
  }

  getJobAvailability(category) {
    const trends = this.industryTrends[category?.toLowerCase()];
    return trends?.jobAvailability || 'moderate';
  }

  getFutureOutlook(category) {
    const trends = this.industryTrends[category?.toLowerCase()];
    return trends?.futureOutlook || 'stable';
  }

  getEmergingSkills(category) {
    const trends = this.industryTrends[category?.toLowerCase()];
    return trends?.emergingSkills?.slice(0, 3) || [];
  }

  calculateConfidenceScore(userAnalysis, careerMatches) {
    const avgMatchScore = careerMatches.reduce((sum, career) => sum + career.matchScore, 0) / careerMatches.length;
    const dataQuality = this.assessDataQuality(userAnalysis);
    const consistencyScore = this.assessConsistency(careerMatches);
    
    return Math.round((avgMatchScore * 0.5 + dataQuality * 0.3 + consistencyScore * 0.2));
  }

  assessDataQuality(userAnalysis) {
    let score = 50; // Base score
    
    if (userAnalysis.interests?.length > 2) score += 20;
    if (Object.keys(userAnalysis.skills).length > 3) score += 15;
    if (userAnalysis.careerReadiness > 60) score += 15;
    
    return Math.min(score, 100);
  }

  assessConsistency(careerMatches) {
    const topScores = careerMatches.slice(0, 3).map(c => c.matchScore);
    const variance = this.calculateVariance(topScores);
    
    // Lower variance = higher consistency
    return Math.max(0, 100 - variance);
  }

  calculateVariance(scores) {
    const mean = scores.reduce((sum, score) => sum + score, 0) / scores.length;
    const squaredDiffs = scores.map(score => Math.pow(score - mean, 2));
    return squaredDiffs.reduce((sum, diff) => sum + diff, 0) / scores.length;
  }

  getMarketInsights(recommendations) {
    const categories = recommendations.map(r => r.category).filter(Boolean);
    const uniqueCategories = [...new Set(categories)];
    
    return {
      trendingCareers: recommendations.slice(0, 3).map(r => r.title),
      growthSectors: uniqueCategories.filter(cat => {
        const trend = this.industryTrends[cat?.toLowerCase()];
        return trend?.growth === 'high';
      }),
      averageConfidence: Math.round(
        recommendations.reduce((sum, r) => sum + (r.confidence || 0), 0) / recommendations.length
      ),
      marketOutlook: this.getOverallMarketOutlook(uniqueCategories)
    };
  }

  getOverallMarketOutlook(categories) {
    const outlooks = categories.map(cat => {
      const trend = this.industryTrends[cat?.toLowerCase()];
      return trend?.futureOutlook || 'stable';
    });
    
    if (outlooks.includes('excellent')) return 'excellent';
    if (outlooks.includes('very good')) return 'very good';
    if (outlooks.includes('good')) return 'good';
    return 'stable';
  }

  // Fallback to rule-based system
  generateRuleBasedRecommendations(assessmentData, userProfile) {
    console.log('Using rule-based career recommendations as fallback');
    
    const analysis = this.analyzeUserRuleBased(assessmentData, userProfile);
    const careerMatches = this.matchCareersWithAI(analysis, userProfile);
    const personalizedPaths = careerMatches.map((career, index) => ({
      ...career,
      match: `${career.matchScore}%`,
      color: this.getCareerColor(index),
      personalizedRoadmap: this.generateBasicRoadmap(career),
      personalizedTips: []
    }));
    
    return {
      recommendations: personalizedPaths,
      analysis: analysis,
      confidence: 75, // Moderate confidence for rule-based
      marketInsights: this.getMarketInsights(personalizedPaths)
    };
  }
}

module.exports = AICareerAlgorithm;