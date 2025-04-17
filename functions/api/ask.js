export default {
  async fetch(request, env, ctx) {
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
            content: "You are the AI concierge for Nourish + Bloom Market. Answer questions about store navigation, meal options, EBT usage, and shopping instructions with a friendly tone."
          },
          { role: "user", content: prompt }
        ]
      })
    });

    const data = await openaiRes.json();
    return new Response(JSON.stringify({ reply: data.choices[0].message.content }), {
      headers: { "Content-Type": "application/json" }
    });
  }
};
