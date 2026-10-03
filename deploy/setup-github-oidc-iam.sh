#!/usr/bin/env bash
# ==============================================================================
# Setup AWS IAM OIDC Provider & Role for GitHub Actions
# ==============================================================================
set -e

# Default variables - customize as needed
GITHUB_ORG_OR_USER="${1:-stpaul2coderdojo}"
GITHUB_REPO="${2:-schizoOS-}"
ROLE_NAME="${3:-github-actions-alexa-deploy-role}"
POLICY_NAME="${4:-github-actions-alexa-deploy-policy}"

echo "=================================================================="
echo "  Setting up GitHub Actions OIDC & IAM Role for AWS Deployment"
echo "  Target Repo: ${GITHUB_ORG_OR_USER}/${GITHUB_REPO}"
echo "  Role Name:   ${ROLE_NAME}"
echo "=================================================================="

# Check AWS CLI
if ! command -v aws &> /dev/null; then
  echo "❌ Error: AWS CLI is not installed."
  exit 1
fi

AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
echo "✅ AWS Account ID: ${AWS_ACCOUNT_ID}"

# 1. Create OIDC Provider for GitHub Actions if it does not already exist
OIDC_PROVIDER_ARN="arn:aws:iam::${AWS_ACCOUNT_ID}:oidc-provider/token.actions.githubusercontent.com"
echo "🔍 Checking GitHub OIDC Provider..."

if ! aws iam get-open-id-connect-provider --open-id-connect-provider-arn "$OIDC_PROVIDER_ARN" >/dev/null 2>&1; then
  echo "➕ Creating GitHub OIDC Provider in AWS IAM..."
  # GitHub Actions thumbprint
  aws iam create-open-id-connect-provider \
    --url "https://token.actions.githubusercontent.com" \
    --client-id-list "sts.amazonaws.com" \
    --thumbprint-list "6938fd4d98bab03faadb97b34396831e3780aea1" "1c5876bd52c77c0c1dd30a11f8b43833a4aca1a3" >/dev/null
  echo "✅ GitHub OIDC Provider created: $OIDC_PROVIDER_ARN"
else
  echo "✅ GitHub OIDC Provider already exists."
fi

# 2. Prepare Trust Policy
TRUST_POLICY=$(cat <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Federated": "${OIDC_PROVIDER_ARN}"
      },
      "Action": "sts:AssumeRoleWithWebIdentity",
      "Condition": {
        "StringEquals": {
          "token.actions.githubusercontent.com:aud": "sts.amazonaws.com"
        },
        "StringLike": {
          "token.actions.githubusercontent.com:sub": "repo:${GITHUB_ORG_OR_USER}/${GITHUB_REPO}:*"
        }
      }
    }
  ]
}
EOF
)

# 3. Create or Update IAM Role
echo "🔑 Checking IAM Role: ${ROLE_NAME}..."
EXISTING_ROLE_ARN=$(aws iam get-role --role-name "${ROLE_NAME}" --query 'Role.Arn' --output text 2>/dev/null || true)

if [ -z "$EXISTING_ROLE_ARN" ]; then
  echo "➕ Creating IAM Role: ${ROLE_NAME}..."
  ROLE_ARN=$(aws iam create-role \
    --role-name "${ROLE_NAME}" \
    --assume-role-policy-document "${TRUST_POLICY}" \
    --description "GitHub Actions OIDC role for deploying Alexa Skill and Lambda" \
    --query 'Role.Arn' \
    --output text)
  echo "✅ Created Role: ${ROLE_ARN}"
else
  echo "🔄 Updating Trust Policy on existing Role: ${ROLE_NAME}..."
  aws iam update-assume-role-policy \
    --role-name "${ROLE_NAME}" \
    --policy-document "${TRUST_POLICY}"
  ROLE_ARN="$EXISTING_ROLE_ARN"
  echo "✅ Updated Role: ${ROLE_ARN}"
fi

# 4. Create and Attach Permissions Policy
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
POLICY_FILE="${SCRIPT_DIR}/aws-iam-github-actions-policy.json"

POLICY_ARN="arn:aws:iam::${AWS_ACCOUNT_ID}:policy/${POLICY_NAME}"
echo "📋 Checking Policy: ${POLICY_NAME}..."

if ! aws iam get-policy --policy-arn "$POLICY_ARN" >/dev/null 2>&1; then
  echo "➕ Creating Policy: ${POLICY_NAME}..."
  aws iam create-policy \
    --policy-name "${POLICY_NAME}" \
    --policy-document "file://${POLICY_FILE}" >/dev/null
  echo "✅ Created Policy: ${POLICY_ARN}"
else
  echo "🔄 Updating Policy Document..."
  # Get non-default versions count and prune if at maximum of 5
  VERSIONS=$(aws iam list-policy-versions --policy-arn "$POLICY_ARN" --query 'Versions[?!IsDefaultVersion].VersionId' --output text)
  for V in $VERSIONS; do
    aws iam delete-policy-version --policy-arn "$POLICY_ARN" --version-id "$V" >/dev/null 2>&1 || true
  done
  aws iam create-policy-version \
    --policy-arn "$POLICY_ARN" \
    --policy-document "file://${POLICY_FILE}" \
    --set-as-default >/dev/null
  echo "✅ Updated Policy: ${POLICY_ARN}"
fi

# Attach policy to role
echo "🔗 Attaching Policy to Role..."
aws iam attach-role-policy --role-name "${ROLE_NAME}" --policy-arn "${POLICY_ARN}"
echo "✅ Policy successfully attached!"

echo ""
echo "=================================================================="
echo "🎉 SETUP FINISHED!"
echo "=================================================================="
echo "Add this secret to your GitHub Repository:"
echo "Settings -> Secrets and variables -> Actions -> New repository secret"
echo ""
echo "Name:  AWS_ROLE_TO_ASSUME"
echo "Value: ${ROLE_ARN}"
echo "=================================================================="
