export interface MessagePart {
    type: "text" | "thinking" | "file" | "image";
    content: string;
}

export interface ChatMessage {
    id: string;
    role: "user" | "assistant";
    parts: MessagePart[];
}

export interface Chat {
    id: string;
    messages: ChatMessage[];
    createdAt: Date;
    updatedAt: Date;
    isSaved: boolean;
    title?: string;
}

export function isTextPart(
    part: unknown,
): part is { type: "text"; content: string } {
    return (
        typeof part === "object" &&
        part !== null &&
        "type" in part &&
        (part as { type: string }).type === "text" &&
        "content" in part
    );
}

export function isThinkingPart(
    part: unknown,
): part is { type: "thinking"; content: string } {
    return (
        typeof part === "object" &&
        part !== null &&
        "type" in part &&
        (part as { type: string }).type === "thinking" &&
        "content" in part
    );
}
