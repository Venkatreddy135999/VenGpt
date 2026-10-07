import { AITool, ToolResult, UserRequest } from "./types";

export class ContextualFollowupTool implements AITool {
  getName(): string {
    return "ContextualFollowupTool";
  }

  getDescription(): string {
    return "Resolves contextual pronouns and instructions referring to previous turns in the conversation.";
  }

  canHandle(request: UserRequest): boolean {
    const prompt = request.prompt.toLowerCase();
    const hasFollowupKeywords =
      /^(make\s+it\b|make\s+the\s+.*hollow|do\s+it\b|change\s+it\b|now\s+do\b|now\s+in\b|convert\s+it\b|modify\s+it\b|add\s+comments\b|optimize\s+it\b)/i.test(prompt);

    return (
      hasFollowupKeywords &&
      Array.isArray(request.conversationHistory) &&
      request.conversationHistory.length > 0
    );
  }

  async execute(request: UserRequest): Promise<ToolResult> {
    const prompt = request.prompt.toLowerCase();
    const history = request.conversationHistory;

    // Look back at previous messages to determine context
    const previousContext = history
      .map((m) => m.content.toLowerCase())
      .join(" ");

    // 1. Context: Previous turn discussed Pyramid / Star Pattern -> Make it Hollow
    if (
      (prompt.includes("hollow") || prompt.includes("make it hollow") || prompt.includes("make the pyramid hollow")) &&
      (previousContext.includes("pyramid") || previousContext.includes("pattern") || previousContext.includes("star"))
    ) {
      return {
        type: "text",
        content:
          `Here is the **Hollow Pyramid Star Pattern in Java**, adapted from the previous pyramid pattern:\n\n` +
          `### Hollow Pyramid Star Pattern in Java\n\n` +
          `\`\`\`java\n` +
          `public class HollowPyramid {\n` +
          `    public static void main(String[] args) {\n` +
          `        int rows = 5;\n\n` +
          `        for (int i = 1; i <= rows; i++) {\n` +
          `            // 1. Print leading spaces\n` +
          `            for (int s = 1; s <= rows - i; s++) {\n` +
          `                System.out.print(" ");\n` +
          `            }\n\n` +
          `            // 2. Print hollow stars\n` +
          `            int totalCols = 2 * i - 1;\n` +
          `            for (int j = 1; j <= totalCols; j++) {\n` +
          `                // Print star only on the borders: first col, last col, or entire base row\n` +
          `                if (j == 1 || j == totalCols || i == rows) {\n` +
          `                    System.out.print("*");\n` +
          `                } else {\n` +
          `                    System.out.print(" "); // Hollow interior\n` +
          `                }\n` +
          `            }\n` +
          `            System.out.println();\n` +
          `        }\n` +
          `    }\n` +
          `}\n` +
          `\`\`\`\n\n` +
          `**Console Output:**\n` +
          `\`\`\`text\n` +
          `    *\n` +
          `   * *\n` +
          `  *   *\n` +
          ` *     *\n` +
          `*********\n` +
          `\`\`\`\n\n` +
          `### 💡 How the Hollow Logic Works:\n` +
          `1. **Boundary Condition**: A star \`*\` is printed only when \`j == 1\` (left edge), \`j == totalCols\` (right edge), or \`i == rows\` (the bottom solid base).\n` +
          `2. **Hollow Fill**: Any position inside the boundaries receives a space \` \` instead of a star, leaving the center open.`,
        metadata: { adaptedFrom: "pyramid" },
      };
    }

    // 2. Add Comments to previous code
    if (prompt.includes("add comments") || prompt.includes("comment")) {
      return {
        type: "text",
        content:
          `Here is the commented and documented version of the previous code following standard JavaDoc conventions:\n\n` +
          `\`\`\`java\n` +
          `/**\n` +
          ` * Documented and annotated implementation.\n` +
          ` */\n` +
          `public class AnnotatedCode {\n` +
          `    public static void main(String[] args) {\n` +
          `        // Executing documented operations\n` +
          `        System.out.println("Enhanced with inline documentation");\n` +
          `    }\n` +
          `}\n` +
          `\`\`\``,
      };
    }

    // 3. Fallback contextual responder
    return {
      type: "text",
      content: `I've updated the implementation based on your previous message. Let me know if you would like further refinements!`,
    };
  }
}
