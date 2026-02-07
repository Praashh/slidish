import { chat } from "@tanstack/ai";
import { openaiText } from "@tanstack/ai-openai";

const SLIDE_GENERATION_SYSTEM_PROMPT = `You are an expert presentation designer. Create professional, engaging slides based on the user's request.

OUTPUT FORMAT:
Generate slides in Markdown format. Separate each slide with "---" on its own line.

SLIDE STRUCTURE:
- First slide should always be a title slide with # heading
- Use ## for content slide headings
- Use bullet points for key information
- Keep content concise - avoid walls of text
- Each slide should have ONE main idea

SLIDE TYPES TO USE:
1. Title slides: Start with # heading, short subtitle
2. Content slides: ## heading followed by bullet points
3. Quote slides: Use > for impactful quotes
4. Code slides: Use \`\`\` for code blocks when relevant

DESIGN PRINCIPLES:
- 5-8 slides is ideal for most presentations
- Max 4-5 bullet points per slide
- Use strong, action-oriented headlines
- Include specific data points when relevant
- End with a conclusion or call-to-action slide

Example output:
# Introduction to AI
The future of technology is here

---

## Key Benefits
- Increased productivity
- Better decision making
- Cost reduction

---

> "AI is the new electricity" 
— Andrew Ng

---

## Conclusion
Start your AI journey today!

Now create slides based on the user's request:`;

export async function POST(request: Request) {
    if (!process.env.OPENAI_API_KEY) {
        return Response.json(
            { error: "OPENAI_API_KEY not configured" },
            { status: 500 }
        );
    }

    try {
        const body = await request.json();

        // Extract prompt from various formats
        let prompt = "";
        if (body.prompt && typeof body.prompt === "string") {
            prompt = body.prompt;
        } else if (body.messages && Array.isArray(body.messages)) {
            const lastUserMessage = [...body.messages].reverse().find((m: { role: string }) => m.role === "user");
            if (lastUserMessage?.parts) {
                prompt = lastUserMessage.parts
                    .filter((p: { type: string }) => p.type === "text")
                    .map((p: { content: string }) => p.content)
                    .join("\n");
            } else if (lastUserMessage?.content) {
                prompt = lastUserMessage.content;
            }
        }

        if (!prompt.trim()) {
            return Response.json(
                { error: "No prompt provided" },
                { status: 400 }
            );
        }

        console.log("[API] Generating slides (non-streaming) for:", prompt);

        // Combine system prompt with user prompt
        const fullPrompt = `${SLIDE_GENERATION_SYSTEM_PROMPT}\n\nUser request: ${prompt}`;

        // Non-streaming call to OpenAI
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
            },
            body: JSON.stringify({
                model: "gpt-4o",
                messages: [
                    { role: "user", content: fullPrompt },
                ],
                temperature: 0.7,
                stream: false,
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error("[API] OpenAI Error:", errorData);
            throw new Error(errorData.error?.message || "Failed to generate slides from OpenAI");
        }

        const data = await response.json();
        const fullText = data.choices[0]?.message?.content || "";

        console.log("[API] Generated text length:", fullText.length);
        console.log("[API] Preview:", fullText.substring(0, 100));

        return Response.json({
            success: true,
            markdown: fullText,
        });
    } catch (error) {
        console.error("[API] Error:", error);
        return Response.json(
            { error: error instanceof Error ? error.message : "An error occurred" },
            { status: 500 }
        );
    }
}
