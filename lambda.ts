/**
 * AWS Lambda Handler for Vayu Vaidya • Wallmiki
 * 
 * Supports both:
 * 1. Direct Alexa Skills Kit (ASK) Lambda invocation (Alexa trigger -> Lambda)
 * 2. AWS API Gateway / Lambda Function URL HTTP Proxy events (AWS HTTP -> Express / Lambda)
 */

import { handleAlexaSkillRequest, AlexaRequestEnvelope } from "./alexa/alexa-handler";

interface LambdaEvent {
  // Alexa Skill request indicators
  session?: any;
  context?: any;
  request?: {
    type: string;
    [key: string]: any;
  };
  // API Gateway / Function URL indicators
  rawPath?: string;
  path?: string;
  httpMethod?: string;
  requestContext?: {
    http?: {
      method: string;
      path: string;
    };
  };
  body?: string;
  isBase64Encoded?: boolean;
}

export const handler = async (event: LambdaEvent, context: any) => {
  console.log("[AWS Lambda] Received event:", JSON.stringify(event).slice(0, 300));

  const geminiApiKey = process.env.GEMINI_API_KEY;

  // Case 1: Direct Alexa Skills Kit Event
  // When Alexa invokes the Lambda directly via ASK trigger, the event is the raw Alexa envelope
  if (event.request && typeof event.request.type === "string") {
    try {
      const alexaResponse = await handleAlexaSkillRequest(event as AlexaRequestEnvelope, geminiApiKey);
      return alexaResponse;
    } catch (err: any) {
      console.error("[AWS Lambda Alexa Error]:", err);
      return {
        version: "1.0",
        response: {
          outputSpeech: {
            type: "SSML",
            ssml: "<speak><prosody pitch=\"-15%\" rate=\"92%\">I encountered a quiet disturbance in my thoughts. Let us pause and breathe together.</prosody></speak>",
          },
          shouldEndSession: false,
        },
      };
    }
  }

  // Case 2: API Gateway / Lambda Function URL HTTP Event
  const httpPath = event.rawPath || event.path || "/";
  const httpMethod = event.requestContext?.http?.method || event.httpMethod || "GET";

  // Check if it's the Alexa HTTP webhook path
  if (httpPath.includes("/api/alexa") && httpMethod === "POST") {
    try {
      let bodyData: any = {};
      if (event.body) {
        const rawBody = event.isBase64Encoded
          ? Buffer.from(event.body, "base64").toString("utf-8")
          : event.body;
        bodyData = JSON.parse(rawBody);
      }
      const alexaResponse = await handleAlexaSkillRequest(bodyData as AlexaRequestEnvelope, geminiApiKey);
      return {
        statusCode: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify(alexaResponse),
      };
    } catch (err: any) {
      return {
        statusCode: 500,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ error: err.message }),
      };
    }
  }

  // Health check endpoint
  if (httpPath.includes("/api/health")) {
    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        status: "ok",
        platform: "AWS Lambda Container",
        botName: "Wallmiki",
        hasApiKey: !!geminiApiKey,
        timestamp: new Date().toISOString(),
      }),
    };
  }

  // Fallback for general HTTP API proxy
  return {
    statusCode: 200,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
    body: JSON.stringify({
      message: "Vayu Vaidya • Wallmiki AWS Lambda Container is active.",
      endpoints: {
        alexaSkill: "POST /api/alexa or direct Lambda ARN trigger",
        health: "GET /api/health",
        documentation: "https://www.vayuvaidya.info",
      },
    }),
  };
};
