Tajiconnect V2 – Onboarding Psychometric Test Design
🎯 Purpose of the Onboarding Psychometric Test
The onboarding psychometric flow is not an exam. Its role is to:
Reduce cognitive load for new users
Understand motivation, ability, and constraints
Personalize learning paths immediately
Increase early retention (first 7 days)
Design principles:
Maximum 2–3 minutes to complete
Conversational, friendly tone
No right or wrong answers
Visual + tap-based (no typing where possible)
🧠 Psychometric Model Used (Simple & Practical)
We combine 3 lightweight dimensions:
Motivation (WHY) – why the learner is here
Capability (WHERE) – current skill level
Behavior (HOW) – learning style & time availability
This is inspired by:
Self-Determination Theory (intrinsic vs extrinsic motivation)
Learning style preference models (simplified)
Behavioral segmentation (time + commitment)

🧩 Flow Structure (6-Step Max)
Welcome & reassurance
Motivation discovery
Skill baseline
Learning preference
Time & commitment
Language focus & personalization
Each step = 1 question per screen

1️⃣ Welcome Screen (Non-scored)
Goal: Reduce anxiety and build trust
UI copy:
"Let’s personalize your learning experience. This will take less than 2 minutes."
Button:
👉 Start
(No data collected here)

2️⃣ Motivation Psychometric (WHY)
Question 1:
What’s your main reason for learning this language?
Options (tap cards):
🎓 School or exams
✈️ Travel or relocation
🌍 Culture & heritage
💬 Communication with people
❤️ Personal interest / fun
Psychometric signal captured:
Extrinsic vs intrinsic motivation
Goal-oriented vs curiosity-driven learner
Used to:
Adjust messaging tone
Choose content framing (practical vs cultural)

3️⃣ Skill Baseline (WHERE)
Question 2:
How familiar are you with this language?
Options:
🌱 I’m completely new
🌿 I know a few words
🌳 I can hold simple conversations
🌲 I’m comfortable but want to improve
Psychometric signal:
Confidence level
Entry difficulty tolerance
Used to:
Place learner into Beginner / Intermediate
Avoid frustration or boredom

4️⃣ Learning Style Preference (HOW – Cognitive)
Question 3:
How do you enjoy learning the most?
Options (icons):
🎥 Watching short videos
🎧 Listening to audio
📖 Reading examples & stories
🔄 A mix of everything
Psychometric signal:
Dominant sensory preference
Used to:
Content ordering
Default lesson format

5️⃣ Time & Commitment (HOW – Behavioral)
Question 4:
How much time can you realistically spend learning?
Options:
⏱️ 5–10 minutes a day
⏰ 15–30 minutes a day
📆 A few times a week
⚡ It depends on my schedule
Psychometric signal:
Consistency potential
Burnout risk
Used to:
Notification frequency
Lesson size

6️⃣ Language Focus & Context
Question 5:
Which language do you want to focus on first?
Options:
Swahili
Yoruba
Amharic
Hausa
Igbo
Zulu
Other (later)
Psychometric signal:
Cultural interest
Used to:
Default course assignment

🧮 Scoring Logic (Very Lightweight)
Instead of numeric scores, we use tags:
Example user profile:
{
  "motivation": "culture",
  "level": "beginner",
  "learning_style": "audio",
  "time_commitment": "short_daily",
  "language": "swahili"
}

No visible scores shown to the user.

🧭 Learner Archetypes (Auto-generated)
Based on answers, users fall into soft personas:
🎓 Structured Learner (school + regular time)
🌍 Cultural Explorer (heritage + stories)
⚡ Casual Learner (short time + mixed style)
💬 Conversational Learner (communication-focused)
Used only internally for personalization.

🎨 UX & Flow Guidelines
One question per screen
Progress indicator (5 dots)
Large tap targets (mobile-first)
Friendly illustrations (African-inspired)
Allow skip (but discourage)

🔐 Privacy & Trust Copy (Important)
At the end:
"Your answers help us personalize your experience. We never sell your data."

