const fs = require('fs');
const path = require('path');
const AICareerAlgorithm = require('../career-algorithm');

class CareerGenerationService {
  constructor() {
    this.dbPath = path.join(__dirname, '../db.json');
    this.careerDatabase = this.loadCareerDatabase();
    this.skillsMatrix = this.loadSkillsMatrix();
    this.aiAlgorithm = new AICareerAlgorithm();
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

  saveToDatabase(data) {
    try {
      fs.writeFileSync(this.dbPath, JSON.stringify(data, null, 2));
      return true;
    } catch (error) {
      console.error('Error saving to database:', error);
      return false;
    }
  }

  loadSkillsMatrix() {
    return {
      'technology': {
        skills: ['Programming', 'Data Analysis', 'System Design', 'Cloud Computing', 'Cybersecurity'],
        careers: ['Software Developer', 'Data Scientist', 'DevOps Engineer', 'Security Analyst', 'Cloud Architect']
      },
      'creative': {
        skills: ['Graphic Design', 'Content Creation', 'Video Editing', 'UI/UX Design', 'Digital Marketing'],
        careers: ['Graphic Designer', 'Content Creator', 'Video Producer', 'UX Designer', 'Digital Marketer']
      },
      'business': {
        skills: ['Project Management', 'Financial Analysis', 'Strategic Planning', 'Leadership', 'Sales'],
        careers: ['Project Manager', 'Business Analyst', 'Strategy Consultant', 'Team Lead', 'Sales Manager']
      },
      'healthcare': {
        skills: ['Patient Care', 'Medical Knowledge', 'Research', 'Communication', 'Problem Solving'],
        careers: ['Nurse', 'Medical Researcher', 'Healthcare Administrator', 'Therapist', 'Public Health Specialist']
      },
      'education': {
        skills: ['Teaching', 'Curriculum Development', 'Communication', 'Mentoring', 'Assessment'],
        careers: ['Teacher', 'Curriculum Designer', 'Educational Consultant', 'Training Specialist', 'Academic Advisor']
      }
    };
  }

  // AI-powered career matching algorithm
  async generateCareerRecommendations(assessmentData, userProfile) {
    try {
      // Use AI algorithm for advanced career recommendations
      const aiResult = await this.aiAlgorithm.generateAICareerRecommendations(assessmentData, userProfile);
      
      return {
        recommendations: aiResult.recommendations,
        analysis: aiResult.analysis,
        confidence: aiResult.confidence,
        marketInsights: aiResult.marketInsights,
        aiGenerated: true
      };
    } catch (error) {
      console.error('AI career generation failed, using fallback:', error);
      
      // Fallback to original rule-based system
      const { answers, userId } = assessmentData;
      
      // Analyze assessment responses
      const interests = this.analyzeInterests(answers);
      const skills = this.analyzeSkills(answers);
      const values = this.analyzeValues(answers);
      const personality = this.analyzePersonality(answers);
      
      // Generate career matches
      const careerMatches = this.matchCareers(interests, skills, values, personality);
      
      // Create personalized career paths
      const personalizedPaths = this.createPersonalizedPaths(careerMatches, userProfile);
      
      return {
        recommendations: personalizedPaths,
        analysis: {
          interests,
          skills,
          values,
          personality
        },
        confidence: 70,
        aiGenerated: false
      };
    }
  }

  analyzeInterests(answers) {
    const interestMap = {
      'Corporate office': ['business', 'finance'],
      'Remote/flexible': ['technology', 'creative'],
      'Field work': ['healthcare', 'research'],
      'Laboratory/research': ['science', 'technology'],
      'Creative studio': ['creative', 'design'],
      'Problem solving': ['technology', 'engineering'],
      'Creative design': ['creative', 'arts'],
      'Teaching others': ['education', 'training'],
      'Data analysis': ['technology', 'business'],
      'Leading teams': ['business', 'management'],
      'Helping people': ['healthcare', 'education']
    };

    const interests = {};
    Object.values(answers).forEach(answer => {
      if (Array.isArray(answer)) {
        answer.forEach(item => {
          if (interestMap[item]) {
            interestMap[item].forEach(interest => {
              interests[interest] = (interests[interest] || 0) + 1;
            });
          }
        });
      } else if (typeof answer === 'string' && interestMap[answer]) {
        interestMap[answer].forEach(interest => {
          interests[interest] = (interests[interest] || 0) + 1;
        });
      }
    });

    return Object.entries(interests)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([interest, score]) => ({ interest, score }));
  }

