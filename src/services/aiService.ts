
interface AIServiceConfig {
  apiKey: string;
  model?: string;
}

interface SummarizeRequest {
  content: string;
  maxLength?: number;
}

interface ChatRequest {
  messages: Array<{
    role: 'system' | 'user' | 'assistant';
    content: string;
  }>;
  maxTokens?: number;
}

class AIService {
  private apiKey: string;
  private model: string;
  private baseUrl = 'https://api.openai.com/v1';

  constructor(config: AIServiceConfig) {
    this.apiKey = config.apiKey;
    this.model = config.model || 'gpt-3.5-turbo';
  }

  async summarizeContent(request: SummarizeRequest): Promise<string> {
    try {
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: this.model,
          messages: [
            {
              role: 'system',
              content: 'You are a helpful assistant that creates concise, informative summaries of knowledge content. Keep summaries under 150 words and focus on key insights.'
            },
            {
              role: 'user',
              content: `Please summarize the following content: ${request.content}`
            }
          ],
          max_tokens: request.maxLength || 150,
          temperature: 0.3,
        }),
      });

      if (!response.ok) {
        throw new Error(`AI API error: ${response.statusText}`);
      }

      const data = await response.json();
      return data.choices[0]?.message?.content || 'Summary unavailable';
    } catch (error) {
      console.error('AI summarization error:', error);
      return 'Unable to generate summary at this time.';
    }
  }

  async generateInsights(content: string): Promise<string[]> {
    try {
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: this.model,
          messages: [
            {
              role: 'system',
              content: 'Generate 3-5 key insights or takeaways from the given content. Return them as a JSON array of strings.'
            },
            {
              role: 'user',
              content: content
            }
          ],
          max_tokens: 200,
          temperature: 0.4,
        }),
      });

      const data = await response.json();
      const insights = JSON.parse(data.choices[0]?.message?.content || '[]');
      return Array.isArray(insights) ? insights : [];
    } catch (error) {
      console.error('AI insights error:', error);
      return ['Key insights unavailable at this time.'];
    }
  }

  async semanticSearch(query: string, documents: string[]): Promise<number[]> {
    // Simplified semantic search - in production, you'd use embeddings
    const scores = documents.map(doc => {
      const queryWords = query.toLowerCase().split(' ');
      const docWords = doc.toLowerCase().split(' ');
      const matches = queryWords.filter(word => docWords.includes(word));
      return matches.length / queryWords.length;
    });
    return scores;
  }
}

// Singleton instance
let aiServiceInstance: AIService | null = null;

export const initializeAIService = (apiKey: string) => {
  aiServiceInstance = new AIService({ apiKey });
};

export const getAIService = (): AIService | null => {
  return aiServiceInstance;
};

export default AIService;
