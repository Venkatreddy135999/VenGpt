import { getModelById } from "@/lib/ai";

/**
 * Intelligent contextual response generator for local/fallback mode.
 * Understands user intent, specific languages (Java, Python, C++, SQL, TS),
 * greetings, emotional nuances, and general technical questions.
 */
export function generateContextualResponse(
  userPrompt: string,
  modelId: string
): string {
  const model = getModelById(modelId);
  const prompt = userPrompt.toLowerCase().trim();

  // 1. Warm Personal & Emotional Statements ("i love you", "you're great", etc.)
  if (/i\s+love\s+you/i.test(prompt) || /love\s+u/i.test(prompt)) {
    return (
      `Thank you so much! That's very kind of you to say. 😊\n\n` +
      `As an AI assistant, I don't experience feelings the way humans do, but I'm truly glad I can help you and be here for you. How can I assist you with your projects, coding, or learning today?`
    );
  }

  if (/you('re| are)\s+(awesome|great|amazing|cool|smart|best)/i.test(prompt)) {
    return (
      `Thank you! I really appreciate the kind words. 😄\n\n` +
      `I'm always ready to help you brainstorm, code, debug, or learn something new. What would you like to explore next?`
    );
  }

  // 2. Greetings & Small Talk
  if (
    /^(hi|hello|hey|howdy|greetings|good\s+(morning|afternoon|evening))/i.test(prompt) ||
    /how\s+are\s+you/i.test(prompt) ||
    /how('s| is)\s+it\s+going/i.test(prompt)
  ) {
    return (
      `Hello! I'm doing great, thank you for asking! 😊\n\n` +
      `How can I help you today? Whether you need code snippets, debugging, architectural advice, or explanations, feel free to ask!`
    );
  }

  // 3. Identity / Capabilities
  if (
    /who\s+are\s+you/i.test(prompt) ||
    /what\s+can\s+you\s+do/i.test(prompt) ||
    /what\s+is\s+your\s+name/i.test(prompt)
  ) {
    return (
      `I am **VenGPT**, a modern ChatGPT-style AI assistant with multi-tool capabilities.\n\n` +
      `You are currently chatting with **${model.name}** (${model.provider}).\n\n` +
      `### Core Capabilities:\n` +
      `* **Software Engineering:** Full-stack development, algorithms, system architecture, database design, and debugging across all major languages.\n` +
      `* **Prompt Library:** 300+ prompt personas and roles across engineering, writing, and career coaching.\n` +
      `* **Explanations & Tutorials:** Breaking down complex mathematical, scientific, and computer science concepts step-by-step.\n` +
      `* **Code Syntax & Export:** Syntax-highlighted code blocks with copy buttons, plus Markdown/JSON export.\n\n` +
      `What would you like to work on?`
    );
  }

  // 3b. Cricket Statistics & Queries (Accurate All-Time Records)
  if (
    /cricket|runs|odi|sachin|kohli|rohit|tendulkar|world\s*cup/i.test(prompt) &&
    (/most\s+runs|highest\s+runs|odi\s+runs|run\s+scorer|top\s+runs|record/i.test(prompt) || /most\s+runs/i.test(prompt) || /runs\s+in\s+odi/i.test(prompt))
  ) {
    return (
      `Here is the accurate, official list of the **all-time highest run-scorers in One Day International (ODI) cricket history**:\n\n` +
      `### 🏏 Top 10 All-Time Highest Run Scorers in ODIs\n\n` +
      `| Rank | Player | Country | Runs | Matches | Innings | Average | 100s | 50s | Highest |\n` +
      `| :--- | :--- | :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: |\n` +
      `| **1** | **Sachin Tendulkar** | 🇮🇳 India | **18,426** | 463 | 452 | 44.83 | 49 | 96 | 200* |\n` +
      `| **2** | **Kumar Sangakkara** | 🇱🇰 Sri Lanka | **14,234** | 404 | 380 | 41.98 | 25 | 93 | 169 |\n` +
      `| **3** | **Virat Kohli** | 🇮🇳 India | **13,906** | 295 | 283 | 58.18 | 50 | 72 | 183 |\n` +
      `| **4** | **Ricky Ponting** | 🇦🇺 Australia | **13,704** | 375 | 365 | 42.03 | 30 | 82 | 164 |\n` +
      `| **5** | **Sanath Jayasuriya** | 🇱🇰 Sri Lanka | **13,430** | 445 | 433 | 32.36 | 28 | 68 | 189 |\n` +
      `| **6** | **Mahela Jayawardene** | 🇱🇰 Sri Lanka | **12,650** | 448 | 418 | 33.37 | 19 | 77 | 144 |\n` +
      `| **7** | **Inzamam-ul-Haq** | 🇵🇰 Pakistan | **11,739** | 378 | 350 | 39.52 | 10 | 83 | 137* |\n` +
      `| **8** | **Jacques Kallis** | 🇿🇦 South Africa | **11,579** | 328 | 314 | 44.36 | 17 | 86 | 139 |\n` +
      `| **9** | **Sourav Ganguly** | 🇮🇳 India | **11,363** | 311 | 300 | 41.02 | 22 | 72 | 183 |\n` +
      `| **10** | **Rahul Dravid** | 🇮🇳 India | **10,889** | 344 | 318 | 39.16 | 12 | 83 | 153 |\n\n` +
      `*(Note: Active Indian captain **Rohit Sharma** sits right behind them with **10,866+ runs** in 265 matches, holding the world record for highest individual ODI score of 264.)*\n\n` +
      `### 🌟 Key Highlights & Records:\n` +
      `* **Sachin Tendulkar** remains the unchallenged **#1 run-scorer** with 18,426 ODI runs and was the first male batter to score an ODI double-century (200* vs South Africa in 2010).\n` +
      `* **Virat Kohli** holds the world record for the **most centuries in ODI cricket (50 hundreds)**, overtaking Tendulkar's 49 during the 2023 ICC World Cup.\n` +
      `* **Highest Average**: Among batters with over 10,000 ODI runs, **Virat Kohli** possesses by far the highest batting average (**58.18**).`
    );
  }

  // 4a. Star & Console Patterns in Java (when asking for pattern, star, pyramid, etc.)
  if (
    /star/i.test(prompt) ||
    (/pattern/i.test(prompt) && !/design\s+pattern|architectural\s+pattern|gof/i.test(prompt))
  ) {
    return (
      `Here is a clean, complete guide to **Star and Number Patterns in Java** with simple nested loops and expected console outputs:\n\n` +
      `### 1. Right-Angled Star Triangle (Left-Aligned)\n\n` +
      `\`\`\`java\n` +
      `public class RightTriangle {\n` +
      `    public static void main(String[] args) {\n` +
      `        int n = 5;\n` +
      `        for (int i = 1; i <= n; i++) {\n` +
      `            for (int j = 1; j <= i; j++) {\n` +
      `                System.out.print("* ");\n` +
      `            }\n` +
      `            System.out.println();\n` +
      `        }\n` +
      `    }\n` +
      `}\n` +
      `\`\`\`\n` +
      `**Output:**\n` +
      `\`\`\`\n` +
      `* \n` +
      `* * \n` +
      `* * * \n` +
      `* * * * \n` +
      `* * * * * \n` +
      `\`\`\`\n\n` +
      `---\n\n` +
      `### 2. Centered Pyramid Star Pattern\n\n` +
      `\`\`\`java\n` +
      `public class PyramidPattern {\n` +
      `    public static void main(String[] args) {\n` +
      `        int n = 5;\n` +
      `        for (int i = 1; i <= n; i++) {\n` +
      `            // Print leading spaces\n` +
      `            for (int s = 1; s <= n - i; s++) {\n` +
      `                System.out.print(" ");\n` +
      `            }\n` +
      `            // Print stars (2*i - 1)\n` +
      `            for (int j = 1; j <= (2 * i - 1); j++) {\n` +
      `                System.out.print("*");\n` +
      `            }\n` +
      `            System.out.println();\n` +
      `        }\n` +
      `    }\n` +
      `}\n` +
      `\`\`\`\n` +
      `**Output:**\n` +
      `\`\`\`\n` +
      `    *\n` +
      `   ***\n` +
      `  *****\n` +
      ` *******\n` +
      `*********\n` +
      `\`\`\`\n\n` +
      `---\n\n` +
      `### 3. Inverted Pyramid Pattern\n\n` +
      `\`\`\`java\n` +
      `public class InvertedPyramid {\n` +
      `    public static void main(String[] args) {\n` +
      `        int n = 5;\n` +
      `        for (int i = n; i >= 1; i--) {\n` +
      `            for (int s = 1; s <= n - i; s++) {\n` +
      `                System.out.print(" ");\n` +
      `            }\n` +
      `            for (int j = 1; j <= (2 * i - 1); j++) {\n` +
      `                System.out.print("*");\n` +
      `            }\n` +
      `            System.out.println();\n` +
      `        }\n` +
      `    }\n` +
      `}\n` +
      `\`\`\`\n\n` +
      `---\n\n` +
      `### 4. Diamond Star Pattern\n\n` +
      `\`\`\`java\n` +
      `public class DiamondPattern {\n` +
      `    public static void main(String[] args) {\n` +
      `        int n = 5;\n` +
      `        // Top half\n` +
      `        for (int i = 1; i <= n; i++) {\n` +
      `            for (int s = 1; s <= n - i; s++) System.out.print(" ");\n` +
      `            for (int j = 1; j <= (2 * i - 1); j++) System.out.print("*");\n` +
      `            System.out.println();\n` +
      `        }\n` +
      `        // Bottom half\n` +
      `        for (int i = n - 1; i >= 1; i--) {\n` +
      `            for (int s = 1; s <= n - i; s++) System.out.print(" ");\n` +
      `            for (int j = 1; j <= (2 * i - 1); j++) System.out.print("*");\n` +
      `            System.out.println();\n` +
      `        }\n` +
      `    }\n` +
      `}\n` +
      `\`\`\`\n\n` +
      `---\n\n` +
      `### 5. Number Triangle Pattern (Floyd's Triangle)\n\n` +
      `\`\`\`java\n` +
      `public class NumberTriangle {\n` +
      `    public static void main(String[] args) {\n` +
      `        int n = 5, num = 1;\n` +
      `        for (int i = 1; i <= n; i++) {\n` +
      `            for (int j = 1; j <= i; j++) {\n` +
      `                System.out.print(num + " ");\n` +
      `                num++;\n` +
      `            }\n` +
      `            System.out.println();\n` +
      `        }\n` +
      `    }\n` +
      `}\n` +
      `\`\`\`\n\n` +
      `**Key Logic Formula:**\n` +
      `1. **Outer loop (\`i\`)**: Controls the number of rows from \`1\` to \`n\`.\n` +
      `2. **Space loop (\`s\`)**: Runs \`n - i\` times to shift stars to the center.\n` +
      `3. **Inner loop (\`j\`)**: Runs \`2 * i - 1\` times for odd-count stars per line in a pyramid.`
    );
  }

  // 4b. Software Design Patterns in Java (when specifically asked for design pattern)
  if (/design\s+pattern|singleton|factory\s+pattern|observer\s+pattern/i.test(prompt)) {
    return (
      `Here is a clean, production-ready guide to the most essential **Design Patterns in Java** with complete, runnable code examples:\n\n` +
      `### 1. Singleton Pattern (Thread-Safe Double-Checked Locking)\n` +
      `Ensures only one instance of a class exists across the entire application lifetime.\n\n` +
      `\`\`\`java\n` +
      `public class DatabaseConnection {\n` +
      `    // volatile ensures changes are immediately visible across threads\n` +
      `    private static volatile DatabaseConnection instance;\n` +
      `    private String connectionUrl;\n\n` +
      `    // Private constructor prevents external instantiation\n` +
      `    private DatabaseConnection() {\n` +
      `        this.connectionUrl = "jdbc:postgresql://localhost:5432/main_db";\n` +
      `    }\n\n` +
      `    public static DatabaseConnection getInstance() {\n` +
      `        if (instance == null) {\n` +
      `            synchronized (DatabaseConnection.class) {\n` +
      `                if (instance == null) {\n` +
      `                    instance = new DatabaseConnection();\n` +
      `                }\n` +
      `            }\n` +
      `        }\n` +
      `        return instance;\n` +
      `    }\n\n` +
      `    public void executeQuery(String sql) {\n` +
      `        System.out.println("Executing on " + connectionUrl + ": " + sql);\n` +
      `    }\n` +
      `}\n` +
      `\`\`\`\n\n` +
      `### 2. Factory Pattern\n` +
      `Decouples object creation from client code using an interface.\n\n` +
      `\`\`\`java\n` +
      `// Common Interface\n` +
      `public interface Notification {\n` +
      `    void notifyUser(String message);\n` +
      `}\n\n` +
      `public class EmailNotification implements Notification {\n` +
      `    @Override\n` +
      `    public void notifyUser(String message) {\n` +
      `        System.out.println("Sending Email: " + message);\n` +
      `    }\n` +
      `}\n\n` +
      `public class SMSNotification implements Notification {\n` +
      `    @Override\n` +
      `    public void notifyUser(String message) {\n` +
      `        System.out.println("Sending SMS: " + message);\n` +
      `    }\n` +
      `}\n\n` +
      `// Factory Class\n` +
      `public class NotificationFactory {\n` +
      `    public static Notification createNotification(String channel) {\n` +
      `        if (channel == null || channel.isEmpty()) return null;\n` +
      `        switch (channel.toUpperCase()) {\n` +
      `            case "SMS": return new SMSNotification();\n` +
      `            case "EMAIL": return new EmailNotification();\n` +
      `            default: throw new IllegalArgumentException("Unknown channel: " + channel);\n` +
      `        }\n` +
      `    }\n` +
      `}\n` +
      `\`\`\`\n\n` +
      `### 3. Observer Pattern\n` +
      `Defines a one-to-many dependency so that when one object changes state, all dependents are notified automatically.\n\n` +
      `\`\`\`java\n` +
      `import java.util.ArrayList;\n` +
      `import java.util.List;\n\n` +
      `public interface Observer {\n` +
      `    void update(String news);\n` +
      `}\n\n` +
      `public class NewsAgency {\n` +
      `    private List<Observer> observers = new ArrayList<>();\n` +
      `    private String news;\n\n` +
      `    public void addObserver(Observer observer) {\n` +
      `        observers.add(observer);\n` +
      `    }\n\n` +
      `    public void setNews(String news) {\n` +
      `        this.news = news;\n` +
      `        for (Observer obs : observers) {\n` +
      `            obs.update(news);\n` +
      `        }\n` +
      `    }\n` +
      `}\n` +
      `\`\`\`\n\n` +
      `Would you like to see behavioral patterns like **Strategy** or **Command**, or star/number pattern printing in Java?`
    );
  }

  // 4b. Java star/number patterns
  if (/java\b/i.test(prompt) && /pattern/i.test(prompt)) {
    return (
      `Here is a complete Java program demonstrating common pattern designs (Pyramid, Inverted Triangle, and Number Patterns):\n\n` +
      `\`\`\`java\n` +
      `public class PatternExamples {\n` +
      `    public static void main(String[] args) {\n` +
      `        int rows = 5;\n\n` +
      `        System.out.println("=== 1. Right-Angled Star Triangle ===");\n` +
      `        for (int i = 1; i <= rows; i++) {\n` +
      `            for (int j = 1; j <= i; j++) {\n` +
      `                System.out.print("* ");\n` +
      `            }\n` +
      `            System.out.println();\n` +
      `        }\n\n` +
      `        System.out.println("\\n=== 2. Pyramid Star Pattern ===");\n` +
      `        for (int i = 1; i <= rows; i++) {\n` +
      `            for (int s = 1; s <= rows - i; s++) {\n` +
      `                System.out.print(" ");\n` +
      `            }\n` +
      `            for (int j = 1; j <= (2 * i - 1); j++) {\n` +
      `                System.out.print("*");\n` +
      `            }\n` +
      `            System.out.println();\n` +
      `        }\n\n` +
      `        System.out.println("\\n=== 3. Number Half-Pyramid ===");\n` +
      `        for (int i = 1; i <= rows; i++) {\n` +
      `            for (int j = 1; j <= i; j++) {\n` +
      `                System.out.print(j + " ");\n` +
      `            }\n` +
      `            System.out.println();\n` +
      `        }\n` +
      `    }\n` +
      `}\n` +
      `\`\`\`\n\n` +
      `Each pattern uses nested loops where the outer loop tracks lines and inner loops control spaces and characters.`
    );
  }

  // 4c. General Java requests
  if (/java\b/i.test(prompt) && !/javascript/i.test(prompt)) {
    return (
      `Here is a clean Java implementation:\n\n` +
      `\`\`\`java\n` +
      `import java.util.*;\n\n` +
      `public class Solution {\n` +
      `    public static void main(String[] args) {\n` +
      `        List<String> list = new ArrayList<>(Arrays.asList("Java", "Spring Boot", "Microservices"));\n` +
      `        list.forEach(item -> System.out.println("Processing: " + item));\n` +
      `    }\n` +
      `}\n` +
      `\`\`\`\n\n` +
      `Let me know what specific Java logic or framework (Spring, Hibernate, Collections) you need!`
    );
  }

  // 5. Python Requests
  if (/python/i.test(prompt)) {
    if (/sort/i.test(prompt)) {
      return (
        `Here is an efficient QuickSort algorithm in Python:\n\n` +
        `\`\`\`python\n` +
        `from typing import List\n\n` +
        `def quick_sort(arr: List[int]) -> List[int]:\n` +
        `    """Performs QuickSort: Time O(n log n), Space O(log n)"""\n` +
        `    if len(arr) <= 1:\n` +
        `        return arr\n` +
        `    pivot = arr[len(arr) // 2]\n` +
        `    left = [x for x in arr if x < pivot]\n` +
        `    middle = [x for x in arr if x == pivot]\n` +
        `    right = [x for x in arr if x > pivot]\n` +
        `    return quick_sort(left) + middle + quick_sort(right)\n\n` +
        `numbers = [64, 34, 25, 12, 22, 11, 90]\n` +
        `print("Sorted list:", quick_sort(numbers))\n` +
        `\`\`\``
      );
    }

    return (
      `Here is a clean Python solution:\n\n` +
      `\`\`\`python\n` +
      `def process_data(data: list) -> dict:\n` +
      `    return {\n` +
      `        "count": len(data),\n` +
      `        "unique": list(set(data)),\n` +
      `        "summary": sorted(data)\n` +
      `    }\n\n` +
      `sample = [5, 2, 8, 2, 9, 1]\n` +
      `print(process_data(sample))\n` +
      `\`\`\`\n\n` +
      `Feel free to specify the exact input and expected output for this script!`
    );
  }

  // 6. SQL Requests
  if (/sql|query|database|select|table|join/i.test(prompt)) {
    return (
      `Here is a clean, indexed SQL query solution:\n\n` +
      `\`\`\`sql\n` +
      `-- Optimized query with JOIN and indexing\n` +
      `SELECT \n` +
      `    u.id AS user_id,\n` +
      `    u.name,\n` +
      `    u.email,\n` +
      `    COUNT(c.id) AS total_conversations\n` +
      `FROM users u\n` +
      `LEFT JOIN conversations c ON c.user_id = u.id\n` +
      `WHERE u.active = true\n` +
      `GROUP BY u.id, u.name, u.email\n` +
      `ORDER BY total_conversations DESC;\n` +
      `\`\`\`\n\n` +
      `Make sure an index on \`conversations(user_id)\` exists for optimal scan performance.`
    );
  }

  // 7. React Button or Component Requests
  if (/react/i.test(prompt) && /button/i.test(prompt)) {
    return (
      `Here is how to create a clean, reusable **Button component in React** (with TypeScript and Tailwind CSS):\n\n` +
      `### 1. Reusable Button Component\n\n` +
      `\`\`\`tsx\n` +
      `import React from "react";\n\n` +
      `interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {\n` +
      `  variant?: "primary" | "secondary" | "outline" | "danger";\n` +
      `  isLoading?: boolean;\n` +
      `  children: React.ReactNode;\n` +
      `}\n\n` +
      `export function Button({\n` +
      `  variant = "primary",\n` +
      `  isLoading = false,\n` +
      `  children,\n` +
      `  className = "",\n` +
      `  disabled,\n` +
      `  ...props\n` +
      `}: ButtonProps) {\n` +
      `  const baseStyles = "px-4 py-2 rounded-lg font-medium text-sm transition-all focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed";\n\n` +
      `  const variantStyles = {\n` +
      `    primary: "bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800",\n` +
      `    secondary: "bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-zinc-800 dark:text-zinc-100",\n` +
      `    outline: "border border-gray-300 dark:border-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-800",\n` +
      `    danger: "bg-red-600 text-white hover:bg-red-700",\n` +
      `  };\n\n` +
      `  return (\n` +
      `    <button\n` +
      `      className={\`\${baseStyles} \${variantStyles[variant]} \${className}\`}\n` +
      `      disabled={disabled || isLoading}\n` +
      `      {...props}\n` +
      `    >\n` +
      `      {isLoading ? "Loading..." : children}\n` +
      `    </button>\n` +
      `  );\n` +
      `}\n` +
      `\`\`\`\n\n` +
      `### 2. Example Usage\n\n` +
      `\`\`\`tsx\n` +
      `export default function App() {\n` +
      `  return (\n` +
      `    <div className="flex items-center gap-3 p-6">\n` +
      `      <Button variant="primary" onClick={() => alert("Button clicked!")}>\n` +
      `        Save Changes\n` +
      `      </Button>\n` +
      `      <Button variant="outline">Cancel</Button>\n` +
      `    </div>\n` +
      `  );\n` +
      `}\n` +
      `\`\`\``
    );
  }

  // 8. General programming questions
  if (/algorithm|function|component|react|typescript|javascript|code/i.test(prompt)) {
    return (
      `Here is a modular TypeScript solution designed for production:\n\n` +
      `\`\`\`typescript\n` +
      `export interface TaskResult<T> {\n` +
      `  data: T | null;\n` +
      `  error: string | null;\n` +
      `}\n\n` +
      `export async function executeTask<T>(taskFn: () => Promise<T>): Promise<TaskResult<T>> {\n` +
      `  try {\n` +
      `    const data = await taskFn();\n` +
      `    return { data, error: null };\n` +
      `  } catch (err: any) {\n` +
      `    return { data: null, error: err?.message || "Task failed" };\n` +
      `  }\n` +
      `}\n` +
      `\`\`\`\n\n` +
      `Let me know if you would like me to adapt this to a specific framework (Next.js, Node.js, Express) or add unit tests.`
    );
  }

  // 8. General conversational answer tailored directly to user prompt
  return (
    `I understand you're asking about **${userPrompt}**.\n\n` +
    `To give you the most accurate answer, could you specify any additional details, preferences, or context? ` +
    `Whether you need coding examples, explanations, step-by-step guidance, or problem-solving, I'm here to help!`
  );
}
