# Deploying Vayu Vaidya Docker to AWS Lambda & Alexa Skill Integration

*A complete clinical engineering and DevOps guide by Vayu Vaidya (Milwaukee, WI / www.vayuvaidya.info), directed by Dr. Bheemaiah Anil K.*

---

## 🏛️ Architecture Overview

Deploying **Vayu Vaidya • Wallmiki** to **AWS Lambda** via Docker container images bridges cloud serverless efficiency with multimodal voice-enabled e-psychiatry.

```
                                      +---------------------------------------------+
                                      |           AMAZON ECHO / ALEXA DEVICE         |
                                      | "Alexa, ask Vayu Vaidya to ground my senses"|
                                      +----------------------+----------------------+
                                                             |
                                                             | Alexa Skills Kit (ASK)
                                                             v
+---------------------------------------------------------------------------------------------------+
|                                        AWS CLOUD INFRASTRUCTURE                                    |
|                                                                                                   |
|   +---------------------------------------+       +-------------------------------------------+   |
|   |          Amazon ECR Repository        |       |            AWS Lambda Container           |   |
|   |  vayu-vaidya-wallmiki:latest          | ====> |  vayu-vaidya-wallmiki (1024MB, 30s)       |   |
|   |  (Built from Dockerfile.lambda)       |       |  - AWS Lambda Web Adapter (port 3000)     |   |
|   +---------------------------------------+       |  - Express 4.21 Server + Vite SPA         |   |
|                                                   |  - /api/alexa ASK Handler (SSML Audio)    |   |
|                                                   |  - /api/health, /api/chat, /api/score     |   |
|                                                   +---------------------+---------------------+   |
+-------------------------------------------------------------------------|-------------------------+
                                                                          |
                                                                          v
                                                         +----------------------------------+
                                                         |        GOOGLE GEMINI API         |
                                                         |  - Socratic CBT Reframing        |
                                                         |  - Clinical Safe Fallback Mode   |
                                                         +----------------------------------+
```

### Why Containerized Lambda?
* **Zero Dependency Limits**: AWS Lambda zip packages have a 250MB uncompressed limit, whereas Lambda Container Images support up to **10GB**.
* **Unified Codebase**: The exact same container serves the interactive web UI (Hologram prism, 8-fold mandala canvas, schizoOS explorer) AND handles Alexa voice payloads through `/api/alexa`.
* **AWS Lambda Web Adapter**: Allows standard Node.js Express servers to run inside Lambda without complex rewrites, managing event loop translation and HTTP streaming transparently.

---

## 📋 Prerequisites

1. **AWS Account**: With administrative permissions for IAM, ECR, and Lambda.
2. **AWS CLI**: Installed and configured (`aws configure`).
3. **Docker Daemon**: Installed and running locally or in your CI/CD runner.
4. **Amazon Developer Account**: Access to the [Alexa Developer Console](https://developer.amazon.com/alexa/console/ask).
5. **Google Gemini API Key**: From [Google AI Studio](https://aistudio.google.com/).

---

## ⚡ Option 1: Automated 1-Click Script Deployment

We provide an all-in-one executable deployment script `deploy/aws-lambda-deploy.sh`:

```bash
# Set your environment variables (optional overrides)
export AWS_REGION="us-east-1"
export FUNCTION_NAME="vayu-vaidya-wallmiki"
export GEMINI_API_KEY="AIzaSy..."

# Execute automated deployment
./deploy/aws-lambda-deploy.sh
```

The script automatically:
1. Verifies AWS CLI credentials and fetches your AWS Account ID.
2. Creates the Amazon ECR repository if needed.
3. Authenticates Docker to your ECR registry.
4. Builds the container image using `Dockerfile.lambda`.
5. Pushes the image to ECR.
6. Creates the IAM execution role with `AWSLambdaBasicExecutionRole`.
7. Creates or updates the AWS Lambda function (`PackageType=Image`).
8. Configures memory (1024MB) and timeout (30 seconds).
9. Generates a public **Lambda Function URL** (HTTPS endpoint).
10. Grants permission for the Alexa Skills Kit (`alexa-appkit.amazon.com`) to invoke your function.
11. Outputs the exact Lambda ARN and webhook URLs for the Alexa Console.

---

## 🛠️ Option 2: Step-by-Step Manual Deployment

### Step 1: Create Amazon ECR Repository
```bash
aws ecr create-repository \
  --repository-name vayu-vaidya-wallmiki \
  --region us-east-1 \
  --image-scanning-configuration scanOnPush=true
```

### Step 2: Authenticate Docker to Amazon ECR
```bash
AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
aws ecr get-login-password --region us-east-1 | \
  docker login --username AWS --password-stdin "$AWS_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com"
```

### Step 3: Build & Push the Lambda Docker Image
```bash
# Build using the Lambda-optimized Dockerfile
docker build -t vayu-vaidya-wallmiki:latest -f Dockerfile.lambda .

# Tag for Amazon ECR
docker tag vayu-vaidya-wallmiki:latest \
  "$AWS_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/vayu-vaidya-wallmiki:latest"

# Push to ECR
docker push "$AWS_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/vayu-vaidya-wallmiki:latest"
```

### Step 4: Create IAM Role for Lambda
Create `trust-policy.json`:
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": { "Service": "lambda.amazonaws.com" },
      "Action": "sts:AssumeRole"
    }
  ]
}
```
Run:
```bash
aws iam create-role \
  --role-name vayu-vaidya-wallmiki-execution-role \
  --assume-role-policy-document file://trust-policy.json

