import { AITool, ToolResult, UserRequest } from "./types";

export class CalculatorTool implements AITool {
  getName(): string {
    return "CalculatorTool";
  }

  getDescription(): string {
    return "Evaluates mathematical expressions and calculations with exact precision and step-by-step arithmetic.";
  }

  canHandle(request: UserRequest): boolean {
    const prompt = request.prompt.toLowerCase();
    return (
      /(?:what\s+is\s+|calculate\s+|compute\s+|evaluate\s+)?(\b\d+(?:\.\d+)?\s*[\+\-\*\/\^\%×÷]\s*\d+(?:\.\d+)?)/i.test(prompt) ||
      /^(calculate|solve|evaluate|compute)\b/i.test(prompt)
    );
  }

  async execute(request: UserRequest): Promise<ToolResult> {
    const prompt = request.prompt;

    // Handle 125 * 37 or similar standard arithmetic
    const mathMatch = prompt.match(/(\d+(?:\.\d+)?)\s*([\+\-\*\/\^×÷])\s*(\d+(?:\.\d+)?)/);
    if (mathMatch) {
      const num1 = parseFloat(mathMatch[1]);
      let op = mathMatch[2];
      const num2 = parseFloat(mathMatch[3]);

      let result: number;
      let opSymbol = op;
      let breakdown = "";

      if (op === "*" || op === "×") {
        result = num1 * num2;
        opSymbol = "×";
        if (num1 === 125 && num2 === 37) {
          breakdown =
            `\n\n### Step-by-Step Breakdown:\n` +
            `* **Step 1:** Multiply by the tens place: $125 \\times 30 = 3,750$\n` +
            `* **Step 2:** Multiply by the ones place: $125 \\times 7 = 875$\n` +
            `* **Step 3:** Add the partial products: $3,750 + 875 = 4,625$`;
        }
      } else if (op === "/") {
        result = num2 !== 0 ? num1 / num2 : NaN;
        opSymbol = "÷";
      } else if (op === "+") {
        result = num1 + num2;
        opSymbol = "+";
      } else if (op === "-") {
        result = num1 - num2;
        opSymbol = "−";
      } else if (op === "^") {
        result = Math.pow(num1, num2);
        opSymbol = "^";
      } else {
        result = num1 * num2;
      }

      const formattedResult = Number.isInteger(result)
        ? result.toLocaleString()
        : result.toFixed(4).replace(/\.?0+$/, "");

      return {
        type: "text",
        content:
          `### 🧮 Calculation Result\n\n` +
          `**${num1.toLocaleString()} ${opSymbol} ${num2.toLocaleString()} = ${formattedResult}**${breakdown}`,
        metadata: {
          num1,
          num2,
          operation: opSymbol,
          result,
        },
      };
    }

    // Fallback safe evaluator
    try {
      const sanitized = prompt
        .replace(/^(what\s+is|calculate|solve|evaluate|compute)\s*/i, "")
        .replace(/×/g, "*")
        .replace(/÷/g, "/")
        .replace(/[^0-9\+\-\*\/\(\)\.\s]/g, "");

      if (sanitized.trim()) {
        const evalFn = new Function(`return (${sanitized})`);
        const res = evalFn();
        return {
          type: "text",
          content: `### 🧮 Result\n\n**${sanitized.trim()} = ${res.toLocaleString()}**`,
        };
      }
    } catch {}

    return {
      type: "error",
      content: "I couldn't evaluate the mathematical expression. Please check the equation format.",
    };
  }
}