  analyzeSkills(answers) {
    const skillLevels = {};
    
    // Extract skill-related answers
    Object.entries(answers).forEach(([questionId, answer]) => {
      if (questionId === '4') { // Communication skills
        skillLevels['Communication'] = answer * 20;
      } else if (questionId === '5') { // Technical skills
        if (Array.isArray(answer)) {
          answer.forEach(skill => {
            skillLevels[skill] = 70; // Base level for selected skills
          });
        }
      } else if (questionId === '6') { // Public speaking
        skillLevels['Public Speaking'] = answer * 20;
      }
    });

    return skillLevels;
  }

  analyzeValues(answers) {
    const values = {};
    
    Object.entries(answers).forEach(([questionId, answer]) => {
      if (questionId === '7') { // Career importance
        values['primary'] = answer;
      } else if (questionId === '8') { // Salary importance
        values['salaryImportance'] = answer * 20;
      }
    });

    return values;
  }

  analyzePersonality(answers) {
    const personality = {};
    
    Object.entries(answers).forEach(([questionId, answer]) => {
      if (questionId === '9') { // Work preference
        personality['workStyle'] = answer;
      } else if (questionId === '10') { // Stress handling
        personality['stressHandling'] = answer * 20;
      }
    });

    return personality;
  }

  matchCareers(interests, skills, values, personality) {
    const allCareers = [
      {
        title: 'Software Developer',
        category: 'technology',
        match: 0,
        description: 'Design and develop software applications',
        requiredSkills: ['Programming', 'Problem solving', 'Technical analysis'],
        salaryRange: 'KSh 100,000 - 200,000',
        growth: 'High demand',
        workStyle: ['Independently', 'Small teams'],
        values: ['Career growth', 'High salary']
      },
      {
        title: 'Data Scientist',
        category: 'technology',
        match: 0,
        description: 'Analyze complex data to help businesses make decisions',
        requiredSkills: ['Data analysis', 'Statistics', 'Programming'],
        salaryRange: 'KSh 120,000 - 250,000',
        growth: 'Very high demand',
        workStyle: ['Independently', 'Small teams'],
        values: ['Career growth', 'High salary']
      },
      {
        title: 'UX Designer',
        category: 'creative',
        match: 0,
        description: 'Design user experiences for digital products',
        requiredSkills: ['Design thinking', 'User research', 'Prototyping'],
        salaryRange: 'KSh 90,000 - 180,000',
        growth: 'Growing field',
        workStyle: ['Small teams', 'Mix of both'],
        values: ['Work-life balance', 'Making an impact']
      },
      {
        title: 'Digital Marketing Manager',
        category: 'business',
        match: 0,
        description: 'Plan and execute digital marketing campaigns',
        requiredSkills: ['Marketing', 'Communication', 'Creative thinking'],
        salaryRange: 'KSh 80,000 - 150,000',
        growth: 'Growing field',
        workStyle: ['Small teams', 'Large teams'],
        values: ['Career growth', 'Making an impact']
      },
      {
        title: 'Project Manager',
        category: 'business',
        match: 0,
        description: 'Lead and coordinate project teams to deliver results',
        requiredSkills: ['Leadership', 'Communication', 'Organization'],
        salaryRange: 'KSh 110,000 - 200,000',
        growth: 'Stable demand',
        workStyle: ['Large teams', 'Leadership role'],
        values: ['Career growth', 'Leadership']
      },
      {
        title: 'Cybersecurity Analyst',
        category: 'technology',
        match: 0,
        description: 'Protect organizations from cyber threats',
        requiredSkills: ['Security protocols', 'Risk assessment', 'Technical analysis'],
        salaryRange: 'KSh 130,000 - 220,000',
        growth: 'Very high demand',
        workStyle: ['Independently', 'Small teams'],
        values: ['Job security', 'High salary']
      }
    ];

    // Calculate match scores
    allCareers.forEach(career => {
      let score = 0;

      // Interest matching (40% weight)
      interests.forEach(({ interest, score: interestScore }) => {
        if (career.category === interest) {
          score += (interestScore / interests.length) * 40;
        }
      });

      // Skills matching (30% weight)
      const userSkills = Object.keys(skills);
      const matchingSkills = career.requiredSkills.filter(skill => 
        userSkills.some(userSkill => 
          userSkill.toLowerCase().includes(skill.toLowerCase()) ||
          skill.toLowerCase().includes(userSkill.toLowerCase())
        )
      );
      score += (matchingSkills.length / career.requiredSkills.length) * 30;

      // Work style matching (20% weight)
      if (career.workStyle.includes(personality.workStyle)) {
        score += 20;
      }

      // Values matching (10% weight)
      if (career.values.includes(values.primary)) {
        score += 10;
      }

      career.match = Math.min(Math.round(score), 100);
    });

    return allCareers
      .sort((a, b) => b.match - a.match)
      .slice(0, 5);
  }

