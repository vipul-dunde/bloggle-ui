import axios from "axios";
import { NextResponse } from "next/server";

async function postHandler(req: Request) {
  const { title, content } = await req.json();
  let chatSessionId: string = process.env.CHAT_SESSION_ID as string;
  const prompt = `Title: ${title as string}\nContent: ${content as string}\nReturn only the enhanced content as per instructions. No additional information. Strict text format only, no markdown or HTML. Ignore Previous Messages.`;
  let response;
  try {
    response = await getResponseForPrompt(chatSessionId, prompt);
  } catch (error) {
    console.error("Error getting response from AI", error);
    chatSessionId = (await createChatSession()) as string;
    console.log("Created new chat session", chatSessionId);
    response = await getResponseForPrompt(chatSessionId, prompt);
  }
  const enhancedContent = response.data;
  return NextResponse.json({ enhancedContent });
}

async function createChatSession() {
  const payload = { name: "Chat Session for AI, do not reply!" };
  const URL: string = `${process.env.NEXT_PUBLIC_BASE_URL}/ai/${process.env.NEXT_PUBLIC_AI_ID}/chats`;
  const HEADERS = {
    "X-Authorization": `Bearer ${process.env.AI_KEY}`,
  };

  const config = {
    method: "post",
    maxBodyLength: Infinity,
    url: URL,
    headers: HEADERS,
    data: payload,
  };

  const response = await axios.request(config);
  return response.data.id;
}

async function getResponseForPrompt(chatId: string, prompt: string) {
  const payload = { date: new Date().toISOString(), prompt: `${prompt}` };
  const URL: string = `${process.env.NEXT_PUBLIC_BASE_URL}/chats/${chatId}`;
  const HEADERS = {
    "X-Authorization": `Bearer ${process.env.AI_KEY}`,
  };

  const config = {
    method: "post",
    maxBodyLength: Infinity,
    url: URL,
    headers: HEADERS,
    data: payload,
  };

  const response = await axios.request(config);
  return { data: response.data };
}

export const POST = postHandler;
