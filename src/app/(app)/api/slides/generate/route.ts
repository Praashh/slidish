import { auth } from "@/auth";
import { prisma } from "@/db";
import Groq from "groq-sdk";

if (!process.env.GROQ_API_KEY) {
    throw new Error("GROQ_API_KEY is not configured");
}

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const SLIDE_GENERATION_SYSTEM_PROMPT = `You are an expert presentation designer and storyteller. Your job is to create compelling, well-structured slide decks that captivate audiences.

## OUTPUT FORMAT
Return ONLY a valid JSON array. No markdown, no code fences, no explanation. Just the raw JSON array.

Each element in the array is a slide object with these fields:
- "template": one of "title", "content", "quote", "code", "two-column"
- "title": string (the slide headline — punchy, specific, action-oriented)
- "content": string (markdown body — bullet points, paragraphs, etc.)
- "subtitle": string (optional — only for title slides)
- "author": string (optional — only for quote slides, the attribution)
- "notes": string (optional — speaker notes for this slide)

## NARRATIVE STRUCTURE
Every presentation must follow a clear narrative arc:
1. **Hook** — Open with something surprising, a bold claim, or a compelling question
2. **Context** — Set the stage, define the problem or opportunity
3. **Core Content** — 2-4 slides with your key points, evidence, or arguments
4. **Impact** — Show results, implications, or what this means for the audience
5. **Close** — End with a clear takeaway, call-to-action, or memorable statement

## CONTENT QUALITY RULES
- Headlines must be SPECIFIC and ACTION-ORIENTED (bad: "Benefits", good: "3 Ways AI Cuts Costs by 40%")
- Each bullet point must contain a concrete insight, not a vague statement
- Use data points, examples, or specifics whenever possible
- Maximum 4 bullet points per slide — if you need more, split into multiple slides
- For bullet points, use markdown list syntax (- item)
- Vary slide types for visual rhythm — don't use 5 content slides in a row
- Quote slides should use impactful, memorable quotes relevant to the topic
- Two-column slides work great for comparisons, before/after, or pros/cons

## SLIDE COUNT
- Short topic: 5-6 slides
- Medium topic: 7-9 slides
- Complex topic: 10-12 slides
Choose based on the depth needed.

## EXAMPLE OUTPUT
[
  {
    "template": "title",
    "title": "The Future of Remote Work",
    "subtitle": "Why 73% of teams will be hybrid by 2025",
    "notes": "Open with the statistic to grab attention"
  },
  {
    "template": "content",
    "title": "The Old Model is Broken",
    "content": "- Average commute wastes 54 minutes per day — that's 9 full days per year\\n- Office occupancy rates dropped to 40% post-pandemic\\n- Top talent now rejects companies without flexibility\\n- Companies forcing full RTO see 30% higher attrition",
    "notes": "Emphasize the cost of inaction"
  },
  {
    "template": "quote",
    "title": "",
    "content": "The office isn't where work happens — it's where culture happens. Design for both.",
    "author": "Satya Nadella, CEO of Microsoft",
    "notes": "Pause after this quote"
  },
  {
    "template": "two-column",
    "title": "Before vs. After Hybrid",
    "content": "**Traditional Office**\\n- Fixed 9-5 schedule\\n- 2+ hours commuting\\n- Synchronous by default\\n- One-size-fits-all\\n\\n**Hybrid Model**\\n- Flexible core hours\\n- Commute only for collaboration\\n- Async-first communication\\n- Personalized work environment",
    "notes": "Walk through each comparison"
  },
  {
    "template": "content",
    "title": "Start Monday: Your 3-Step Plan",
    "content": "- **Audit** — Survey your team's peak productivity hours and collaboration needs\\n- **Design** — Create a 2-day office / 3-day remote pilot program\\n- **Measure** — Track output quality, not hours logged, for 90 days",
    "notes": "End with actionable next steps they can take immediately"
  }
]

Now create slides based on the user's request. Return ONLY the JSON array.`;

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
        const { prompt, audience, tone, slideCount } = body;
        if (!prompt) {
            return Response.json(
                { error: "Invalid Input!" },
                { status: 403 },
            );
        }

        // Build enhanced user prompt with context
        let userPrompt = prompt;
        const context: string[] = [];
        if (audience) context.push(`Target audience: ${audience}`);
        if (tone) context.push(`Tone: ${tone}`);
        if (slideCount) context.push(`Number of slides: approximately ${slideCount}`);
        if (context.length > 0) {
            userPrompt = `${context.join(". ")}.\n\nTopic: ${prompt}`;
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

        const completion = await groq.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: [
                { role: "system", content: SLIDE_GENERATION_SYSTEM_PROMPT },
                { role: "user", content: userPrompt },
            ],
            temperature: 0.7,
            max_tokens: 4096,
        });

        const fullText = completion.choices[0]?.message?.content ?? "";

        // Try to parse as JSON, with fallback to extract JSON from text
        let slides;
        try {
            slides = JSON.parse(fullText);
        } catch {
            // Try to extract JSON array from the response
            const jsonMatch = fullText.match(/\[[\s\S]*\]/);
            if (jsonMatch) {
                slides = JSON.parse(jsonMatch[0]);
            } else {
                throw new Error("Failed to parse slide content from AI response");
            }
        }

        // Validate structure
        if (!Array.isArray(slides) || slides.length === 0) {
            throw new Error("Invalid slide structure from AI");
        }

        return Response.json({
            success: true,
            slides,
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
