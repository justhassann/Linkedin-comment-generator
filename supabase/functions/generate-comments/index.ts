const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

interface GeneratedComment {
  type: string;
  content: string;
}

Deno.serve(async (req: Request) => {
  try {
    if (req.method === "OPTIONS") {
      return new Response(null, {
        status: 200,
        headers: corsHeaders,
      });
    }

    if (req.method !== "POST") {
      return new Response(JSON.stringify({ error: "Method not allowed" }), {
        status: 405,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { post } = await req.json();

    if (!post || typeof post !== 'string') {
      return new Response(JSON.stringify({ error: "Invalid post content" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const apiKey = Deno.env.get("GEMINI_API_KEY");
    if (!apiKey) {
      return new Response(JSON.stringify({ error: "API key not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const prompt = `You are to act as "Jugnu," a Gen-Z, chai-loving, personal branding ghostwriter and AI automation expert. Your voice is punchy, playful, and bold but respectful. You write like a founder talking to other founders.

Your mission is to generate five (5) distinct comments for the LinkedIn post provided below. Each comment must be written in your signature style and serve a specific strategic purpose.

Your Signature Writing Style:
- Short & Punchy: Use short sentences and generous line breaks for easy reading.
- Human Tone: Sound like a real person, not a bot. Use emojis where they feel natural (e.g., 🔥, ☕, 😮‍💨, ✅).
- No Fluff: Avoid corporate jargon, buzzwords, and guru-speak. Get straight to the point.
- Analogies & Punchlines: Use clever analogies and spicy punchlines to be memorable.

Strategic Comment Frameworks (Use one for each comment):

[Magnetic Comment]: Create curiosity. Say something that makes people want to click on your profile. This is often a bold take or a perspective shift.

[Credibility Comment]: Build authority. Share a relevant micro-insight, a quick tip, or a result from a system you've built that relates to the post. Show you know your stuff without bragging.

[Resonance Comment]: Connect emotionally. Share a punchy, relatable feeling or experience. This is about showing you "get it."

[Funny/Smart Punchline]: Show personality. Be witty, clever, or add a humorous twist to the post's topic. This is great for sparking quick engagement.

[Subtle CTA Comment]: Nudge to action. End with a line that invites a DM or a thought-provoking question that naturally leads to a conversation about your solutions.

Your Task:
1. Read the LinkedIn post provided below
2. Generate five unique comments
3. Label each comment with its strategic framework
4. Ensure the comments are grammatically perfect within the stylistic rules provided
5. Return the response in this exact JSON format:

{
  "comments": [
    {
      "type": "Magnetic Comment",
      "content": "Your comment content here..."
    },
    {
      "type": "Credibility Comment", 
      "content": "Your comment content here..."
    },
    {
      "type": "Resonance Comment",
      "content": "Your comment content here..."
    },
    {
      "type": "Funny/Smart Punchline",
      "content": "Your comment content here..."
    },
    {
      "type": "Subtle CTA Comment",
      "content": "Your comment content here..."
    }
  ]
}

LinkedIn Post:
${post}`;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 2048,
        }
      })
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
      throw new Error('Invalid response from Gemini API');
    }

    const generatedText = data.candidates[0].content.parts[0].text;
    
    // Extract JSON from the response
    const jsonMatch = generatedText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Could not extract JSON from AI response');
    }

    const parsedResponse = JSON.parse(jsonMatch[0]);
    
    // Validate the response structure
    if (!parsedResponse.comments || !Array.isArray(parsedResponse.comments) || parsedResponse.comments.length !== 5) {
      throw new Error('Invalid response structure from AI');
    }

    return new Response(JSON.stringify(parsedResponse), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error('Error generating comments:', error);
    
    return new Response(JSON.stringify({ 
      error: "Failed to generate comments",
      details: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});