  createPersonalizedPaths(careerMatches, userProfile) {
    return careerMatches.map((career, index) => ({
      ...career,
      match: `${career.match}%`,
      color: this.getCareerColor(index),
      personalizedRoadmap: this.generateRoadmap(career, userProfile)
    }));
  }

  getCareerColor(index) {
    const colors = [
      'bg-blue-600',
      'bg-green-600',
      'bg-purple-600',
      'bg-orange-600',
      'bg-red-600'
    ];
    return colors[index] || 'bg-gray-600';
  }

  generateRoadmap(career, userProfile) {
    const baseRoadmaps = {
      'Software Developer': [
        {
          phase: 'Foundation',
          duration: '2-3 months',
          skills: ['HTML/CSS', 'JavaScript Basics', 'Git/Version Control'],
          milestones: ['Build first webpage', 'Complete JavaScript course', 'Create GitHub profile']
        },
        {
          phase: 'Intermediate',
          duration: '3-4 months',
          skills: ['React/Vue.js', 'Backend Basics', 'Database Fundamentals'],
          milestones: ['Build interactive web app', 'Create REST API', 'Deploy first project']
        },
        {
          phase: 'Advanced',
          duration: '4-6 months',
          skills: ['Full-stack Development', 'Testing', 'DevOps Basics'],
          milestones: ['Complete full-stack project', 'Implement CI/CD', 'Contribute to open source']
        },
        {
          phase: 'Professional',
          duration: '2-3 months',
          skills: ['System Design', 'Code Review', 'Team Collaboration'],
          milestones: ['Build portfolio', 'Practice interviews', 'Apply for positions']
        }
      ],
      'Data Scientist': [
        {
          phase: 'Foundation',
          duration: '3-4 months',
          skills: ['Python/R', 'Statistics', 'Data Manipulation'],
          milestones: ['Complete Python course', 'Learn pandas/numpy', 'First data analysis project']
        },
        {
          phase: 'Intermediate',
          duration: '4-5 months',
          skills: ['Machine Learning', 'Data Visualization', 'SQL'],
          milestones: ['Build ML model', 'Create data dashboard', 'Database projects']
        },
        {
          phase: 'Advanced',
          duration: '5-6 months',
          skills: ['Deep Learning', 'Big Data Tools', 'MLOps'],
          milestones: ['Neural network project', 'Work with big datasets', 'Deploy ML model']
        },
        {
          phase: 'Professional',
          duration: '2-3 months',
          skills: ['Business Intelligence', 'Communication', 'Domain Expertise'],
          milestones: ['Business case study', 'Present findings', 'Build portfolio']
        }
      ],
      'UX Designer': [
        {
          phase: 'Foundation',
          duration: '2-3 months',
          skills: ['Design Principles', 'User Research', 'Wireframing'],
          milestones: ['Complete design course', 'First user research', 'Create wireframes']
        },
        {
          phase: 'Intermediate',
          duration: '3-4 months',
          skills: ['Prototyping', 'Design Tools', 'Usability Testing'],
          milestones: ['Interactive prototype', 'Master design tools', 'Conduct user tests']
        },
        {
          phase: 'Advanced',
          duration: '4-5 months',
          skills: ['Design Systems', 'Advanced Prototyping', 'Collaboration'],
          milestones: ['Create design system', 'Complex prototype', 'Team project']
        },
        {
          phase: 'Professional',
          duration: '2-3 months',
          skills: ['Portfolio Development', 'Case Studies', 'Presentation'],
          milestones: ['Complete portfolio', 'Document case studies', 'Practice presentations']
        }
      ]
    };

    const roadmap = baseRoadmaps[career.title] || this.generateGenericRoadmap(career);
    
    // Personalize based on user profile
    return this.personalizeRoadmap(roadmap, userProfile);
  }

  generateGenericRoadmap(career) {
    return [
      {
        phase: 'Foundation',
        duration: '2-3 months',
        skills: career.requiredSkills.slice(0, 2),
        milestones: ['Complete basic training', 'First practical project']
      },
      {
        phase: 'Intermediate',
        duration: '3-4 months',
        skills: career.requiredSkills.slice(2, 4),
        milestones: ['Intermediate project', 'Skill certification']
      },
      {
        phase: 'Advanced',
        duration: '4-5 months',
        skills: career.requiredSkills,
        milestones: ['Advanced project', 'Portfolio development']
      },
      {
        phase: 'Professional',
        duration: '2-3 months',
        skills: ['Professional skills', 'Industry knowledge'],
        milestones: ['Job preparation', 'Network building']
      }
    ];
  }

