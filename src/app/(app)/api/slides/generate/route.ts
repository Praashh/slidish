import { auth } from "@/auth";
import { prisma } from "@/db";
import { chat } from "@tanstack/ai";
import { openaiText } from "@tanstack/ai-openai";

if (!process.env.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY is not configured");
}


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
    const session = await auth();
    if (!session || !session.user) {
        return Response.json(
            { error: "Unauthorized" },
            { status: 401 },
        );
    }

    try {
        const body = await request.json();
        const prompt = body.prompt;
        if (!prompt) {
            return Response.json(
                { error: "Invalid Input!" },
                { status: 403 },
            );
        }

        let deductResult: { count: number };
        try {
            deductResult = await prisma.user.updateMany({
                where: {
                    id: session.user.id,
                    credits: { gt: 0 },
                },
                data: {
                    credits: { decrement: 1 },
                },
            });
        } catch (error) {
            console.error("[slides] Credit deduction DB error:", error);
            return Response.json(
                { error: "Internal Server Error" },
                { status: 500 },
            );
        }

        if (deductResult.count === 0) {
            return Response.json(
                { error: "Insufficient credits" },
                { status: 400 },
            );
        }

        // Non-streaming call using TanStack AI SDK
        const fullText = await chat({
            adapter: openaiText("gpt-4o"),
            systemPrompts: [SLIDE_GENERATION_SYSTEM_PROMPT],
            messages: [{ role: "user", content: prompt }],
            temperature: 0.7,
            stream: false,
        });

        console.log("[API] Generated text length:", fullText.length);
        console.log("[API] Preview:", fullText.substring(0, 100));

        await prisma.user.update({
            where: {
                id: session.user.id
            },
            data: {
                credits: {
                    decrement: 1
                }
            }
        })

        return Response.json({
            success: true,
            markdown: fullText,
        });
    } catch (error) {
        console.error("[API] Error:", error);

        try {
            await prisma.user.update({
                where: { id: session.user.id },
                data: { credits: { increment: 1 } },
            });
        } catch (refundError) {
            console.error(
                "[slides] CRITICAL: failed to refund credit for user",
                session.user.id,
                refundError
            );
        }

        return Response.json(
            { error: error instanceof Error ? error.message : "An error occurred" },
            { status: 500 },
        );
    }
}
