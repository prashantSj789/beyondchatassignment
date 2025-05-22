import { OpenAI } from 'openai';

const openai = new OpenAI({
  apiKey: process.env.YOUR_OPENAI_API_KEY
});

export async function POST(req) {
  try {
    const { message } = await req.json();

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: message }]
    });

    const reply = response.choices[0].message.content;
    return Response.json({ reply });
  } catch (error) {
    console.error('OpenAI Error:', error);
    return new Response(JSON.stringify({ reply: 'Error from OpenAI API.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
