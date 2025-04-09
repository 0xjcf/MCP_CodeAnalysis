# Development Workflow Guide

This guide outlines the development workflow for both local development and team collaboration scenarios using the MCP Code Analysis platform.

## Local Development

### Prerequisites

1. Node.js 16+ installed
2. SQLite3 installed (for local storage)
3. Redis (optional, for testing Redis features)

### Setup

1. **Clone the Repository**

```bash
git clone <repository-url>
cd MCP_CodeAnalysis
```

2. **Install Dependencies**

```bash
pnpm install
```

3. **Environment Configuration**
   Create a `.env` file in the root directory:

```env
# Optional Redis configuration for testing
REDIS_URL=redis://localhost:6379
REDIS_PREFIX=mcp:
REDIS_TTL=3600
REDIS_MEMORY_CACHE=true
REDIS_MEMORY_CACHE_SIZE=1000
REDIS_LOCK_TIMEOUT=10000

# Development mode
NODE_ENV=development
```

### Local Development Workflow

1. **Start Local Development Server**

```bash
cd packages/core
pnpm dev
```

2. **Using Local Storage**

- By default, the system uses SQLite3 for local storage
- No additional configuration needed
- Data is stored in `data/*.db` files

3. **Testing Redis Features Locally**

- Start a local Redis instance:

```bash
docker run --name redis -p 6379:6379 -d redis
```

- The system will automatically detect Redis and use it
- If Redis is unavailable, it falls back to memory store

4. **Running Tests**

```bash
pnpm test
```

## Team Collaboration

### Prerequisites

1. Access to shared Redis instance
2. Team credentials
3. VPN or secure network access (if required)

### Setup

1. **Configure Redis Connection**
   Update your `.env` file with team Redis credentials:

```env
REDIS_URL=redis://team-redis.example.com:6379
REDIS_PASSWORD=your-team-password
REDIS_PREFIX=team:mcp:
```

2. **Environment Isolation**

- Use different Redis databases for different environments:
  - Development: `db: 0`
  - Staging: `db: 1`
  - Production: `db: 2`

3. **Session Management**

- Sessions are automatically shared across team members
- Use unique session IDs for your work:

```typescript
const sessionId = `user-${userId}-${Date.now()}`;
```

### Team Collaboration Workflow

1. **Starting a Collaborative Session**

```typescript
import { createSessionStore } from './state/services/sessionStoreFactory';

const sessionStore = await createSessionStore({
  redisUrl: process.env.REDIS_URL,
  prefix: `team:${teamId}:`,
  defaultTtl: 3600,
});
```

2. **Sharing Session Data**

```typescript
// Store shared data
await sessionStore.setSession('shared-session', {
  teamId: 'team-123',
  members: ['user1', 'user2'],
  context: {
    project: 'project-xyz',
    branch: 'feature/abc',
  },
});

// Retrieve shared data
const session = await sessionStore.getSession('shared-session');
```

3. **Concurrent Access**

- Use distributed locking for shared resources:

```typescript
const lock = await sessionStore.acquireLock('shared-resource', 30000);
if (lock) {
  try {
    // Perform operations
  } finally {
    await sessionStore.releaseLock('shared-resource', lock);
  }
}
```

4. **Cache Management**

```typescript
import { RedisCacheStore } from './state/store/redisCacheStore';

const cacheStore = new RedisCacheStore({
  redisUrl: process.env.REDIS_URL,
  prefix: `team:${teamId}:cache:`,
  defaultTtl: 300,
  useMemoryCache: true,
});

// Cache shared data
await cacheStore.set('shared-key', { data: 'value' }, 600, 'team-namespace');
```

### Best Practices

1. **Session Management**

- Use meaningful session IDs
- Set appropriate TTL values
- Clean up expired sessions
- Use namespaces for team isolation

2. **Caching**

- Use memory cache for frequently accessed data
- Set appropriate cache TTLs
- Use namespaces to prevent key collisions
- Monitor cache hit rates

3. **Error Handling**

- Implement graceful fallbacks
- Log Redis connection issues
- Monitor Redis health
- Use retry strategies

4. **Security**

- Never commit Redis credentials
- Use environment variables
- Implement proper access controls
- Monitor access patterns

### Monitoring

1. **Cache Statistics**

```typescript
const stats = cacheStore.getStats();
console.log(stats);
// {
//   memoryCache: {
//     enabled: true,
//     size: 245,
//     maxSize: 1000,
//     hits: 1532,
//     misses: 423,
//     sets: 658,
//     hitRate: 0.78
//   }
// }
```

2. **Session Monitoring**

- Track active sessions
- Monitor session TTLs
- Watch for connection issues
- Monitor lock contention

### Troubleshooting

1. **Common Issues**

- Redis connection failures
- Session expiration
- Lock timeouts
- Cache misses

2. **Solutions**

- Check Redis connectivity
- Verify credentials
- Monitor Redis logs
- Use fallback mechanisms

## Development Tools

1. **Redis CLI**

```bash
# Connect to Redis
redis-cli -h team-redis.example.com -p 6379

# Monitor keys
MONITOR | grep "team:mcp:"

# Check memory usage
INFO memory
```

2. **Development Scripts**

```bash
# Setup Redis services
node tools/setup-redis-services.js

# Test Redis connection
node tools/test-redis-connection.js
```

