import { DurableObject } from "cloudflare:workers";

export class ChatSession extends DurableObject {
  constructor(state, env) {
    super(state, env);
    this.state = state;
    // Initialize storage for chat history or load from storage
    this.messages = [];
    // We should try to load existing state if needed, but for now we'll stick to in-memory as per cheat sheet
    // Ideally: this.state.storage.get("messages").then(m => this.messages = m || []);
  }

  async fetch(request) {
    let url = new URL(request.url);

    // Add CORS headers helper
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, HEAD, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };

    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    // GET /chat -> Return history
    if (url.pathname === "/chat" && request.method === "GET") {
      return new Response(JSON.stringify({ messages: this.messages }), {
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    // DELETE /chat -> Clear history
    if (url.pathname === "/chat" && request.method === "DELETE") {
      this.messages = [];
      // await this.state.storage.deleteAll(); // If we were using persistence
      return new Response(JSON.stringify({ success: true }), {
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    if (url.pathname === "/chat" && request.method === "POST") {
      try {
        const body = await request.json();
        const userMessage = body.message;

        if (!userMessage) {
          return new Response(
            JSON.stringify({ error: "No message provided" }),
            { status: 400, headers: corsHeaders },
          );
        }

        // 1. Add User Message to History
        this.messages.push({ role: "user", content: userMessage });

        // 2. Call Workers AI
        const modelId = "@cf/meta/llama-3-8b-instruct"; // Using 8b for speed/reliability during dev

        const inputArgs = {
          messages: [
            {
              role: "system",
              content:
                "You are a senior Linux Network Engineer. Help the user debug SSH, DNS, and Firewall issues. Be concise. You are 'HomeLab Helper'. Don't brag about being a senior Linux Network Engineer.",
            },
            ...this.messages,
          ],
        };
        console.log(
          "DEBUG AI REQUEST:",
          JSON.stringify({ model: modelId, input: inputArgs }, null, 2),
        );

        const response = await this.env.AI.run(modelId, inputArgs);

        // 3. Add AI Response to History
        this.messages.push({ role: "assistant", content: response.response });

        // Optional: Persist state
        // await this.state.storage.put("messages", this.messages);

        return new Response(JSON.stringify({ reply: response.response }), {
          headers: { "Content-Type": "application/json", ...corsHeaders },
        });
      } catch (e) {
        return new Response(JSON.stringify({ error: e.message }), {
          status: 500,
          headers: corsHeaders,
        });
      }
    }

    return new Response("Not Found", { status: 404, headers: corsHeaders });
  }
}

export default {
  async fetch(request, env, ctx) {
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, HEAD, POST, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };

    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    // Basic routing to the Durable Object
    // We use a fixed ID "global-session" for this demo to share state easily.
    // In a real app, this might be based on a session ID or user IP.
    let id = env.CHAT_SESSION.idFromName("global-session");
    let stub = env.CHAT_SESSION.get(id);
    return stub.fetch(request);
  },
};
