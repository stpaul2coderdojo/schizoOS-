#!/usr/bin/env bash
# ==============================================================================
# Vayu Vaidya • Wallmiki
# Automated Render (render.com) Deployment Helper Script
# ==============================================================================

set -e

echo "=================================================================="
echo "  Vayu Vaidya • Wallmiki - Render.com Deployment Helper"
echo "  Clinical Director: Dr. Bheemaiah Anil K"
echo "  Milwaukee, WI / www.vayuvaidya.info"
echo "=================================================================="

# 1. Verify render.yaml exists
if [ ! -f "render.yaml" ]; then
  echo "❌ Error: render.yaml blueprint not found in current directory."
  exit 1
fi

echo "✅ render.yaml blueprint detected."

# 2. Check Git status
if ! command -v git &> /dev/null; then
  echo "⚠️ Warning: 'git' CLI is not installed."
else
  GIT_STATUS=$(git status --porcelain 2>/dev/null || true)
  if [ -n "$GIT_STATUS" ]; then
    echo "📦 Uncommitted local changes detected. Staging and committing..."
    git add .
    git commit -m "Configure Render Blueprint and deployment files" || true
    echo "✅ Changes committed to git."
  else
    echo "✅ Git working tree is clean."
  fi
fi

# 3. Print deployment instructions
echo ""
echo "🚀 READY TO DEPLOY TO RENDER:"
echo "------------------------------------------------------------------"
echo "Option 1: Deploy via Render Blueprint (Recommended)"
echo "1. Push your repository to GitHub or GitLab: git push origin main"
echo "2. Visit https://dashboard.render.com/blueprints/new"
echo "3. Connect your repository."
echo "4. Render will auto-detect 'render.yaml'."
echo "5. Provide your GEMINI_API_KEY environment variable."
echo "6. Click 'Apply' to initiate the build and deployment!"
echo ""
echo "Option 2: Deploy via Render Web Service (Manual)"
echo "1. Go to https://dashboard.render.com/web/new"
echo "2. Select 'Build and deploy from a Git repository'"
echo "3. Environment: Docker"
echo "4. Dockerfile Path: ./Dockerfile"
echo "5. Add Environment Variables: PORT=3000, NODE_ENV=production, GEMINI_API_KEY=..."
echo "6. Click 'Create Web Service'"
echo "=================================================================="
