// THIS IS EXAMPLE CODE WE NEED TO MAKE IT DYNAMIC FOR OUR SUMMARY GENERATION
import { GoogleGenAI } from "@google/genai";

async function main() {
  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
  });
  const tools = [{ urlContext: {} }];
  const config = {
    thinkingConfig: {
      thinkingBudget: 0,
    },
    tools,
    systemInstruction: [
      {
        text: `you are a product anlyst`,
      },
    ],
  };
  const model = "gemini-2.5-flash";
  const contents = [
    {
      role: "user",
      parts: [
        {
          text: `INSERT_INPUT_HERE`,
        },
      ],
    },
  ];

  const response = await ai.models.generateContent({
    model,
    config,
    contents,
  });
  console.log(response.text);
}

main();
