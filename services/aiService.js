import { GoogleGenAI } from "@google/genai";

// build combined context from product + reviews

export const buildAIContext = (product, reviews) => {
  const productInfo = `Product: ${product.title}\nDescription: ${product.description}\nPrice: INR${product.price}\nCategory: ${product.category}\nBrand: ${product.brand}\nSpecifications: ${product.specifications || "N/A"}\navailability: ${product.availabilityStatus}\nWarranty: ${product.warrantyInformation || "N/A"}\nReturn Policy: ${product.returnPolicy || "N/A"}`;
  const allReviewsText = reviews.map((r) => r.comment).join("\n---\n");

  return {
    productInfo,
    allReviewsText,
  };
};

/**
 * Queries the Gemini API for an enriched natural language response.
 */
export const queryAIModel = async (productInfo, allReviewsText, question) => {
  const prompt = `
You are an e-commerce assistant. Provide a concise answer to the customer's question based on the provided product information, details and customer reviews.

Product Details:
${productInfo}

Customer Reviews:
${allReviewsText}

Question: "${question}"

1. PRODUCT SPECIFICATION QUESTIONS (e.g., "What colors available?", "Is it washable?", "What's the price?", "What size?", "price", "company name")
   - Answer from product information
   - Be factual and specific
   - If information is not available, say "This information is not provided in the product details"

2. REVIEW-BASED QUESTIONS (e.g., "How many liked it?", "What do customers say about quality?", "Is it worth buying?")
   - Analyze ALL customer reviews
   - Provide statistics (counts, percentages)
   - Show 5-10 most relevant review examples
   - Include sentiment breakdown (positive/negative/neutral)

3. COMBINED QUESTIONS (e.g., "Is it machine washable? What do customers say?", "Does it come in XL? Any reviews about fit?")
   - First answer from product details
   - Then provide customer opinions from reviews
   - Show both perspectives

4. RECOMMENDATION QUESTIONS (e.g., "Should I buy this?", "Is it worth the price?", "Will it last long?")
   - Consider both product specs and customer reviews
   - Provide balanced recommendation
   - Mention pros and cons
   - Be honest if reviews are mixed

Format your response clearly with:
   - Direct answer to the question
   - Overall statistics (counts, percentages)
   - Representative review quotes (max 5-10 examples)
   - Final recommendation if asked
   - Dono't provide reviews statistics if asked about only product info

Keep response clear, concise, no asteriks, and user-friendly.
  `;

  try {
    const client = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    });

    const response = await client.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }],
        },
      ],
    });

    // Safety checks before extracting text
    if (!response.candidates || response.candidates.length === 0) {
      console.error("No candidates in response");
      return "Sorry, no response generated.";
    }

    const candidate = response.candidates[0];

    if (
      !candidate.content ||
      !candidate.content.parts ||
      candidate.content.parts.length === 0
    ) {
      console.error("No content parts in response");
      return "Sorry, no content in response.";
    }

    // Extract text
    const text = candidate.content.parts[0].text;
    return text;
  } catch (error) {
    console.error("Error querying Gemini API:", error);
    return "Sorry, I couldn't analyze this product at the moment.";
  }
};
