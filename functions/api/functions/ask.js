export default {
  async fetch(request, env, ctx) {
    if (request.method !== "POST") {
      return new Response("Method Not Allowed", { status: 405 });
    }

    let prompt = "Hello!";
    try {
      const body = await request.json();
      prompt = body.prompt || prompt;
    } catch (e) {
      return new Response("Invalid JSON", { status: 400 });
    }

    const openaiRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "You are the Nourish + Bloom concierge. Answer questions about store navigation, EBT usage, shopping procedures, and in-store products in a friendly, professional tone."
          },
          {
            role: "user",
            content: prompt
          }
        ]
      })
    });

    const data = await openaiRes.json();
    const reply = data.choices?.[0]?.message?.content || "Sorry, I couldn't understand that.";

    return new Response(JSON.stringify({ reply }), {
      headers: { "Content-Type": "application/json" }
    });
  }
};
Move ask.js to root of functions
