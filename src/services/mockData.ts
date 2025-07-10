export const mockUsers = [
  {
    id: 'user-1',
    name: 'Alice Johnson',
    avatar: 'https://i.pravatar.cc/150?img=1',
  },
  {
    id: 'user-2',
    name: 'Bob Smith',
    avatar: 'https://i.pravatar.cc/150?img=2',
  },
  {
    id: 'user-3',
    name: 'Charlie Brown',
    avatar: 'https://i.pravatar.cc/150?img=3',
  }
];

export const mockThreads = [
  {
    id: '1',
    title: 'Understanding React Server Components',
    content: `# React Server Components: A Deep Dive

React Server Components represent a new paradigm in React development that allows components to render on the server, reducing the JavaScript bundle size and improving performance.

## Key Benefits

1. **Reduced Bundle Size**: Server components don't ship to the client
2. **Better Performance**: Less JavaScript to parse and execute
3. **Improved SEO**: Content is rendered on the server

## Implementation

\`\`\`jsx
// Server Component
export default function BlogPost({ slug }) {
  const post = await fetchPost(slug);
  return (
    <article>
      <h1>{post.title}</h1>
      <p>{post.content}</p>
    </article>
  );
}
\`\`\`

This is still an experimental feature, but it shows great promise for the future of React applications.`,
    tags: ['react', 'javascript', 'web-development'],
    author: mockUsers[0],
    contributors: [mockUsers[1], mockUsers[2]],
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
    aiSummary: 'Explores React Server Components, their benefits for performance and bundle size reduction, and implementation patterns.',
    isCollaborating: true,
    views: 1234,
    likes: 45,
    likedBy: ['user-1', 'user-2', 'user-3'],
    comments: [
      {
        id: 'comment-1',
        threadId: '1',
        content: 'Great explanation! I\'ve been wondering about Server Components for a while.',
        author: mockUsers[1],
        createdAt: '2024-01-15T11:00:00Z',
        updatedAt: '2024-01-15T11:00:00Z',
        likes: 12,
        likedBy: ['user-1', 'user-3']
      },
      {
        id: 'comment-2',
        threadId: '1',
        content: 'The code example really helps understand the concept. Thanks for sharing!',
        author: mockUsers[2],
        createdAt: '2024-01-15T12:00:00Z',
        updatedAt: '2024-01-15T12:00:00Z',
        likes: 8,
        likedBy: ['user-1']
      }
    ]
  },
  {
    id: '2',
    title: 'Machine Learning Fundamentals',
    content: `# Machine Learning Fundamentals

Machine learning is a subset of artificial intelligence that enables systems to learn and improve from experience without being explicitly programmed.

## Types of Machine Learning

### 1. Supervised Learning
- Uses labeled training data
- Examples: Classification, Regression

### 2. Unsupervised Learning
- Finds patterns in unlabeled data
- Examples: Clustering, Association

### 3. Reinforcement Learning
- Learns through interaction with environment
- Examples: Game playing, Robotics

## Getting Started

\`\`\`python
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression

# Load and prepare data
data = pd.read_csv('dataset.csv')
X = data[['feature1', 'feature2']]
y = data['target']

# Split and train
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)
model = LinearRegression()
model.fit(X_train, y_train)
\`\`\`

Start with simple algorithms and gradually move to more complex ones.`,
    tags: ['machine-learning', 'ai', 'python', 'data-science'],
    author: mockUsers[1],
    contributors: [],
    createdAt: '2024-01-14T14:30:00Z',
    updatedAt: '2024-01-14T14:30:00Z',
    aiSummary: 'Comprehensive introduction to machine learning concepts, types, and practical implementation with Python code examples.',
    views: 856,
    likes: 32,
    likedBy: ['user-2', 'user-3'],
    comments: [
      {
        id: 'comment-3',
        threadId: '2',
        content: 'Perfect starting point for ML beginners. The Python example is very helpful.',
        author: mockUsers[0],
        createdAt: '2024-01-14T15:00:00Z',
        updatedAt: '2024-01-14T15:00:00Z',
        likes: 5,
        likedBy: ['user-2']
      }
    ]
  },
  {
    id: '3',
    title: 'Building Scalable Node.js Applications',
    content: `# Building Scalable Node.js Applications

Node.js is excellent for building scalable network applications. Here are key principles and patterns for building applications that can handle high loads.

## Architecture Patterns

### 1. Microservices
Break your application into small, independent services that communicate via APIs.

### 2. Event-Driven Architecture
Use events to decouple components and improve scalability.

### 3. Load Balancing
Distribute incoming requests across multiple server instances.

## Performance Optimization

\`\`\`javascript
// Use clustering to utilize all CPU cores
const cluster = require('cluster');
const numCPUs = require('os').cpus().length;

if (cluster.isMaster) {
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }
} else {
  // Worker process
  require('./app.js');
}
\`\`\`

## Database Optimization
- Use connection pooling
- Implement proper indexing
- Consider read replicas for read-heavy applications

## Caching Strategies
- Redis for session storage
- CDN for static assets
- Application-level caching

Remember: measure first, then optimize based on actual bottlenecks.`,
    tags: ['nodejs', 'javascript', 'backend', 'scalability'],
    author: mockUsers[2],
    contributors: [mockUsers[0]],
    createdAt: '2024-01-13T09:15:00Z',
    updatedAt: '2024-01-13T16:20:00Z',
    aiSummary: 'Comprehensive guide to building scalable Node.js applications covering architecture patterns, performance optimization, and best practices.',
    isCollaborating: false,
    views: 642,
    likes: 28,
    likedBy: ['user-1', 'user-2'],
    comments: []
  }
];
