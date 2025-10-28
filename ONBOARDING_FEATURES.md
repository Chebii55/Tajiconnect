# TFLMS Enhanced Onboarding System

## Overview

The TFLMS (Taji Fanisi Learning Management System) has been enhanced with a comprehensive onboarding system that aligns with TFDN's mission to provide inclusive, accessible, and rights-based education. This document outlines all the new features implemented.

## Key Features Implemented

### 1. Legal Documentation

#### Terms of Service (`frontend/src/constants/legalDocuments.ts`)
- Comprehensive Terms of Service based on TFDN's mission and values
- Covers:
  - About TFDN (Vision, Mission, Core Values)
  - Eligibility and age requirements
  - PWD-specific considerations
  - Use of services and prohibited activities
  - Educational content and intellectual property
  - Data collection and privacy overview
  - Parental rights and child protection (Children's Act 2022 compliance)
  - AI and technology use with ethical AI commitment
  - Payment and fees (with focus on free services for vulnerable groups)
  - Termination rights
  - Governing law (Republic of Kenya)

#### Privacy Policy (`frontend/src/constants/legalDocuments.ts`)
- Detailed Privacy Policy compliant with:
  - Kenya's Data Protection Act, 2019
  - Children's Act, 2022
  - International data protection standards
  - HRBA (Human Rights-Based Approach) principles

- Covers:
  - What information is collected (Personal, Educational, Career, Disability, Parent/Guardian, Technical, Multimedia)
  - How information is collected (Direct, Automated, Third-party)
  - How information is used (Educational services, Program delivery, Support and safety, Communication, Research, Compliance)
  - Legal basis for processing
  - Data sharing and disclosure policies
  - Data protection and security measures
  - User rights under Data Protection Act
  - Children's privacy protections
  - Data retention policies
  - International data transfers
  - Cookies and tracking
  - Newsletter and communications
  - Sensitive personal data handling
  - Contact information and supervisory authority

### 2. Legal Document Modal Component

**File:** `frontend/src/components/legal/LegalDocumentModal.tsx`

Features:
- Scrollable modal with markdown rendering
- Requires users to scroll to bottom before accepting
- Visual indicator showing scroll progress
- Two modes:
  - View mode (for reading anytime)
  - Acceptance mode (required during onboarding)
- Responsive design with gradient header
- Smooth scrolling and animations

### 3. Enhanced Profile Setup Component

**File:** `frontend/src/components/onboarding/EnhancedProfileSetup.tsx`

This is a comprehensive 4-section onboarding form that collects:

#### Section 1: Basic Information & Legal Acceptance
- First Name, Last Name (required)
- Email Address (required, pre-filled from registration)
- Phone Number
- Gender (optional)
- Interests (multi-select from 15 categories)
- **Terms of Service acceptance** (required) - clickable link opens modal
- **Privacy Policy acceptance** (required) - clickable link opens modal

**Logic:** User must accept both Terms and Privacy Policy to proceed.

#### Section 2: Accessibility & Support
- **PWD Status:** Checkbox to indicate if user is a Person with Disability
- **Impairment Type:** Required dropdown if PWD status is checked
  - Visual Impairment
  - Hearing Impairment
  - Physical/Mobility Impairment
  - Intellectual/Learning Disability
  - Speech and Language Impairment
  - Autism Spectrum Disorder
  - Multiple Disabilities
  - Other

- **Parent/Guardian Information** (conditionally displayed)
  - Shows if: `age < 18 OR isPWD === true`
  - Fields: Name, Email, Phone, Relationship (all required when shown)
  - Visual indicator explains why information is required

**Logic:**
- Parent/Guardian section automatically appears for users under 18
- Parent/Guardian section automatically appears for all PWD users
- All parent/guardian fields become required when section is visible

#### Section 3: Education & Profile Photo
- **Profile Photo Upload:**
  - Passport-size photo
  - Max file size: 5MB
  - Accepts: JPG, PNG
  - Shows preview after upload

- **Current Education Level** (required dropdown):
  - Primary Education
  - Junior Secondary School (JSS)
  - Senior Secondary School
  - Technical and Vocational Education and Training (TVET)
  - University Undergraduate
  - University Graduate
  - Postgraduate
  - Other

- **Education Documents:**
  - Multi-file upload
  - Accepts: PDF, JPG, PNG
  - Max file size per document: 10MB
  - For certificates, diplomas, transcripts
  - Shows list of uploaded documents with remove option

#### Section 4: Hobbies, Talents & Consent
- **Hobbies** (multi-select + custom input):
  - Pre-defined options: Reading, Writing, Sports, Music, Art & Painting, Dancing, Cooking, Photography, Gaming, Travel
  - Custom hobby text input for additional hobbies

- **Talents** (multi-select + custom input):
  - Pre-defined options: Public Speaking, Singing, Musical Instrument, Acting/Drama, Leadership, Problem Solving, Creative Writing, Programming, Design, Teaching
  - Custom talent text input for additional talents

- **Consents:**
  - **Data Consent** (required): Consent to collect and process personal data for educational purposes
  - **Media Consent** (optional): Consent to use photos and success stories for program promotion
  - **Newsletter Opt-in** (optional): Opt-in to receive email updates about courses and opportunities

### 4. Database Schema Updates

**File:** `backend/db.json`

Enhanced `onboarding` collection structure:
```json
{
  "id": "unique_id",
  "userId": 1,
  "firstName": "string",
  "lastName": "string",
  "email": "string",
  "phone": "string",
  "dateOfBirth": "YYYY-MM-DD",
  "age": 0,
  "gender": "string",
  "interests": ["array of strings"],

  "isPWD": boolean,
  "impairmentType": "string",
  "requiresParentInfo": boolean,

  "parentGuardianDetails": {
    "name": "string",
    "email": "string",
    "phone": "string",
    "relationship": "string"
  },

  "profilePicture": "base64 or path",

  "education": {
    "level": "string",
    "documents": ["array of file names"]
  },

  "hobbies": ["array of strings"],
  "talents": ["array of strings"],

  "consent": {
    "termsAccepted": boolean,
    "privacyAccepted": boolean,
    "dataConsent": boolean,
    "mediaConsent": boolean
  },

  "newsletterOptIn": boolean,
  "profileComplete": boolean,
  "createdAt": "ISO timestamp",
  "updatedAt": "ISO timestamp"
}
```

### 5. Backend API Enhancements

**File:** `backend/server.js`

#### New Endpoints:

1. **POST `/api/onboarding/profile`**
   - Save/update comprehensive onboarding profile
   - Validates all required fields based on TFDN requirements
   - Checks PWD status and requires impairment type if applicable
   - Validates parent/guardian info for users < 18 or PWD users
   - Creates new record or updates existing
   - Returns: `{ success: true, data: {...}, message: "..." }`

2. **GET `/api/onboarding/profile/:userId`**
   - Retrieve onboarding profile for a specific user
   - Returns: `{ success: true, data: {...}, message: "..." }`
   - 404 if not found

#### Validation Logic:
- **Always required:** firstName, lastName, email, termsAccepted, privacyAccepted, dataConsentAccepted
- **Conditional (isPWD = true):** impairmentType
- **Conditional (age < 18 OR isPWD = true):** parent/guardian name, email, phone
- **Required for section 3:** educationLevel

### 6. Context Updates

**File:** `frontend/src/contexts/OnboardingContext.tsx`

Enhanced `OnboardingData` interface with all new fields:
- PWD information
- Parent/Guardian details
- Profile photo
- Education documents
- Hobbies and talents
- All consent flags
- Newsletter opt-in

### 7. Router Updates

**File:** `frontend/src/router.tsx`

- Updated `/onboarding/profile-setup` route to use `EnhancedProfileSetup` component
- Maintains backward compatibility with other onboarding routes

## User Flow

1. **User registers** → Basic info collected
2. **Age Verification** → Calculate age, determine if < 18
3. **Enhanced Profile Setup** (4 sections):
   - Section 1: Basic info + Accept Terms/Privacy (auto-popup on first visit)
   - Section 2: PWD status + Parent/Guardian (if applicable)
   - Section 3: Photo + Education level + Documents
   - Section 4: Hobbies + Talents + Consents
4. **Initial Assessment** → Continue to career assessment
5. **Psychometric Test**
6. **Roadmap Generation**

## TFDN Mission Alignment

This implementation directly supports TFDN's goals:

### Human Rights-Based Approach (HRBA)
- ✅ **Dignity & Equality:** Accessible forms, PWD support
- ✅ **Participation & Voice:** User consent, opt-in choices
- ✅ **Accountability:** Transparent data usage, documented policies
- ✅ **Non-Discrimination:** Inclusive design, special accommodations

### Global Citizenship Education (GCED)
- ✅ Interests aligned with GCED topics (Environment, Sustainable Development, etc.)

### Kenya's Children's Act 2022
- ✅ Age verification and parental consent for under 18
- ✅ Best interest of the child considerations
- ✅ Family involvement and strengthening

### Inclusive Education
- ✅ PWD identification and support
- ✅ Accessibility considerations
- ✅ Neurodiverse learner accommodations

### Data Protection Act 2019
- ✅ Legal basis for processing
- ✅ User rights clearly stated
- ✅ Consent management
- ✅ ODPC (Office of Data Protection Commissioner) contact info

## Key Business Rules

### Parent/Guardian Information Required When:
1. User age < 18 **OR**
2. User identifies as PWD

### Impairment Type Required When:
- User checks PWD status

### Terms & Privacy Policy:
- Must be accepted before completing Section 1
- Auto-popup on first visit to profile setup
- Can be re-accessed via clickable links

### Education Documents:
- Optional but encouraged
- Used for verification and program eligibility

### Consents:
- **Data Consent:** Required (cannot proceed without)
- **Media Consent:** Optional
- **Newsletter:** Optional

## Testing Checklist

- [ ] Terms modal shows on first visit
- [ ] Privacy modal shows after accepting Terms
- [ ] Cannot proceed from Section 1 without accepting Terms & Privacy
- [ ] PWD checkbox toggles impairment type field
- [ ] Parent/Guardian section shows for age < 18
- [ ] Parent/Guardian section shows for PWD users
- [ ] Parent/Guardian fields are required when section is visible
- [ ] Photo upload validates file size (5MB max)
- [ ] Document upload validates file size (10MB max per file)
- [ ] Can remove uploaded documents
- [ ] Custom hobby/talent inputs work
- [ ] Section navigation validates required fields
- [ ] Data saves to backend correctly
- [ ] Data consent checkbox is required
- [ ] Media consent and newsletter are optional

## Installation Notes

### New Dependencies Added:
- `react-markdown`: For rendering markdown in legal documents modal

Install with:
```bash
cd frontend
npm install
```

### Backend Setup:
No new dependencies required. The backend uses existing json-server with custom middleware.

## Files Created/Modified

### New Files:
1. `frontend/src/constants/legalDocuments.ts` - Terms of Service and Privacy Policy
2. `frontend/src/components/legal/LegalDocumentModal.tsx` - Modal component for legal docs
3. `frontend/src/components/onboarding/EnhancedProfileSetup.tsx` - New comprehensive onboarding form
4. `ONBOARDING_FEATURES.md` - This documentation

### Modified Files:
1. `backend/db.json` - Updated onboarding schema
2. `backend/server.js` - Added new API endpoints
3. `frontend/src/router.tsx` - Updated to use EnhancedProfileSetup
4. `frontend/src/contexts/OnboardingContext.tsx` - Added new fields to context
5. `frontend/package.json` - Added react-markdown dependency

## Future Enhancements

1. **File Storage:** Currently documents are stored in memory. Consider:
   - Cloud storage (AWS S3, Google Cloud Storage)
   - Local file system with proper organization
   - CDN for profile photos

2. **Email Notifications:**
   - Send welcome email after profile completion
   - Send consent confirmation emails
   - Parent/Guardian notification emails

3. **Accessibility:**
   - Screen reader optimization
   - Keyboard navigation improvements
   - High contrast mode
   - Font size adjustment

4. **Localization:**
   - Swahili translation
   - Other Kenyan languages

5. **Analytics:**
   - Track completion rates per section
   - Identify drop-off points
   - A/B testing for form optimization

## Support & Maintenance

For questions or issues:
- Technical issues: Create an issue in the project repository
- TFDN policy questions: Contact legal@tajifanisi.org
- Data protection concerns: Contact dpo@tajifanisi.org

---

**Document Version:** 1.0
**Last Updated:** October 28, 2025
**Prepared for:** Taji Fanisi Development Network (TFDN)
