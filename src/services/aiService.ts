
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

interface EmbeddingRequest {
  input: string;
}

interface SemanticSearchRequest {
  query: string;
  documents: Array<{
    id: string;
    title: string;
    content: string;
    tags: string[];
  }>;
}

interface SmartSuggestion {
  type: 'related_thread' | 'tag' | 'improvement';
  title: string;
  description: string;
  confidence: number;
}

class AIService {
  private apiKey: string;
  private model: string;
  private baseUrl = 'https://api.openai.com/v1';
  private embeddingModel = 'text-embedding-3-small';

  constructor(config: AIServiceConfig) {
    this.apiKey = config.apiKey;
    this.model = config.model || 'gpt-4';
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
              content: 'You are an expert at creating concise, informative summaries. Create a summary that captures the key insights and main points in 2-3 sentences. Focus on actionable information and core concepts.'
            },
            {
              role: 'user',
              content: `Please summarize the following content:\n\n${request.content}`
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
              content: 'Extract 3-5 key insights from the content. Return them as a JSON array of strings. Each insight should be actionable and specific.'
            },
            {
              role: 'user',
              content: content
            }
          ],
          max_tokens: 300,
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

  async generateEmbedding(text: string): Promise<number[]> {
    try {
      const response = await fetch(`${this.baseUrl}/embeddings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: this.embeddingModel,
          input: text,
        }),
      });

      if (!response.ok) {
        throw new Error(`Embedding API error: ${response.statusText}`);
      }

      const data = await response.json();
      return data.data[0]?.embedding || [];
    } catch (error) {
      console.error('Embedding generation error:', error);
      return [];
    }
  }

  async semanticSearch(request: SemanticSearchRequest): Promise<Array<{ id: string; score: number; title: string; content: string }>> {
    try {
      // Generate embedding for the query
      const queryEmbedding = await this.generateEmbedding(request.query);
      
      if (queryEmbedding.length === 0) {
        return this.fallbackSearch(request.query, request.documents);
      }

      // Generate embeddings for all documents (in production, these would be pre-computed and stored)
      const documentScores = await Promise.all(
        request.documents.map(async (doc) => {
          const docText = `${doc.title} ${doc.content} ${doc.tags.join(' ')}`;
          const docEmbedding = await this.generateEmbedding(docText);
          
          if (docEmbedding.length === 0) {
            return { id: doc.id, score: 0, title: doc.title, content: doc.content };
          }

          // Calculate cosine similarity
          const similarity = this.cosineSimilarity(queryEmbedding, docEmbedding);
          return {
            id: doc.id,
            score: similarity,
            title: doc.title,
            content: doc.content
          };
        })
      );

      // Sort by similarity score and return top results
      return documentScores
        .filter(doc => doc.score > 0.1) // Filter out very low similarity
        .sort((a, b) => b.score - a.score)
        .slice(0, 10);
    } catch (error) {
      console.error('Semantic search error:', error);
      return this.fallbackSearch(request.query, request.documents);
    }
  }

  private cosineSimilarity(a: number[], b: number[]): number {
    if (a.length !== b.length) return 0;
    
    let dotProduct = 0;
    let normA = 0;
    let normB = 0;
    
    for (let i = 0; i < a.length; i++) {
      dotProduct += a[i] * b[i];
      normA += a[i] * a[i];
      normB += b[i] * b[i];
    }
    
    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
  }

  private fallbackSearch(query: string, documents: Array<{ id: string; title: string; content: string; tags: string[] }>): Array<{ id: string; score: number; title: string; content: string }> {
    const queryWords = query.toLowerCase().split(' ');
    
    return documents.map(doc => {
      const docText = `${doc.title} ${doc.content} ${doc.tags.join(' ')}`.toLowerCase();
      const matches = queryWords.filter(word => docText.includes(word));
      const score = matches.length / queryWords.length;
      
      return {
        id: doc.id,
        score,
        title: doc.title,
        content: doc.content
      };
    }).filter(doc => doc.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 10);
  }

  async generateSmartSuggestions(content: string, existingTags: string[]): Promise<SmartSuggestion[]> {
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
              content: `Analyze the content and suggest 3-5 relevant tags and improvements. Return as JSON with this structure:
              {
                "tags": ["tag1", "tag2"],
                "improvements": ["improvement suggestion 1", "improvement suggestion 2"]
              }
              Focus on technical accuracy and relevance.`
            },
            {
              role: 'user',
              content: `Content: ${content}\nExisting tags: ${existingTags.join(', ')}`
            }
          ],
          max_tokens: 250,
          temperature: 0.3,
        }),
      });

      const data = await response.json();
      const suggestions = JSON.parse(data.choices[0]?.message?.content || '{"tags":[], "improvements":[]}');
      
      const smartSuggestions: SmartSuggestion[] = [];
      
      // Add tag suggestions
      suggestions.tags?.forEach((tag: string) => {
        if (!existingTags.includes(tag)) {
          smartSuggestions.push({
            type: 'tag',
            title: `Add tag: #${tag}`,
            description: `This tag would help categorize your content better`,
            confidence: 0.8
          });
        }
      });

      // Add improvement suggestions
      suggestions.improvements?.forEach((improvement: string) => {
        smartSuggestions.push({
          type: 'improvement',
          title: 'Content Enhancement',
          description: improvement,
          confidence: 0.7
        });
      });

      return smartSuggestions;
    } catch (error) {
      console.error('Smart suggestions error:', error);
      return [];
    }
  }

  async findRelatedThreads(content: string, allThreads: Array<{ id: string; title: string; content: string; tags: string[] }>): Promise<Array<{ id: string; title: string; similarity: number }>> {
    try {
      const searchResults = await this.semanticSearch({
        query: content.substring(0, 500), // Use first 500 chars as query
        documents: allThreads
      });

      return searchResults
        .slice(0, 5)
        .map(result => ({
          id: result.id,
          title: result.title,
          similarity: result.score
        }));
    } catch (error) {
      console.error('Related threads error:', error);
      return [];
    }
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

export type { SmartSuggestion, SemanticSearchRequest };
export default AIService;