  personalizeRoadmap(roadmap, userProfile) {
    // Adjust timeline based on user's availability and background
    const adjustmentFactor = this.calculateAdjustmentFactor(userProfile);
    
    return roadmap.map(phase => ({
      ...phase,
      duration: this.adjustDuration(phase.duration, adjustmentFactor),
      personalizedTips: this.generatePersonalizedTips(phase, userProfile)
    }));
  }

  calculateAdjustmentFactor(userProfile) {
    let factor = 1.0;
    
    // Adjust based on education level
    if (userProfile?.education?.level === 'Bachelor\'s degree') {
      factor *= 0.8; // Faster progression
    } else if (userProfile?.education?.level === 'High school') {
      factor *= 1.2; // Slower progression
    }
    
    // Adjust based on age (younger learners might need more time)
    if (userProfile?.age && userProfile.age < 20) {
      factor *= 1.1;
    }
    
    return factor;
  }

  adjustDuration(duration, factor) {
    const [min, max] = duration.split('-').map(d => parseInt(d.split(' ')[0]));
    const adjustedMin = Math.ceil(min * factor);
    const adjustedMax = Math.ceil(max * factor);
    return `${adjustedMin}-${adjustedMax} months`;
  }

  generatePersonalizedTips(phase, userProfile) {
    const tips = [];
    
    if (userProfile?.isPWD) {
      tips.push('Consider accessibility tools and resources available for your learning style');
    }
    
    if (userProfile?.age && userProfile.age < 18) {
      tips.push('Focus on building strong fundamentals - you have time to master each skill');
    }
    
    if (phase.phase === 'Foundation') {
      tips.push('Start with small, achievable goals to build confidence');
    }
    
    return tips;
  }

  async saveCareerAssessment(userId, assessmentData, recommendations) {
    const db = this.loadCareerDatabase();
    
    // Save assessment
    const assessment = {
      id: Date.now().toString(),
      userId: userId,
      type: 'career',
      title: 'AI-Generated Career Assessment',
      status: 'completed',
      score: recommendations.recommendations[0]?.match || '0%',
      results: {
        primaryInterest: recommendations.analysis.interests[0]?.interest || 'Technology',
        secondaryInterest: recommendations.analysis.interests[1]?.interest || 'Business',
        recommendedPaths: recommendations.recommendations.map(r => r.title),
        strengths: Object.keys(recommendations.analysis.skills).slice(0, 3),
        areasForImprovement: ['Communication', 'Leadership'], // Default areas
        aiGenerated: true,
        fullAnalysis: recommendations.analysis
      },
      completedAt: new Date().toISOString()
    };
    
    if (!db.assessments) db.assessments = [];
    db.assessments.push(assessment);
    
    // Save personalized roadmaps
    recommendations.recommendations.forEach((career, index) => {
      const roadmap = {
        id: `${Date.now()}_${index}`,
        userId: userId,
        title: `${career.title} Career Path`,
        description: `AI-generated personalized roadmap for ${career.title}`,
        careerTitle: career.title,
        matchScore: career.match,
        phases: career.personalizedRoadmap,
        totalDuration: this.calculateTotalDuration(career.personalizedRoadmap),
        status: index === 0 ? 'active' : 'available', // First recommendation is active
        createdAt: new Date().toISOString(),
        aiGenerated: true
      };
      
      if (!db.roadmaps) db.roadmaps = [];
      db.roadmaps.push(roadmap);
    });
    
    this.saveToDatabase(db);
    return { assessment, roadmaps: recommendations.recommendations };
  }

  calculateTotalDuration(phases) {
    let totalMonths = 0;
    phases.forEach(phase => {
      const [min, max] = phase.duration.split('-').map(d => parseInt(d.split(' ')[0]));
      totalMonths += Math.ceil((min + max) / 2);
    });
    return `${totalMonths} months`;
  }

  // Get user's career roadmaps
  getUserRoadmaps(userId) {
    const db = this.loadCareerDatabase();
    return db.roadmaps?.filter(roadmap => roadmap.userId.toString() === userId.toString()) || [];
  }

  // Update roadmap progress
  updateRoadmapProgress(roadmapId, phaseIndex, progress) {
    const db = this.loadCareerDatabase();
    const roadmap = db.roadmaps?.find(r => r.id === roadmapId);
    
    if (roadmap && roadmap.phases[phaseIndex]) {
      if (!roadmap.phases[phaseIndex].progress) {
        roadmap.phases[phaseIndex].progress = {};
      }
      roadmap.phases[phaseIndex].progress = { ...roadmap.phases[phaseIndex].progress, ...progress };
      roadmap.updatedAt = new Date().toISOString();
      
      this.saveToDatabase(db);
      return roadmap;
    }
    
    return null;
  }
}

module.exports = CareerGenerationService;