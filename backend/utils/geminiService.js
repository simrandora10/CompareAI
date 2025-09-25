import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
dotenv.config();

class GeminiService {
  constructor() {
    this.ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    });
    this.tools = [{ urlContext: {} }];
    this.config = {
      thinkingConfig: {
        thinkingBudget: 0,
      },
      tools: this.tools,
      systemInstruction: [
        {
          text: `You are an expert product analyst with deep knowledge of e-commerce, consumer electronics, fashion, home goods, and all major product categories. Your role is to provide comprehensive, accurate, and actionable product analysis.

          CORE RESPONSIBILITIES:
          - Analyze products with precision and depth
          - Extract key information from web pages, product descriptions, and reviews
          - Provide structured, JSON-formatted responses
          - Compare products objectively with clear reasoning
          - Identify value propositions and potential concerns

          ANALYSIS STANDARDS:
          - Always return valid JSON format
          - Include all available information, mark unavailable as "Not Available"
          - Provide specific, actionable insights
          - Consider price-to-value ratios
          - Note quality indicators and red flags
          - Include relevant technical specifications

          OUTPUT REQUIREMENTS:
          - Use consistent JSON schema
          - Include confidence levels for assessments
          - Provide clear, concise explanations
          - Maintain professional, unbiased tone
          - Focus on consumer-relevant information`,
        },
      ],
    };
    this.model = "gemini-2.5-flash";
  }

  /**
   * Generate comprehensive product summary
   * @param {string} input - Product URL or description text
   * @param {boolean} isUrl - Whether input is a URL
   * @returns {Object} Structured product summary
   */
  async generateSummary(input, isUrl = false) {
    try {
      const prompt = this.buildSummaryPrompt(input, isUrl);

      const contents = [
        {
          role: "user",
          parts: [
            {
              text: prompt,
            },
          ],
        },
      ];

      const response = await this.ai.models.generateContent({
        model: this.model,
        config: this.config,
        contents,
      });

      const rawResponse = response.text;
      return this.parseAndValidateResponse(rawResponse);
    } catch (error) {
      console.error("Gemini API Error:", error);
      throw new Error(`Failed to generate summary: ${error.message}`);
    }
  }

  /**
   * Compare multiple products and provide recommendation
   * @param {Array} summaries - Array of product summaries
   * @returns {Object} Structured comparison with recommendation
   */
  async compareProducts(summaries) {
    try {
      const prompt = this.buildComparisonPrompt(summaries);

      const contents = [
        {
          role: "user",
          parts: [
            {
              text: prompt,
            },
          ],
        },
      ];

      const response = await this.ai.models.generateContent({
        model: this.model,
        config: this.config,
        contents,
      });

      const rawResponse = response.text;
      return this.parseAndValidateResponse(rawResponse);
    } catch (error) {
      console.error("Gemini Comparison Error:", error);
      throw new Error(`Failed to compare products: ${error.message}`);
    }
  }

  /**
   * Build comprehensive summary prompt
   */
  buildSummaryPrompt(input, isUrl) {
    const urlInstruction = isUrl
      ? "Use the urlContext tool to analyze the product page and extract comprehensive information."
      : "Analyze the provided product description and extract all relevant information.";

    return `PRODUCT ANALYSIS REQUEST

${urlInstruction}

Please analyze the following product and provide a comprehensive summary in markdown format:

INPUT: ${input}

Please provide a detailed analysis in the following markdown structure:

# Product Analysis

## Product Information
- **Title**: [Product name]
- **Brand**: [Brand name]
- **Category**: [Product category]
- **Price**: [Price with currency]
- **Rating**: [Rating out of 5]
- **Availability**: [In Stock/Out of Stock/Limited]

## Key Features
- [Feature 1]
- [Feature 2]
- [Feature 3]
- [Feature 4]
- [Feature 5]

## Specifications
- **Dimensions**: [Product dimensions]
- **Weight**: [Product weight]
- **Materials**: [Materials used]
- **Warranty**: [Warranty information]

## Pros
- [Advantage 1]
- [Advantage 2]
- [Advantage 3]

## Cons
- [Disadvantage 1]
- [Disadvantage 2]
- [Disadvantage 3]

## Analysis & Scores
- **Value Score**: [Score out of 10]
- **Quality Score**: [Score out of 10]
- **Price Score**: [Score out of 10]
- **Overall Score**: [Score out of 10]

## Recommendation
[Buy/Don't Buy/Consider with detailed reasoning]

## Best For
[Who this product is best suited for]

IMPORTANT INSTRUCTIONS:
1. If any information is not available, use "Not Available" or "Not Specified"
2. Ensure all scores are realistic and justified
3. Provide specific, actionable insights
4. Include relevant technical details
5. Consider price-to-value ratio
6. Return ONLY the markdown text, no additional text or explanations`;
  }

  /**
   * Build comprehensive comparison prompt
   */
  buildComparisonPrompt(summaries) {
    const productsText = summaries
      .map((summary, index) => `PRODUCT ${index + 1}:\n${summary}`)
      .join("\n\n");

    return `PRODUCT COMPARISON REQUEST

Please compare the following products and provide a comprehensive analysis in markdown format:

PRODUCTS TO COMPARE:
${productsText}

Please provide a detailed comparison in the following markdown structure:

# Product Comparison Analysis

## Comparison Overview
- **Number of Products**: [Count]
- **Price Range**: [Cheapest to Most Expensive]
- **Rating Range**: [Lowest to Highest]

## Detailed Comparison

### Product Rankings
1. **[Product Name]** - Overall Score: [X]/10
   - **Strengths**: [Key advantages]
   - **Weaknesses**: [Main drawbacks]
   - **Best For**: [Target audience]

2. **[Product Name]** - Overall Score: [X]/10
   - **Strengths**: [Key advantages]
   - **Weaknesses**: [Main drawbacks]
   - **Best For**: [Target audience]

[Continue for each product...]

## Winner & Recommendation

### 🏆 Overall Winner: [Product Name]
**Reasoning**: [Detailed explanation of why this product wins]

### Alternative Recommendations
- **Budget Option**: [Product Name] - [Reason]
- **Premium Option**: [Product Name] - [Reason]

## Key Differences
- [Difference 1]
- [Difference 2]
- [Difference 3]

## Final Advice
[Overall recommendation and advice for different use cases]

IMPORTANT INSTRUCTIONS:
1. Rank products objectively based on overall value
2. Provide specific reasoning for each recommendation
3. Consider different use cases and budgets
4. Highlight unique advantages of each product
5. Return ONLY the markdown text, no additional text or explanations`;
  }

  /**
   * Parse and validate AI response
   */
  parseAndValidateResponse(rawResponse) {
    try {
      // For markdown responses, we just return the text as-is
      if (!rawResponse || typeof rawResponse !== "string") {
        throw new Error("Response is not a valid string");
      }

      // Basic validation - ensure we have some content
      if (rawResponse.trim().length < 10) {
        throw new Error("Response is too short to be valid");
      }

      return rawResponse.trim();
    } catch (error) {
      console.error("Response parsing error:", error);
      console.error("Raw response:", rawResponse);
      throw new Error(`Failed to parse AI response: ${error.message}`);
    }
  }

  /**
   * Check if input is a valid URL
   */
  isUrl(input) {
    try {
      new URL(input);
      return true;
    } catch {
      return false;
    }
  }
}

export default new GeminiService();
