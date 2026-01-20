/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Primary Brand Colors - Enchanted Forest Theme (Light Mode)
        primary: {
          DEFAULT: '#1E4F2A',      // Forest Green - Trust, growth, nature
          light: '#3A7D44',         // Medium Green - UI accents, buttons
          dark: '#01200F',          // Deep Forest Green - Dark accents
        },
        // Secondary / Growth Colors
        secondary: {
          DEFAULT: '#3A7D44',       // Medium Green - Growth, vitality
          light: '#729B79',         // Sage Green - Soft accents
          dark: '#1E4F2A',          // Forest Green - Depth
        },
        // Accent Colors - Gold (use sparingly in dark mode)
        accent: {
          gold: '#FDC500',          // Gold - Primary accent for CTAs, highlights
          goldLight: '#FFD500',     // Bright Gold - Hover states, emphasis
          goldMuted: '#E6C97A',     // Muted Gold - Dark mode active items
          goldSoft: '#F2D58B',      // Soft Gold - Achievements, streaks
        },
        // Neutral Colors - Light Mode
        neutral: {
          white: '#FFFFFF',         // Pure White - Backgrounds
          light: '#F8FAF8',         // Light green-tinted white - Backgrounds
          gray: '#E8EDE9',          // Light gray with green tint
          dark: '#1A1A1A',          // Charcoal - Text in light mode
        },
        // ============================================
        // DARK MODE - High Contrast Premium System
        // ============================================
        darkMode: {
          // Base Surfaces (clearly separated for hierarchy)
          bg: '#26262cff',            // True dark app background
          navbar: '#253a24ff',        // Navbar/top bar - slight lift
          surface: '#2f3238ff',       // Cards/panels - clear elevation
          surfaceHover: '#14161bff',  // Hover/active cards - interaction clarity
          border: '#25332bff',        // Borders/dividers - subtle but visible

          // Text Colors (proper contrast hierarchy)
          text: '#F1F5F9',          // Primary text - high contrast
          textSecondary: '#CBD5E1', // Secondary text
          textMuted: '#888a8dff',     // Muted text
          textDisabled: '#373e47ff',  // Disabled text

          // Accent Colors (purposeful, not decorative)
          accent: '#E6C97A',        // Gold - active items, rewards, progress
          accentHover: '#F2D58B',   // Gold hover - achievements

          // Progress & Growth (Green)
          progress: '#5FB37A',      // Progress bars
          success: '#4CAF73',       // Success states
          successLight: '#6FCF97',  // Completion badges

          // Functional Blue (minimal use)
          link: '#4DA3FF',          // Links only
          focus: '#4DA3FF',         // Focus rings
          toggle: '#4DA3FF',        // Toggle on state
        },
        // UI Functional Colors
        border: {
          light: '#D4E5D6',         // Light green-tinted border
          dark: '#263654',          // Dark mode border - visible
        },
        // Forest palette direct access (Light mode)
        forest: {
          deepest: '#01200F',       // Deepest forest
          deep: '#1E4F2A',          // Deep forest
          medium: '#3A7D44',        // Medium green
          sage: '#729B79',          // Sage green
          light: '#BACDB0',         // Light sage
          mist: '#E8F0E8',          // Misty green
        },
        // Status colors
        success: {
          DEFAULT: '#4CAF73',       // Updated for better visibility
          light: '#6FCF97',
          dark: '#3A7D44',
        },
        warning: {
          DEFAULT: '#FDC500',
          light: '#FFD500',
          dark: '#E6B800',
        },
        error: {
          DEFAULT: '#DC2626',
          light: '#EF4444',
          dark: '#B91C1C',
        },
        info: {
          DEFAULT: '#4DA3FF',       // Blue for info
          light: '#60B5FF',
          dark: '#3B93EF',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        heading: ['Poppins', 'sans-serif'],
      },
      boxShadow: {
        'forest': '0 4px 20px rgba(30, 79, 42, 0.15)',
        'forest-lg': '0 8px 30px rgba(30, 79, 42, 0.2)',
        'gold': '0 4px 20px rgba(253, 197, 0, 0.3)',
        'dark': '0 4px 20px rgba(0, 0, 0, 0.4)',
        'dark-lg': '0 8px 30px rgba(0, 0, 0, 0.5)',
        'dark-glow': '0 0 20px rgba(230, 201, 122, 0.15)',
      },
    },
  },
  plugins: [],
}
