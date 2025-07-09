
// Mock data for development
export const mockUser = {
  id: '1',
  name: 'John Doe',
  email: 'john@example.com',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
  joinedDate: '2024-01-15',
};

export const mockThreads = [
  {
    id: '1',
    title: 'Understanding React Hooks',
    content: '# React Hooks Deep Dive\n\nReact Hooks revolutionized how we write React components...',
    tags: ['react', 'hooks', 'javascript'],
    author: {
      id: '1',
      name: 'John Doe',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
    },
    contributors: [
      {
        id: '2',
        name: 'Jane Smith',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jane',
      },
    ],
    createdAt: '2024-01-20T10:00:00Z',
    updatedAt: '2024-01-20T15:30:00Z',
    aiSummary: 'This thread explains the fundamentals of React Hooks, including useState, useEffect, and custom hooks.',
    views: 245,
    likes: 18,
  },
  {
    id: '2',
    title: 'AI and Machine Learning Basics',
    content: '# Introduction to AI/ML\n\nArtificial Intelligence and Machine Learning are transforming...',
    tags: ['ai', 'machine-learning', 'python'],
    author: {
      id: '2',
      name: 'Jane Smith',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jane',
    },
    contributors: [],
    createdAt: '2024-01-19T14:20:00Z',
    updatedAt: '2024-01-19T16:45:00Z',
    aiSummary: 'Comprehensive overview of AI/ML concepts, algorithms, and practical applications.',
    views: 189,
    likes: 23,
  },
  {
    id: '3',
    title: 'Web Development Best Practices',
    content: '# Modern Web Development\n\nBuilding scalable and maintainable web applications...',
    tags: ['web-development', 'best-practices', 'performance'],
    author: {
      id: '3',
      name: 'Mike Johnson',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mike',
    },  
    contributors: [
      {
        id: '1',
        name: 'John Doe',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
      },
    ],
    createdAt: '2024-01-18T09:15:00Z',
    updatedAt: '2024-01-18T11:30:00Z',
    aiSummary: 'Essential practices for modern web development including performance optimization and code quality.',
    views: 167,
    likes: 15,
  },
];

export const mockSearchResults = [
  {
    id: '1',
    title: 'Understanding React Hooks',
    content: 'React Hooks revolutionized how we write React components...',
    tags: ['react', 'hooks', 'javascript'],
    author: {
      id: '1',
      name: 'John Doe',
    },
    relevanceScore: 0.95,
    createdAt: '2024-01-20T10:00:00Z',
  },
  {
    id: '3',
    title: 'Web Development Best Practices',
    content: 'Building scalable and maintainable web applications...',
    tags: ['web-development', 'best-practices', 'performance'],
    author: {
      id: '3',
      name: 'Mike Johnson',
    },
    relevanceScore: 0.78,
    createdAt: '2024-01-18T09:15:00Z',
  },
];

export const mockKnowledgeGraph = {
  nodes: [
    { id: '1', label: 'React Hooks', size: 20, group: 'frontend' },
    { id: '2', label: 'AI/ML Basics', size: 15, group: 'ai' },
    { id: '3', label: 'Web Dev Practices', size: 18, group: 'frontend' },
    { id: '4', label: 'JavaScript', size: 25, group: 'language' },
    { id: '5', label: 'Python', size: 22, group: 'language' },
  ],
  links: [
    { source: '1', target: '4', strength: 0.8 },
    { source: '3', target: '4', strength: 0.6 },
    { source: '2', target: '5', strength: 0.9 },
    { source: '1', target: '3', strength: 0.4 },
  ],
};
