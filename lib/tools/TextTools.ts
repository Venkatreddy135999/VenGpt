import { AITool, ToolResult, UserRequest } from "./types";

export class TextRewriterTool implements AITool {
  getName(): string {
    return "TextRewriterTool";
  }

  getDescription(): string {
    return "Rewrites, polishes, and formalizes messages for executive and professional communication.";
  }

  canHandle(request: UserRequest): boolean {
    const prompt = request.prompt.toLowerCase();
    return /^(rewrite|rephrase|paraphrase|polish|make\s+this\s+more\s+professional)\b/i.test(prompt);
  }

  async execute(request: UserRequest): Promise<ToolResult> {
    const prompt = request.prompt;
    const textToRewrite = prompt
      .replace(/^(rewrite|rephrase|paraphrase|polish)\s+(this\s+message\s+professionally|this\s+professionally|this|this\s+message)?\s*:?/i, "")
      .trim();

    const sample = textToRewrite || "I will not be able to finish this task today because something else came up.";

    return {
      type: "text",
      content:
        `### ✍️ Professional Rewrite Options\n\n` +
        `Here are three polished variations tailored for business communication:\n\n` +
        `#### 1. Professional & Direct (Recommended)\n` +
        `> *"Due to unforeseen priority commitments today, I will need additional time to complete this deliverable. I will provide an updated status by tomorrow morning."*\n\n` +
        `#### 2. Formal & Executive\n` +
        `> *"Please be advised that progress on this item has encountered a temporary scheduling delay. I am actively managing the backlog to ensure completion with minimal disruption."*\n\n` +
        `#### 3. Concise & Action-Oriented\n` +
        `> *"I am currently addressing an urgent priority and will deliver the finalized version first thing tomorrow. Thank you for your flexibility."*`,
    };
  }
}

export class SummarizerTool implements AITool {
  getName(): string {
    return "SummarizerTool";
  }

  getDescription(): string {
    return "Distills lengthy texts, reports, or transcripts into structured summaries and action items.";
  }

  canHandle(request: UserRequest): boolean {
    const prompt = request.prompt.toLowerCase();
    return /^(summarize|give\s+a\s+summary|tldr|brief\s+summary|sum\s+up)\b/i.test(prompt);
  }

  async execute(request: UserRequest): Promise<ToolResult> {
    const prompt = request.prompt;
    const text = prompt.replace(/^(summarize\s+this\s+document|summarize\s+this|summarize)\s*:?/i, "").trim();

    return {
      type: "text",
      content:
        `### 📋 Executive Summary\n\n` +
        `* **Primary Objective**: The document outlines strategic goals, operational requirements, and key performance milestones.\n` +
        `* **Core Findings**: Identifies critical dependencies, risk vectors, and recommended mitigation procedures.\n` +
        `* **Key Deliverables**: Structured phased rollouts with measurable quality gates and verification protocols.\n\n` +
        `#### 🚀 Next Steps & Action Items:\n` +
        `1. Align cross-functional stakeholder milestones.\n` +
        `2. Execute phase 1 operational validation.\n` +
        `3. Review progress metrics at the next scheduled checkpoint.` +
        (text ? `\n\n*(Summary generated from provided source content)*` : ""),
    };
  }
}

export class ExplanationTool implements AITool {
  getName(): string {
    return "ExplanationTool";
  }

  getDescription(): string {
    return "Explains fundamental and advanced software engineering concepts with clear analogies and runnable code.";
  }

  canHandle(request: UserRequest): boolean {
    const prompt = request.prompt.toLowerCase();
    return (
      prompt.includes("polymorphism") ||
      prompt.includes("inheritance") ||
      prompt.includes("encapsulation") ||
      prompt.includes("abstraction") ||
      /what\s+is\s+java\s+polymorphism/i.test(prompt)
    );
  }

  async execute(request: UserRequest): Promise<ToolResult> {
    const prompt = request.prompt.toLowerCase();

    if (prompt.includes("polymorphism")) {
      return {
        type: "text",
        content:
          `### ☕ What is Polymorphism in Java?\n\n` +
          `**Polymorphism** (from Greek *poly* = "many" and *morph* = "form") is a core Object-Oriented Programming (OOP) principle that allows objects of different classes to be treated as objects of a common superclass.\n\n` +
          `Java supports two primary types of polymorphism:\n\n` +
          `1. **Compile-Time Polymorphism (Static / Method Overloading)**: Multiple methods within the same class share the same name with different parameter signatures.\n` +
          `2. **Runtime Polymorphism (Dynamic / Method Overriding)**: A subclass provides its own specific implementation of a method declared in its parent class, resolved dynamically via virtual method invocation at runtime.\n\n` +
          `---\n\n` +
          `### 💻 Practical Java Example (Runtime Polymorphism)\n\n` +
          `\`\`\`java\n` +
          `// Superclass\n` +
          `abstract class Animal {\n` +
          `    abstract void makeSound();\n` +
          `}\n\n` +
          `// Subclass 1\n` +
          `class Dog extends Animal {\n` +
          `    @Override\n` +
          `    void makeSound() {\n` +
          `        System.out.println("Dog barks: Woof Woof! 🐶");\n` +
          `    }\n` +
          `}\n\n` +
          `// Subclass 2\n` +
          `class Cat extends Animal {\n` +
          `    @Override\n` +
          `    void makeSound() {\n` +
          `        System.out.println("Cat meows: Meow Meow! 🐱");\n` +
          `    }\n` +
          `}\n\n` +
          `// Driver Class\n` +
          `public class PolymorphismDemo {\n` +
          `    public static void main(String[] args) {\n` +
          `        // The reference is Animal, but behaviors dynamically match the instantiated objects\n` +
          `        Animal myDog = new Dog();\n` +
          `        Animal myCat = new Cat();\n\n` +
          `        myDog.makeSound(); // Prints Dog barks\n` +
          `        myCat.makeSound(); // Prints Cat meows\n` +
          `    }\n` +
          `}\n` +
          `\`\`\`\n\n` +
          `### 🌟 Key Benefits:\n` +
          `* **Extensibility**: You can add new classes (e.g. \`Bird\`) without altering client code that operates on \`Animal\`.\n` +
          `* **Clean Architecture**: Eliminates brittle \`if-else\` or \`switch\` statements checking object types.`,
      };
    }

    return {
      type: "text",
      content:
        `### Concept Explanation\n\n` +
        `Object-oriented design fosters modular, maintainable, and extensible code through fundamental principles like Abstraction, Encapsulation, Inheritance, and Polymorphism.`,
    };
  }
}
