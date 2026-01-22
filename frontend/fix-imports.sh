#!/bin/bash

# Fix all type imports in the frontend
echo "🔧 Fixing all type imports..."

# List of files with type import issues
files=(
    "src/components/assessments/SkillsAssessment.tsx"
    "src/components/ui/PerformanceWidget.tsx"
    "src/components/ui/RecommendationCard.tsx"
    "src/components/ui/RecommendationFeedback.tsx"
    "src/components/ui/SkillGapAnalysis.tsx"
    "src/contexts/RecommendationsContext.tsx"
    "src/contexts/LearningPathContext.tsx"
)

for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        echo "Fixing $file..."
        
        # Fix single type imports
        sed -i "s/import { \([^}]*\) } from '\([^']*\)\/types'/import type { \1 } from '\2\/types'/g" "$file"
        
        # Fix multiple type imports on same line
        sed -i "s/import { \([^}]*\), \([^}]*\) } from '\([^']*\)\/types'/import type { \1, \2 } from '\3\/types'/g" "$file"
        
        echo "✅ Fixed $file"
    else
        echo "❌ File not found: $file"
    fi
done

echo "🎉 All type imports fixed!"
