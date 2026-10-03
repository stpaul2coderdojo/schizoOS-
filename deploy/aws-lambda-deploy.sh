#!/usr/bin/env bash
# ==============================================================================
# Vayu Vaidya • Wallmiki
# Automated Docker Deployment to AWS Lambda & Alexa Skill Setup Script
# ==============================================================================

set -e

# Configuration Defaults (Override via environment variables)
AWS_REGION="${AWS_REGION:-us-east-1}"
FUNCTION_NAME="${FUNCTION_NAME:-vayu-vaidya-wallmiki}"
ECR_REPO_NAME="${ECR_REPO_NAME:-vayu-vaidya-wallmiki}"
IMAGE_TAG="${IMAGE_TAG:-latest}"
MEMORY_SIZE="${MEMORY_SIZE:-1024}"
TIMEOUT_SECONDS="${TIMEOUT_SECONDS:-30}"

echo "=================================================================="
echo "  Vayu Vaidya • Wallmiki - AWS Lambda Docker Deployment"
echo "  Clinical Director: Dr. Bheemaiah Anil K"
echo "  Target Region: $AWS_REGION"
echo "  Function Name: $FUNCTION_NAME"
echo "=================================================================="

# 1. Verify AWS CLI is installed
if ! command -v aws &> /dev/null; then
  echo "❌ Error: 'aws' CLI is not installed or not in PATH."
  echo "   Please install it: https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html"
  exit 1
fi

# 2. Verify Docker is installed and running
if ! command -v docker &> /dev/null; then
  echo "❌ Error: 'docker' is not installed or not running."
  echo "   Please start the Docker daemon and retry."
  exit 1
fi

# 3. Retrieve AWS Account ID
echo "🔍 Retrieving AWS Account ID..."
AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text 2>/dev/null || true)

if [ -z "$AWS_ACCOUNT_ID" ] || [ "$AWS_ACCOUNT_ID" == "None" ]; then
  echo "❌ Error: Could not determine AWS Account ID."
  echo "   Please run 'aws configure' with valid AWS credentials."
  exit 1
fi

echo "✅ AWS Account ID: $AWS_ACCOUNT_ID"
ECR_URI="$AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$ECR_REPO_NAME"

# 4. Check or Create ECR Repository
echo "📦 Checking ECR Repository: $ECR_REPO_NAME..."
if ! aws ecr describe-repositories --repository-names "$ECR_REPO_NAME" --region "$AWS_REGION" &> /dev/null; then
  echo "➕ Creating ECR repository '$ECR_REPO_NAME' in $AWS_REGION..."
  aws ecr create-repository \
    --repository-name "$ECR_REPO_NAME" \
    --region "$AWS_REGION" \
    --image-scanning-configuration scanOnPush=true \
    --encryption-configuration encryptionType=AES256 > /dev/null
  echo "✅ ECR repository created."
else
  echo "✅ ECR repository already exists."
fi

# 5. Authenticate Docker with Amazon ECR
echo "🔐 Authenticating Docker to Amazon ECR ($AWS_REGION)..."
aws ecr get-login-password --region "$AWS_REGION" | docker login --username AWS --password-stdin "$AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com"

# 6. Build the AWS Lambda Container Image
echo "🔨 Building Docker image using Dockerfile.lambda..."
docker build -t "$ECR_REPO_NAME:$IMAGE_TAG" -f Dockerfile.lambda .

echo "🏷️ Tagging image for ECR: $ECR_URI:$IMAGE_TAG..."
docker tag "$ECR_REPO_NAME:$IMAGE_TAG" "$ECR_URI:$IMAGE_TAG"

# 7. Push Docker Image to ECR
echo "🚀 Pushing image to Amazon ECR..."
docker push "$ECR_URI:$IMAGE_TAG"
echo "✅ Image successfully pushed to ECR: $ECR_URI:$IMAGE_TAG"

# 8. Check or Create IAM Execution Role for Lambda
ROLE_NAME="${FUNCTION_NAME}-lambda-execution-role"
echo "🔑 Checking IAM Role: $ROLE_NAME..."

ROLE_ARN=$(aws iam get-role --role-name "$ROLE_NAME" --query 'Role.Arn' --output text 2>/dev/null || true)