aws iam attach-role-policy \
  --role-name vayu-vaidya-wallmiki-execution-role \
  --policy-arn arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole
```

### Step 5: Create the Containerized Lambda Function
```bash
aws lambda create-function \
  --function-name vayu-vaidya-wallmiki \
  --package-type Image \
  --code ImageUri="$AWS_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/vayu-vaidya-wallmiki:latest" \
  --role "arn:aws:iam::$AWS_ACCOUNT_ID:role/vayu-vaidya-wallmiki-execution-role" \
  --memory-size 1024 \
  --timeout 30 \
  --environment "Variables={NODE_ENV=production,PORT=3000,AWS_LWA_PORT=3000,GEMINI_API_KEY=your_key_here}" \
  --region us-east-1
```

### Step 6: Create Lambda Function URL (Public HTTPS Endpoint)
```bash
aws lambda create-function-url-config \
  --function-name vayu-vaidya-wallmiki \
  --auth-type NONE \
  --region us-east-1

aws lambda add-permission \
  --function-name vayu-vaidya-wallmiki \
  --statement-id FunctionURLAllowPublicAccess \
  --action lambda:InvokeFunctionUrl \
  --principal "*" \
  --function-url-auth-type NONE \
  --region us-east-1
```

---

## 🎙️ Creating the Alexa Skill in Alexa Developer Console

### Step 1: Create a New Skill
1. Sign in to the [Alexa Developer Console](https://developer.amazon.com/alexa/console/ask).
2. Click **Create Skill**.
3. **Skill Name**: `Vayu Vaidya Wallmiki`.
4. **Primary Locale**: `English (US)`.
5. **Model**: Select **Custom**.
6. **Hosting**: Select **Provision your own** (since we are hosting on AWS Lambda Docker).
7. Click **Create skill**.

### Step 2: Import the Interaction Model
1. In the left navigation menu, click **Interaction Model** -> **JSON Editor**.
2. Replace the JSON with the contents of [`alexa/interactionModels/custom/en-US.json`](../alexa/interactionModels/custom/en-US.json).
3. Click **Save Model** and then **Build Model**.

### Step 3: Configure the Endpoint
1. In the left menu, click **Endpoint**.
2. You have two options:
   * **Option A (AWS Lambda ARN - Recommended)**:
     - Select **AWS Lambda ARN**.
     - Under **Default Region**, enter your Lambda ARN:
       `arn:aws:lambda:us-east-1:<AWS_ACCOUNT_ID>:function:vayu-vaidya-wallmiki`
     - Copy your **Skill ID** (e.g. `amzn1.ask.skill.xxxx`).
     - In AWS, grant permission for this Skill ID:
       ```bash
       aws lambda add-permission \
         --function-name vayu-vaidya-wallmiki \
         --statement-id AlexaSkillsKitWithSkillId \
         --action lambda:InvokeFunction \
         --principal alexa-appkit.amazon.com \
         --event-source-token amzn1.ask.skill.xxxx \
         --region us-east-1
       ```
   * **Option B (HTTPS Webhook via Function URL)**:
     - Select **HTTPS**.
     - Enter your Lambda Function URL with the `/api/alexa` path:
       `https://<your-lambda-url-id>.lambda-url.us-east-1.on.aws/api/alexa`
     - SSL Certificate type: Select *"My development endpoint is a sub-domain of a domain that has a wildcard certificate from a certificate authority"*.
3. Click **Save Endpoints**.

---

## 🧪 Testing Your Alexa Skill

### In Alexa Developer Console (Test Tab)
1. Navigate to the **Test** tab in the Alexa Developer Console.
2. Set **Skill testing is enabled in** to **Development**.
3. Type or speak sample utterances:
   * `"open vayu vaidya"`
   * `"ask vayu vaidya for a breathing exercise"`
   * `"ask vayu vaidya to check my autopilot"`
   * `"ask vayu vaidya for grounding"`
   * `"ask vayu vaidya for wisdom"`
4. Observe the response: Wallmiki speaks with SSML prosody `<prosody pitch="-15%" rate="92%">` and executes rhythmic breath pauses `<break time="4s"/>`.

### In-App Interactive Alexa Simulator
You can also test every Alexa voice intent directly inside the **Vayu Vaidya web app** via the **Alexa & AWS** tab! It generates real-time audio playback using the Web Audio baritone synthesizer and displays the exact JSON request and SSML response payloads.

---

## 🔧 Optimizations & Best Practices

1. **Lambda Cold Starts**:
   - Setting memory to **1024MB** allocates a full vCPU core to the Lambda container, reducing cold boot times to under 1.8 seconds.
   - For ultra-low latency voice responses, configure **Provisioned Concurrency** (e.g. 1 concurrent instance) in the AWS Lambda console.
2. **SSML Limits**:
   - Alexa responses must not exceed 8,000 characters or 90 seconds of continuous speech. The Wallmiki handler formats breathing and grounding intervals in tight 2-4 minute segments.
3. **Harm-Reduction Safety**:
   - In accordance with Dr. Bheemaiah Anil K's clinical directives, if a user expresses crisis intent, Wallmiki provides immediate compassionate grounding and outputs the national crisis hotline (988) on both voice and Alexa visual cards.
