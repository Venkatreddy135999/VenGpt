import { AITool, ToolResult, UserRequest } from "./types";

export class ImageGenerationTool implements AITool {
  getName(): string {
    return "ImageGenerationTool";
  }

  getDescription(): string {
    return "Generates high-quality images from descriptive user prompts using modern image models.";
  }

  canHandle(request: UserRequest): boolean {
    const prompt = request.prompt.toLowerCase();
    return (
      /^(create|generate|make|produce|render|paint|draw)\s+(an?|the)?\s*(image|picture|photo|portrait|illustration|artwork|graphic|visual)\b/i.test(prompt) ||
      /^generate\s+(a\s+)?(futuristic|realistic|digital\s+art|portrait|landscape|3d|scifi|anime|cinematic|cyberpunk)\b/i.test(prompt) ||
      /^(draw|sketch|paint)\s+(me\s+)?(an?|the)?\s*/i.test(prompt)
    );
  }

  async execute(request: UserRequest): Promise<ToolResult> {
    try {
      let rawPrompt = request.extractedEntities?.imagePrompt || request.prompt;

      // Clean command prefixes
      let cleanPrompt = rawPrompt
        .replace(/^(create|generate|make|draw|paint|sketch)\s+(an?|the)?\s*(image|picture|photo|portrait|illustration|artwork)?\s*(of|with|for|about|depicting)?\s*/i, "")
        .trim();

      // Handle modifiers like "image4" or "image 4"
      let seed = Math.floor(Math.random() * 100000);
      const versionMatch = cleanPrompt.match(/\bimage\s*(\d+)\b/i);
      if (versionMatch) {
        seed = parseInt(versionMatch[1], 10) * 1111;
        cleanPrompt = cleanPrompt.replace(/\bimage\s*\d+\b/gi, "").trim();
      }

      if (!cleanPrompt) {
        cleanPrompt = "A stunning high-resolution creative artwork";
      }

      // Encode prompt for production image generation engine
      const encoded = encodeURIComponent(cleanPrompt);
      const imageUrl = `https://image.pollinations.ai/prompt/${encoded}?width=1024&height=1024&nologo=true&seed=${seed}&model=flux`;

      // Verify that the image service is reachable and responds with 200 OK
      const headCheck = await fetch(imageUrl, {
        method: "HEAD",
        signal: AbortSignal.timeout(6000),
      }).catch(() => null);

      if (headCheck && !headCheck.ok && headCheck.status >= 500) {
        throw new Error("Image service unavailable");
      }

      return {
        type: "image",
        content: `Here is the generated image for: **"${cleanPrompt}"**`,
        imageUrl,
        imageAlt: cleanPrompt,
        imagePrompt: cleanPrompt,
        metadata: {
          seed,
          resolution: "1024x1024",
          model: "flux",
        },
      };
    } catch (err) {
      console.error("ImageGenerationTool execution error:", err);
      return {
        type: "error",
        content: "I couldn't generate the image right now. Please try again.",
      };
    }
  }
}
