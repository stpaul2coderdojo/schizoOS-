#!/usr/bin/env bash
# ==============================================================================
# Vayu Vaidya • Wallmiki
# GitHub Remote Push Helper Script
# ==============================================================================

set -e

echo "=================================================================="
echo "  Vayu Vaidya • Wallmiki - GitHub Push Helper"
echo "  Milwaukee, WI / www.vayuvaidya.info"
echo "=================================================================="

# Check if an argument was passed
ARG="$1"
EXISTING_REMOTE=$(git remote get-url origin 2>/dev/null || echo "https://github.com/stpaul2coderdojo/schizoOS-.git")

# If an argument is given, determine if it is a token or a full URL
if [[ "$ARG" =~ ^(ghp_|github_pat_) ]]; then
  TARGET_URL="https://${ARG}@github.com/stpaul2coderdojo/schizoOS-.git"
  echo "Using provided GitHub token to push to stpaul2coderdojo/schizoOS-..."
  git remote set-url origin "$TARGET_URL" 2>/dev/null || git remote add origin "$TARGET_URL"
  git push -u origin main
  # Clean up token from git remote config for security
  git remote set-url origin "https://github.com/stpaul2coderdojo/schizoOS-.git"
  echo "✅ Successfully pushed to stpaul2coderdojo/schizoOS- using token!"
  exit 0
elif [ -n "$ARG" ]; then
  REPO_URL="$ARG"
  if git remote get-url origin 2>/dev/null; then
    echo "Updating remote origin to: $REPO_URL"
    git remote set-url origin "$REPO_URL"
  else
    echo "Adding remote origin: $REPO_URL"
    git remote add origin "$REPO_URL"
  fi
  echo "Pushing code to GitHub on branch 'main'..."
  git push -u origin main
  echo "✅ Successfully pushed to GitHub: $REPO_URL"
  exit 0
fi

# If no argument, try pushing with current remote
echo "Current remote origin: $EXISTING_REMOTE"
git push -u origin main