✅ Final Outcome for the User
After onboarding:
Land directly on a recommended course
See a clear starting lesson
Feel understood, not tested

🚀 V2 Advantage
This psychometric flow:
Requires zero AI initially
Works with Google Drive content
Scales into AI personalization later
Is culturally sensitive & beginner-friendly

If needed next:
Wireframe sketches (Figma-ready)
JSON schema for backend storage
Logic for Firebase / Firestore
A/B testing variants

📋 Onboarding Templates (Copy‑Paste Ready)
Below are ready-to-use onboarding templates you can plug directly into portal.tajiconnect.com. These are written for AI‑assisted personalization, fast completion, and low drop‑off.
Each template includes:
UI copy (what the user sees)
Input type
Data tag saved
How AI uses it

🟢 TEMPLATE A: Ultra‑Fast Onboarding (V2 Default – 90 seconds)
Use when: You want maximum completion and speed
Screen 0 – Welcome
Copy:
Welcome to Tajiconnect 👋
Let’s personalize your learning experience. This takes less than 2 minutes.
CTA: Start learning

Screen 1 – Motivation
Question:
Why do you want to learn this language?
Options (cards):
🎓 School / Exams
🌍 Culture & heritage
💬 Communication
✈️ Travel
❤️ Personal interest
Save as: motivation
AI use: Adjusts tone, examples, and lesson framing

Screen 2 – Level
Question:
How would you describe your current level?
Options:
🌱 New learner
🌿 Know a few words
🌳 Can form sentences
Save as: level
AI use: Difficulty calibration

Screen 3 – Learning Style
Question:
How do you prefer to learn?
Options:
🎧 Listening
🎥 Watching
📖 Reading
🔄 A mix
Save as: learning_style
AI use: Content ordering

Screen 4 – Time
Question:
How much time can you spend learning?
Options:
⏱️ 5–10 min/day
⏰ 15–30 min/day
📆 Few times a week
Save as: time_commitment
AI use: Lesson size & notifications

Screen 5 – Language Choice
Question:
Which language do you want to start with?
Options: Swahili, Yoruba, Amharic, Hausa, Igbo, Zulu
Save as: target_language

End Copy:
🎉 All set! Your learning path is ready.
➡ Redirect to personalized dashboard

🔵 TEMPLATE B: AI‑Driven Smart Onboarding (Recommended for Logged‑in Users)
Use when: You want stronger personalization (still under 3 minutes)
Adds 2 psychometric signals without friction.

Extra Screen – Learning Goal Type
Question:
What matters most to you right now?
Options:
Speaking confidently
Understanding conversations
Cultural knowledge
Exams & structure
Save as: learning_goal
AI use: Lesson sequencing + practice type

Extra Screen – Confidence
Question:
How confident do you feel learning languages?
Options:
😬 I need guidance
🙂 I’m okay
💪 Very confident
Save as: confidence_level
AI use: Tutor tone (encouraging vs direct)

🟣 TEMPLATE C: Conversational AI Onboarding (Future‑Ready)
Use when: AI chat is enabled during onboarding
Format: Chat‑style instead of screens
AI Prompt Style:
“Hi! I’ll help you get started. What made you want to learn this language?”
AI extracts:
Motivation
Level
Time
Language
Advantages:
Feels human
Higher emotional engagement
V2 Tip: Start with templates A or B, migrate later.

🧠 How AI Uses Onboarding Templates (Behind the Scenes)
Example Learner Profile
{
  "motivation": "culture",
  "level": "beginner",
  "learning_style": "audio",
  "time_commitment": "short",
  "target_language": "swahili",
  "confidence_level": "low"
}

AI Outputs
Recommended first course
Lesson format priority
Notification schedule
Tutor tone & vocabulary

🎨 UX Rules for All Templates
One question per screen
Visible progress indicator
Allow skip (but confirm)
Large buttons (mobile‑first)
African‑inspired visual language

✅ Recommendation for V2 Launch
👉 Use TEMPLATE A for first launch (fastest)
👉 Enable TEMPLATE B for logged‑in users or A/B testing
👉 Keep TEMPLATE C for V3 AI expansion




