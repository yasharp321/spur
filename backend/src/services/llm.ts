// import OpenAI from "openai";
// import type { ChatCompletionMessageParam } from "openai/resources/chat";

// const client = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
// });

// export async function generateReply(
//   history: { text: string }[] ,
//   userMessage: string
// ): Promise<string> {
//   try {
//     const messages: ChatCompletionMessageParam[] = [
//       {
//         role: "system",
//         content:
//           "You are a helpful support agent for a small ecommerce store. " +
//           "Shipping to USA and India. Returns accepted within 7 days. " +
//           "Support hours are Monday to Friday, 9am to 6pm.",
//       },
//       ...history.map((text) => ({
//         role: "user" as const,
//         content: text,
//       })),
//       {
//         role: "user",
//         content: userMessage,
//       },
//     ];

//     const response = await client.chat.completions.create({
//       model: "gpt-4o-mini",
//       messages,
//       max_tokens: 150,
//     });

//     return response.choices[0]?.message?.content ?? "No response from AI";
//   } catch (error) {
//     console.error("LLM error:", error);
//     return "Looks like you are little unlucky baby! Please try again.";
//   }
// }
import OpenAI from "openai";
import type { ChatCompletionMessageParam } from "openai/resources/chat";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateReply(
  history: string[],
  userMessage: string
): Promise<string> {
  try {
    // Build conversation messages
    const messages: ChatCompletionMessageParam[] = [
      {
        role: "system",
        content:
          "You are a helpful customer support agent for a small ecommerce store. " +
          "The store ships to USA and India. Delivery takes 5–7 business days. " +
          "Returns are accepted within 7 days of delivery. " +
          "Support hours are Monday to Friday, 9am to 6pm.",
      },

      // Previous conversation history
      ...history.map((text) => ({
        role: "user" as const,
        content: text,
      })),

      // Current user message
      {
        role: "user",
        content: userMessage,
      },
    ];

    // Call OpenAI
    const response = await client.chat.completions.create({
      model: "gpt-3.5-turbo", // safest & widely available
      messages,
      max_tokens: 150,
      temperature: 0.4,
    });

    return (
      response.choices[0]?.message?.content ??
      "Sorry, I could not generate a response."
    );
  } catch (error) {
    console.error("OPENAI ERROR:", error);
    return "Sorry, I’m having trouble responding right now.";
  }
}
