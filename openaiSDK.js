import OpenAI from "openai"

import * as dotenv from 'dotenv';
dotenv.config()

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENAI_API_KEY,
  // defaultHeaders: {
  //   "HTTP-Referer": "<YOUR_SITE_URL>", // Optional. Site URL for rankings on openrouter.ai.
  //   "X-Title": "<YOUR_SITE_NAME>", // Optional. Site title for rankings on openrouter.ai.
  // }
})

export async function main(request) {
  try {
    const completion = await openai.chat.completions.create({
    model: "meta-llama/llama-3-8b-instruct:extended",
    messages: [
      {
        "role": "user",
        "content": `${request}`
      }
    ]
  })

  console.log(completion.choices[0].message)
  return completion.choices[0].message
  } catch(e) {
    return "Error Occured. TrY again"
    console.log(e);
  }
  
}

// export main
// main()