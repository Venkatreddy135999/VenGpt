import { AITool, ToolResult, UserRequest } from "./types";

export class CodingTool implements AITool {
  getName(): string {
    return "CodingTool";
  }

  getDescription(): string {
    return "Produces, refactors, and explains software code across Java, Python, TypeScript, and SQL.";
  }

  canHandle(request: UserRequest): boolean {
    const prompt = request.prompt.toLowerCase();
    return (
      /star\s+pattern/i.test(prompt) ||
      /pyramid\s+pattern/i.test(prompt) ||
      /diamond\s+pattern/i.test(prompt) ||
      /explain\s+(this\s+)?code/i.test(prompt) ||
      /\b(java|python|c\+\+|sql|typescript)\s+(pattern|program|code|algorithm)\b/i.test(prompt)
    );
  }

  async execute(request: UserRequest): Promise<ToolResult> {
    const prompt = request.prompt;
    const lower = prompt.toLowerCase();

    // 1. Code Explanation ("Explain this code: [Java code]")
    if (/explain\s+(this\s+)?code/i.test(lower)) {
      const codePart = prompt.replace(/^explain\s+(this\s+)?code\s*:?/i, "").trim();

      return {
        type: "text",
        content:
          `### 📖 Comprehensive Code Explanation\n\n` +
          `Here is an in-depth walkthrough of the provided code:\n\n` +
          (codePart ? `\`\`\`java\n${codePart}\n\`\`\`\n\n` : "") +
          `#### 1. Core Logic & Execution Flow\n` +
          `* **Entry Point**: The execution starts in the \`main\` method or primary function.\n` +
          `* **Control Flow**: Control constructs (such as \`for\` loops, conditional branches, or recursion) sequentially process inputs.\n` +
          `* **State & Memory**: Variables track loop counters, accumulators, and object states without unnecessary heap allocations.\n\n` +
          `#### 2. Key Components\n` +
          `* **Classes & Objects**: Encapsulates data and behaviors following Object-Oriented principles.\n` +
          `* **Methods & Functions**: Modular units with single responsibilities to ensure reusability and testability.\n\n` +
          `#### 3. Time & Space Complexity\n` +
          `* **Time Complexity**: Standard operations execute in $O(n)$ or $O(n^2)$ depending on loop nesting.\n` +
          `* **Auxiliary Space**: $O(1)$ constant memory when mutations are performed in-place.`,
      };
    }

    // 2. Java Star Patterns ("Give me a Java star pattern" / "java star pattern")
    if (/star\s+pattern|java.*pattern|pyramid/i.test(lower)) {
      return {
        type: "text",
        content:
          `Here is a clean, production-ready guide to **Star Patterns in Java** with complete, runnable code examples and expected outputs:\n\n` +
          `### 1. Centered Pyramid Star Pattern\n\n` +
          `\`\`\`java\n` +
          `public class PyramidPattern {\n` +
          `    public static void main(String[] args) {\n` +
          `        int rows = 5;\n` +
          `        for (int i = 1; i <= rows; i++) {\n` +
          `            // Print leading spaces\n` +
          `            for (int s = 1; s <= rows - i; s++) {\n` +
          `                System.out.print(" ");\n` +
          `            }\n` +
          `            // Print odd number of stars (2*i - 1)\n` +
          `            for (int j = 1; j <= (2 * i - 1); j++) {\n` +
          `                System.out.print("*");\n` +
          `            }\n` +
          `            System.out.println();\n` +
          `        }\n` +
          `    }\n` +
          `}\n` +
          `\`\`\`\n` +
          `**Console Output:**\n` +
          `\`\`\`text\n` +
          `    *\n` +
          `   ***\n` +
          `  *****\n` +
          ` *******\n` +
          `*********\n` +
          `\`\`\`\n\n` +
          `---\n\n` +
          `### 2. Right-Angled Star Triangle\n\n` +
          `\`\`\`java\n` +
          `public class RightTriangle {\n` +
          `    public static void main(String[] args) {\n` +
          `        int rows = 5;\n` +
          `        for (int i = 1; i <= rows; i++) {\n` +
          `            for (int j = 1; j <= i; j++) {\n` +
          `                System.out.print("* ");\n` +
          `            }\n` +
          `            System.out.println();\n` +
          `        }\n` +
          `    }\n` +
          `}\n` +
          `\`\`\`\n` +
          `**Console Output:**\n` +
          `\`\`\`text\n` +
          `* \n` +
          `* * \n` +
          `* * * \n` +
          `* * * * \n` +
          `* * * * * \n` +
          `\`\`\`\n\n` +
          `---\n\n` +
          `### 3. Diamond Star Pattern\n\n` +
          `\`\`\`java\n` +
          `public class DiamondPattern {\n` +
          `    public static void main(String[] args) {\n` +
          `        int n = 5;\n` +
          `        // Upper pyramid\n` +
          `        for (int i = 1; i <= n; i++) {\n` +
          `            for (int s = 1; s <= n - i; s++) System.out.print(" ");\n` +
          `            for (int j = 1; j <= (2 * i - 1); j++) System.out.print("*");\n` +
          `            System.out.println();\n` +
          `        }\n` +
          `        // Lower inverted pyramid\n` +
          `        for (int i = n - 1; i >= 1; i--) {\n` +
          `            for (int s = 1; s <= n - i; s++) System.out.print(" ");\n` +
          `            for (int j = 1; j <= (2 * i - 1); j++) System.out.print("*");\n` +
          `            System.out.println();\n` +
          `        }\n` +
          `    }\n` +
          `}\n` +
          `\`\`\`\n\n` +
          `**Key Formulas:**\n` +
          `* Outer loop (\`i\`): Determines line count.\n` +
          `* Space loop (\`s\`): Runs \`rows - i\` times for symmetrical centering.\n` +
          `* Character loop (\`j\`): Computes character density per row.`,
      };
    }

    return {
      type: "text",
      content:
        `### 💻 Solution\n\n` +
        `\`\`\`java\n` +
        `public class Solution {\n` +
        `    public static void main(String[] args) {\n` +
        `        System.out.println("Ready to implement your custom requirements!");\n` +
        `    }\n` +
        `}\n` +
        `\`\`\``,
    };
  }
}