if [ -z "$ROLE_ARN" ]; then
  echo "➕ Creating IAM Role for Lambda..."
  TRUST_POLICY='{
    "Version": "2012-10-17",
    "Statement": [
      {
        "Effect": "Allow",
        "Principal": { "Service": "lambda.amazonaws.com" },
        "Action": "sts:AssumeRole"
      }
    ]
  }'
  ROLE_ARN=$(aws iam create-role \
    --role-name "$ROLE_NAME" \
    --assume-role-policy-document "$TRUST_POLICY" \
    --query 'Role.Arn' --output text)

  echo "📋 Attaching AWSLambdaBasicExecutionRole policy..."
  aws iam attach-role-policy \
    --role-name "$ROLE_NAME" \
    --policy-arn "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"

  echo "⏳ Waiting 10 seconds for IAM role propagation..."
  sleep 10
fi

echo "✅ IAM Role ARN: $ROLE_ARN"

# 9. Create or Update the Lambda Function
echo "⚡ Deploying to AWS Lambda: $FUNCTION_NAME..."
if aws lambda get-function --function-name "$FUNCTION_NAME" --region "$AWS_REGION" &> /dev/null; then
  echo "🔄 Updating existing Lambda function code with new container image..."
  aws lambda update-function-code \
    --function-name "$FUNCTION_NAME" \
    --image-uri "$ECR_URI:$IMAGE_TAG" \
    --region "$AWS_REGION" > /dev/null

  echo "⚙️ Updating function configuration (Memory: ${MEMORY_SIZE}MB, Timeout: ${TIMEOUT_SECONDS}s)..."
  aws lambda update-function-configuration \
    --function-name "$FUNCTION_NAME" \
    --memory-size "$MEMORY_SIZE" \
    --timeout "$TIMEOUT_SECONDS" \
    --region "$AWS_REGION" > /dev/null
else
  echo "➕ Creating new container-based Lambda function..."
  aws lambda create-function \
    --function-name "$FUNCTION_NAME" \
    --package-type Image \
    --code ImageUri="$ECR_URI:$IMAGE_TAG" \
    --role "$ROLE_ARN" \
    --memory-size "$MEMORY_SIZE" \
    --timeout "$TIMEOUT_SECONDS" \
    --region "$AWS_REGION" > /dev/null
fi

LAMBDA_ARN=$(aws lambda get-function --function-name "$FUNCTION_NAME" --region "$AWS_REGION" --query 'Configuration.FunctionArn' --output text)
echo "✅ Lambda Function Deployed: $LAMBDA_ARN"

# 10. Enable Lambda Function URL (Public HTTP endpoint for Web and Alexa Webhook)
echo "🌐 Configuring Lambda Function URL..."
URL_CONFIG=$(aws lambda create-function-url-config \
  --function-name "$FUNCTION_NAME" \
  --auth-type NONE \
  --region "$AWS_REGION" 2>/dev/null || aws lambda get-function-url-config --function-name "$FUNCTION_NAME" --region "$AWS_REGION")

FUNCTION_URL=$(echo "$URL_CONFIG" | grep -o '"FunctionUrl": "[^"]*' | cut -d'"' -f4)

# Allow public invocations for the Function URL
aws lambda add-permission \
  --function-name "$FUNCTION_NAME" \
  --statement-id "FunctionURLAllowPublicAccess" \
  --action "lambda:InvokeFunctionUrl" \
  --principal "*" \
  --function-url-auth-type "NONE" \
  --region "$AWS_REGION" 2>/dev/null || true

# 11. Configure Alexa Skills Kit Trigger Permissions
echo "🎙️ Adding Alexa Skills Kit invoke permission..."
aws lambda add-permission \
  --function-name "$FUNCTION_NAME" \
  --statement-id "AlexaSkillsKitPermission" \
  --action "lambda:InvokeFunction" \
  --principal "alexa-appkit.amazon.com" \
  --region "$AWS_REGION" 2>/dev/null || true

echo ""
echo "=================================================================="
echo "🎉 DEPLOYMENT COMPLETE!"
echo "=================================================================="
echo "• Lambda Function Name: $FUNCTION_NAME"
echo "• Lambda Function ARN:  $LAMBDA_ARN"
echo "• Function URL:         $FUNCTION_URL"
echo "• Alexa Webhook URL:    ${FUNCTION_URL}api/alexa"
echo ""
echo "📱 To Connect with Alexa Developer Console:"
echo "1. Go to: https://developer.amazon.com/alexa/console/ask"
echo "2. Create a new custom skill named 'Vayu Vaidya Wallmiki'"
echo "3. In 'Interaction Model' -> 'JSON Editor', paste 'alexa/interactionModels/custom/en-US.json'"
echo "4. In 'Endpoint', choose either:"
echo "   - AWS Lambda ARN: $LAMBDA_ARN"
echo "   - HTTPS Webhook:  ${FUNCTION_URL}api/alexa"
echo "5. Save and Build the Model, then test in the 'Test' tab!"
echo "=================================================================="
