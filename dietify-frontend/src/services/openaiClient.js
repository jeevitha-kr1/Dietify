import OpenAI from "openai";

const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

console.log("Loaded VITE key:", apiKey); // temporary debug

const openai = new OpenAI({
  apiKey: apiKey,
  dangerouslyAllowBrowser: true,
});

export default openai;

// import OpenAI from "openai";
// const client = new OpenAI();

// const response = await client.responses.create({
//   model: "gpt-5.4",
//   input: "Write a short bedtime story about a unicorn.",
// });

// console.log(response.output_text);
