#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function question(prompt) {
    return new Promise((resolve) => {
        rl.question(prompt, resolve);
    });
}

async function setup() {
    console.log('🚀 TajiConnect Career Platform Backend Setup');
    console.log('='.repeat(50));
    console.log('');

    console.log('This setup will help you configure the AI-powered career generation system.');
    console.log('');

    // Check if .env already exists
    const envPath = path.join(__dirname, '.env');
    const envExamplePath = path.join(__dirname, '.env.example');

    if (fs.existsSync(envPath)) {
        console.log('⚠️  .env file already exists.');
        const overwrite = await question('Do you want to overwrite it? (y/N): ');
        if (overwrite.toLowerCase() !== 'y' && overwrite.toLowerCase() !== 'yes') {
            console.log('Setup cancelled.');
            rl.close();
            return;
        }
    }

    console.log('');
    console.log('🤖 AI Service Configuration');
    console.log('Choose your preferred AI service for career recommendations:');
    console.log('1. OpenAI GPT (Recommended)');
    console.log('2. Google Gemini');
    console.log('3. Skip AI setup (use rule-based system only)');
    console.log('');

    const aiChoice = await question('Enter your choice (1-3): ');

    let envContent = '';

    // Copy from example
    if (fs.existsSync(envExamplePath)) {
        envContent = fs.readFileSync(envExamplePath, 'utf8');
    }

    if (aiChoice === '1') {
        console.log('');
        console.log('🔑 OpenAI Configuration');
        console.log('You need an OpenAI API key to use GPT for career analysis.');
        console.log('Get your API key from: https://platform.openai.com/api-keys');
        console.log('');

        const openaiKey = await question('Enter your OpenAI API key (or press Enter to skip): ');

        if (openaiKey.trim()) {
            envContent = envContent.replace(
                'OPENAI_API_KEY=sk-your-openai-api-key-here',
                `OPENAI_API_KEY=${openaiKey.trim()}`
            );
            console.log('✅ OpenAI API key configured');
        } else {
            console.log('⚠️  Skipping OpenAI configuration - will use fallback system');
        }

    } else if (aiChoice === '2') {
        console.log('');
        console.log('🔑 Google Gemini Configuration');
        console.log('You need a Google AI API key to use Gemini for career analysis.');
        console.log('Get your API key from: https://makersuite.google.com/app/apikey');
        console.log('');

        const geminiKey = await question('Enter your Gemini API key (or press Enter to skip): ');

        if (geminiKey.trim()) {
            envContent = envContent.replace(
                'GEMINI_API_KEY=AIza-your-gemini-api-key-here',
                `GEMINI_API_KEY=${geminiKey.trim()}`
            );
            console.log('✅ Gemini API key configured');
        } else {
            console.log('⚠️  Skipping Gemini configuration - will use fallback system');
        }

    } else {
        console.log('⚠️  Skipping AI configuration - will use rule-based system only');
    }

    console.log('');
    console.log('⚙️  Server Configuration');

    const port = await question('Server port (default: 3001): ');
    if (port.trim()) {
        envContent = envContent.replace('PORT=3001', `PORT=${port.trim()}`);
    }

    // Write .env file
    fs.writeFileSync(envPath, envContent);

    console.log('');
    console.log('✅ Configuration saved to .env file');
    console.log('');

    // Test the configuration
    console.log('🧪 Testing configuration...');

    try {
        require('dotenv').config();
        const AICareerAlgorithm = require('./career-algorithm');
        const algorithm = new AICareerAlgorithm();

        console.log('✅ AI Career Algorithm loaded successfully');

        if (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY.startsWith('sk-')) {
            console.log('✅ OpenAI API key detected');
        } else if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.startsWith('AIza')) {
            console.log('✅ Gemini API key detected');
        } else {
            console.log('⚠️  No valid AI API key detected - will use rule-based fallback');
        }

    } catch (error) {
        console.log('❌ Configuration test failed:', error.message);
    }

    console.log('');
    console.log('🎉 Setup complete!');
    console.log('');
    console.log('Next steps:');
    console.log('1. Install dependencies: npm install');
    console.log('2. Start the server: npm start');
    console.log('3. Test the API: node test-ai-algorithm.js');
    console.log('');
    console.log('The server will be available at: http://localhost:' + (port.trim() || '3001'));
    console.log('');

    rl.close();
}

// Handle Ctrl+C gracefully
rl.on('SIGINT', () => {
    console.log('\n\nSetup cancelled by user.');
    rl.close();
    process.exit(0);
});

// Run setup
setup().catch(error => {
    console.error('Setup failed:', error);
    rl.close();
    process.exit(1);
});