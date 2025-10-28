const AICareerAlgorithm = require('./career-algorithm');

// Test the AI Career Algorithm
async function testAIAlgorithm() {
  console.log('🧪 Testing AI Career Algorithm...\n');
  
  const algorithm = new AICareerAlgorithm();
  
  // Mock assessment data
  const assessmentData = {
    answers: {
      1: 'Remote/flexible',
      2: 4, // Technology interest (1-5 scale)
      3: ['Problem solving', 'Data analysis'], // Activities
      4: 4, // Communication skills
      5: ['Programming'], // Technical skills
      6: 3, // Public speaking
      7: 'Career growth', // Career importance
      8: 4, // Salary importance
      9: 'Small teams', // Work preference
      10: 4 // Stress handling
    },
    userId: 'test-user-1'
  };
  
  // Mock user profile
  const userProfile = {
    id: 'test-user-1',
    age: 22,
    education: { level: 'Bachelor\'s degree' },
    isPWD: false,
    hobbies: ['Programming', 'Gaming', 'Reading'],
    talents: ['Problem solving', 'Analytical thinking']
  };
  
  try {
    console.log('📊 Assessment Data:');
    console.log(JSON.stringify(assessmentData, null, 2));
    console.log('\n👤 User Profile:');
    console.log(JSON.stringify(userProfile, null, 2));
    
    console.log('\n🤖 Generating AI Career Recommendations...');
    const startTime = Date.now();
    
    const result = await algorithm.generateAICareerRecommendations(assessmentData, userProfile);
    
    const endTime = Date.now();
    console.log(`⏱️  Processing time: ${endTime - startTime}ms\n`);
    
    console.log('✅ Results:');
    console.log(`🎯 Confidence Score: ${result.confidence}%`);
    console.log(`🤖 AI Generated: ${result.aiGenerated || 'Using fallback system'}`);
    
    console.log('\n📈 Top Career Recommendations:');
    result.recommendations.slice(0, 3).forEach((career, index) => {
      console.log(`\n${index + 1}. ${career.title} (${career.match} match)`);
      console.log(`   📝 ${career.description}`);
      console.log(`   💰 ${career.salaryRange || career.averageSalary || 'Salary not specified'}`);
      console.log(`   📊 Growth: ${career.growth || 'Not specified'}`);
      
      if (career.reasoning && career.reasoning.length > 0) {
        console.log(`   🎯 Why this matches:`);
        career.reasoning.forEach(reason => {
          console.log(`      • ${reason}`);
        });
      }
      
      if (career.personalizedRoadmap && career.personalizedRoadmap.length > 0) {
        console.log(`   🗺️  Roadmap: ${career.personalizedRoadmap.length} phases`);
        career.personalizedRoadmap.forEach(phase => {
          console.log(`      📚 ${phase.phase}: ${phase.duration} - ${phase.skills?.slice(0, 2).join(', ')}`);
        });
      }
    });
    
    console.log('\n🧠 User Analysis:');
    if (result.analysis.personality) {
      console.log(`   Personality: ${result.analysis.personality.type} (${result.analysis.personality.traits?.join(', ')})`);
    }
    if (result.analysis.interests) {
      console.log(`   Top Interests: ${result.analysis.interests.slice(0, 3).map(i => `${i.category} (${i.score}%)`).join(', ')}`);
    }
    if (result.analysis.learningStyle) {
      console.log(`   Learning Style: ${result.analysis.learningStyle}`);
    }
    
    if (result.marketInsights) {
      console.log('\n📊 Market Insights:');
      console.log(`   Overall Outlook: ${result.marketInsights.marketOutlook}`);
      console.log(`   Average Confidence: ${result.marketInsights.averageConfidence}%`);
      if (result.marketInsights.trendingCareers) {
        console.log(`   Trending Careers: ${result.marketInsights.trendingCareers.join(', ')}`);
      }
    }
    
    console.log('\n✅ Test completed successfully!');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
    console.error(error.stack);
  }
}

// Test with different user profiles
async function runMultipleTests() {
  console.log('🔄 Running multiple test scenarios...\n');
  
  const testCases = [
    {
      name: 'Young Tech Enthusiast',
      profile: {
        id: 'test-1',
        age: 18,
        education: { level: 'High school' },
        isPWD: false,
        hobbies: ['Programming', 'Gaming'],
        talents: ['Problem solving']
      },
      answers: {
        1: 'Remote/flexible',
        2: 5,
        3: ['Problem solving', 'Data analysis'],
        4: 3,
        5: ['Programming'],
        6: 2,
        7: 'Career growth',
        8: 4,
        9: 'Independently',
        10: 4
      }
    },
    {
      name: 'Creative Professional',
      profile: {
        id: 'test-2',
        age: 25,
        education: { level: 'Bachelor\'s degree' },
        isPWD: false,
        hobbies: ['Design', 'Art', 'Photography'],
        talents: ['Creativity', 'Visual design']
      },
      answers: {
        1: 'Creative studio',
        2: 3,
        3: ['Creative design', 'Teaching others'],
        4: 4,
        5: ['Graphic design', 'Digital marketing'],
        6: 4,
        7: 'Work-life balance',
        8: 3,
        9: 'Small teams',
        10: 3
      }
    }
  ];
  
  const algorithm = new AICareerAlgorithm();
  
  for (const testCase of testCases) {
    console.log(`\n🧪 Testing: ${testCase.name}`);
    console.log('=' .repeat(50));
    
    try {
      const result = await algorithm.generateAICareerRecommendations(
        { answers: testCase.answers, userId: testCase.profile.id },
        testCase.profile
      );
      
      console.log(`✅ Generated ${result.recommendations.length} recommendations`);
      console.log(`🎯 Top match: ${result.recommendations[0]?.title} (${result.recommendations[0]?.match})`);
      console.log(`🤖 Confidence: ${result.confidence}%`);
      
    } catch (error) {
      console.error(`❌ Failed for ${testCase.name}:`, error.message);
    }
  }
}

// Run the tests
if (require.main === module) {
  testAIAlgorithm()
    .then(() => runMultipleTests())
    .then(() => {
      console.log('\n🎉 All tests completed!');
      process.exit(0);
    })
    .catch(error => {
      console.error('💥 Test suite failed:', error);
      process.exit(1);
    });
}

module.exports = { testAIAlgorithm, runMultipleTests };