import { getModelById } from "@/lib/ai";

/**
 * Intelligent contextual response generator for local/preview mode.
 * Understands user intent (greetings, explanations, code generation, reasoning, general chat)
 * and generates realistic, Markdown-formatted streaming responses.
 */
export function generateContextualResponse(
  userPrompt: string,
  modelId: string
): string {
  const model = getModelById(modelId);
  const prompt = userPrompt.toLowerCase().trim();

  // 1. Greetings & Small Talk
  if (
    /^(hi|hello|hey|howdy|greetings|good\s+(morning|afternoon|evening))/i.test(prompt) ||
    /how\s+are\s+you/i.test(prompt) ||
    /how's\s+it\s+going/i.test(prompt)
  ) {
    return (
      `Hello! I'm doing great, thank you for asking! 😊\n\n` +
      `I'm your **AI Assistant** (currently running with **${model.name}** mode). I'm ready to help you with:\n\n` +
      `* **Coding & Debugging:** Writing algorithms, building web components, and troubleshooting errors.\n` +
      `* **Explanations & Learning:** Breaking down complex concepts simply step-by-step.\n` +
      `* **Brainstorming & Writing:** Generating ideas, drafting documents, and structuring plans.\n\n` +
      `How can I assist you today? What are you working on?`
    );
  }

  // 2. Identity / Capabilities
  if (
    /who\s+are\s+you/i.test(prompt) ||
    /what\s+can\s+you\s+do/i.test(prompt) ||
    /what\s+is\s+your\s+name/i.test(prompt)
  ) {
    return (
      `I am **AI Assistant**, an advanced conversational AI application.\n\n` +
      `You currently have **${model.name}** (${model.provider}) selected.\n\n` +
      `### What I Can Do:\n` +
      `1. **Answer Technical Questions:** Software architecture, algorithms, cloud infrastructure, and databases.\n` +
      `2. **Generate Production Code:** Clean, typed code in TypeScript, Python, Rust, Go, SQL, and more.\n` +
      `3. **Step-by-Step Reasoning:** Mathematical derivations, logic puzzles, and decision trade-offs.\n` +
      `4. **Rich Markdown Output:** Formatted tables, checklists, blockquotes, and copyable code blocks.\n\n` +
      `Feel free to test any prompt or switch models using the top header dropdown!`
    );
  }

  // 3. Coding Requests (Python, JavaScript, TypeScript, sorting, algorithms, APIs)
  if (
    /code|python|javascript|typescript|function|sort|algorithm|api|component|react/i.test(prompt)
  ) {
    if (/python/i.test(prompt) || /sort/i.test(prompt)) {
      return (
        `Here is an efficient and clean Python implementation with detailed comments:\n\n` +
        `\`\`\`python\n` +
        `from typing import List, Any\n\n` +
        `def quick_sort(items: List[Any]) -> List[Any]:\n` +
        `    """\n` +
        `    Performs QuickSort on a list of comparable elements.\n` +
        `    Time Complexity: Average O(n log n), Space Complexity: O(log n)\n` +
        `    """\n` +
        `    if len(items) <= 1:\n` +
        `        return items\n` +
        `    \n` +
        `    pivot = items[len(items) // 2]\n` +
        `    left = [x for x in items if x < pivot]\n` +
        `    middle = [x for x in items if x == pivot]\n` +
        `    right = [x for x in items if x > pivot]\n` +
        `    \n` +
        `    return quick_sort(left) + middle + quick_sort(right)\n\n` +
        `# Example Usage:\n` +
        `numbers = [64, 34, 25, 12, 22, 11, 90]\n` +
        `sorted_numbers = quick_sort(numbers)\n` +
        `print("Original:", numbers)\n` +
        `print("Sorted:  ", sorted_numbers)\n` +
        `\`\`\`\n\n` +
        `### Key Highlights:\n` +
        `* **Pivot Selection:** Chooses the middle element to mitigate worst-case sorted inputs.\n` +
        `* **Type Hints:** Uses \`List[Any]\` for clear typing contracts.\n` +
        `* **Readability:** Clean list comprehensions partition elements in a single pass.`
      );
    }

    return (
      `Here is a production-ready solution in TypeScript:\n\n` +
      `\`\`\`typescript\n` +
      `interface ApiResponse<T> {\n` +
      `  success: boolean;\n` +
      `  data?: T;\n` +
      `  error?: string;\n` +
      `}\n\n` +
      `export async function fetchData<T>(endpoint: string): Promise<ApiResponse<T>> {\n` +
      `  try {\n` +
      `    const res = await fetch(endpoint, {\n` +
      `      headers: { "Content-Type": "application/json" },\n` +
      `    });\n` +
      `    \n` +
      `    if (!res.ok) {\n` +
      `      throw new Error(\`HTTP error! status: \${res.status}\`);\n` +
      `    }\n` +
      `    \n` +
      `    const data = await res.json();\n` +
      `    return { success: true, data };\n` +
      `  } catch (err: any) {\n` +
      `    return { success: false, error: err.message || "Unknown error" };\n` +
      `  }\n` +
      `}\n` +
      `\`\`\`\n\n` +
      `Click the **Copy** button on the code block to copy this snippet to your clipboard.`
    );
  }

  // 4. Quantum Computing or Science concepts
  if (/quantum|computing|qubit|physics|blockchain|ai|artificial\s+intelligence/i.test(prompt)) {
    return (
      `### Understanding Quantum Computing Simply\n\n` +
      `Imagine you are navigating a hedge maze:\n\n` +
      `1. **Classical Computer (Bits):** Like one person trying each pathway one at a time. If it hits a dead end, it turns around and tries the next branch.\n` +
      `2. **Quantum Computer (Qubits):** Like a drop of water poured into the maze that flows down **all pathways simultaneously**.\n\n` +
      `#### Core Quantum Principles:\n` +
      `* **Superposition:** A classical bit is either 0 or 1. A qubit can exist in a linear combination of both states simultaneously.\n` +
      `* **Entanglement:** Two qubits can be correlated such that the quantum state of one instantly informs the state of the other, no matter the physical distance.\n` +
      `* **Interference:** Quantum algorithms use interference to amplify correct solutions and cancel out incorrect ones.\n\n` +
      `| Concept | Classical Bits | Quantum Qubits |\n` +
      `| :--- | :--- | :--- |\n` +
      `| **Basic State** | 0 or 1 | \\(\\alpha\|0\\rangle + \\beta\|1\\rangle\\) |\n` +
      `| **Processing** | Sequential / Multi-core | High-dimensional parallelism |\n` +
      `| **Primary Advantage** | General computation | Cryptography, molecular simulation, optimization |\n\n` +
      `Let me know if you would like to explore any of these areas in deeper detail!`
    );
  }

  // 5. General intelligent response
  return (
    `### **${model.name}** (${model.provider})\n\n` +
    `Regarding your question:\n` +
    `> *"${userPrompt}"*\n\n` +
    `Here is a direct breakdown:\n\n` +
    `1. **Context & Relevance:** This is a key topic. In general practice, the best approach is to break the problem into clear, testable components.\n` +
    `2. **Best Practices:**\n` +
    `   * Keep designs modular and maintainable.\n` +
    `   * Validate inputs and handle edge cases gracefully.\n` +
    `   * Continuously test performance and user experience.\n\n` +
    `Would you like to dive deeper into any specific aspect or explore an example?`
  );
}