## Additional Resources

- [Redis Documentation](https://redis.io/documentation)
- [Session Store Architecture](./session-store.md)
- [Redis Integration Guide](./redis-integration.md)

## Using MCP Server as a Background Service

### Prerequisites

1. MCP Code Analysis installed globally:

```bash
pnpm add -g @mcp/code-analysis
```

2. Redis server running (local or remote)
3. SQLite3 installed

### Setup

1. **Configure Global Settings**
   Create a global configuration file at `~/.mcp/config.json`:

```json
{
  "redis": {
    "url": "redis://localhost:6379",
    "prefix": "mcp:",
    "ttl": 3600
  },
  "storage": {
    "type": "sqlite",
    "path": "~/.mcp/data"
  },
  "server": {
    "port": 3000,
    "host": "localhost"
  }
}
```

2. **Start MCP Server**

```bash
# Start as a background service
mcp-server start --daemon

# Check status
mcp-server status

# View logs
mcp-server logs
```

### Integration with Other Projects

1. **Using MCP Client in Other Projects**

```typescript
import { MCPClient } from '@mcp/code-analysis';

// Initialize client
const mcp = new MCPClient({
  serverUrl: 'http://localhost:3000',
  apiKey: process.env.MCP_API_KEY,
});

// Create a new session
const session = await mcp.createSession({
  projectId: 'my-project',
  context: {
    branch: 'feature/new-feature',
    environment: 'development',
  },
});

// Use session in your project
const sessionId = session.id;
```

2. **Session Management Examples**

```typescript
// Read session data
const sessionData = await mcp.getSession(sessionId);

// Update session
await mcp.updateSession(sessionId, {
  status: 'in_progress',
  metrics: {
    filesModified: 5,
    linesAdded: 100,
  },
});

// Delete session
await mcp.deleteSession(sessionId);
```

3. **AI Integration Examples**

```typescript
// Analyze code with AI
const analysis = await mcp.analyzeCode({
  sessionId,
  code: sourceCode,
  options: {
    complexity: true,
    security: true,
    accessibility: true,
  },
});

// Get AI suggestions
const suggestions = await mcp.getSuggestions({
  sessionId,
  context: {
    file: 'src/components/Button.tsx',
    line: 42,
  },
});

// Generate documentation
const docs = await mcp.generateDocs({
  sessionId,
  code: sourceCode,
  format: 'markdown',
});
```

4. **Real-time Updates**

```typescript
// Subscribe to session updates
mcp.subscribeToSession(sessionId, update => {
  console.log('Session updated:', update);
});

// Subscribe to AI analysis results
mcp.subscribeToAnalysis(sessionId, result => {
  console.log('New analysis result:', result);
});
```

### Best Practices for Background Service

1. **Resource Management**

- Monitor memory usage
- Set appropriate timeouts
- Implement graceful shutdown
- Use connection pooling

2. **Error Handling**

```typescript
try {
  await mcp.createSession({
    /* ... */
  });
} catch (error) {
  if (error.code === 'ECONNREFUSED') {
    // Handle connection issues
  } else if (error.code === 'ETIMEDOUT') {
    // Handle timeout issues
  }
}
```

3. **Performance Optimization**

```typescript
// Batch operations
await mcp.batch([
  {
    type: 'create',
    data: {
      /* ... */
    },
  },
  {
    type: 'update',
    data: {
      /* ... */
    },
  },
  {
    type: 'delete',
    data: {
      /* ... */
    },
  },
]);

// Use caching
const cachedSession = await mcp.getSession(sessionId, {
  useCache: true,
  cacheTtl: 300,
});
```

4. **Security Considerations**

```typescript
// Use environment variables for sensitive data
const mcp = new MCPClient({
  serverUrl: process.env.MCP_SERVER_URL,
  apiKey: process.env.MCP_API_KEY,
  encryption: {
    enabled: true,
    key: process.env.MCP_ENCRYPTION_KEY,
  },
});

// Implement rate limiting
const rateLimiter = new RateLimiter({
  maxRequests: 100,
  windowMs: 60000,
});
```

### Monitoring and Maintenance

1. **Health Checks**

```bash
# Check service health
mcp-server health

# View resource usage
mcp-server stats

# Check Redis connection
mcp-server redis-status
```

2. **Logging and Debugging**

```bash
# View detailed logs
mcp-server logs --level debug

# Check error logs
mcp-server logs --level error

# Monitor real-time
mcp-server logs --follow
```

3. **Backup and Recovery**

```bash
# Backup session data
mcp-server backup --output ./backup.json

# Restore from backup
mcp-server restore --input ./backup.json

# Clean up old sessions
mcp-server cleanup --older-than 30d
```

### Troubleshooting

1. **Common Issues**

- Service not starting
- Connection timeouts
- Memory leaks
- Redis connection issues

2. **Solutions**

```bash
# Restart service
mcp-server restart

# Clear cache
mcp-server clear-cache

# Reset Redis connection
mcp-server redis-reset

# View diagnostic info
mcp-server diagnose
```

## Additional Resources

- [Redis Documentation](https://redis.io/documentation)
- [Session Store Architecture](./session-store.md)
- [Redis Integration Guide](./redis-integration.md)
