# Redis Connectivity Troubleshooting Guide

## Overview

This document provides guidance for troubleshooting Redis connectivity issues in the MCP Code Analysis project. While the application has fallback mechanisms to use an in-memory session store, resolving Redis connectivity issues is important for production deployments.

## Symptoms

The following symptoms indicate a Redis connectivity issue:

1. `redis-cli ping` succeeds, showing Redis is running
2. Application initializes without errors about Redis
3. Session operations fail with "Redis client not connected" errors
4. When checking Redis availability programmatically:
   ```javascript
   const redisAvailable = await isRedisAvailable("redis://localhost:6379");
   console.log(redisAvailable); // Returns true, but operations still fail
   ```

## Diagnosis Steps

### 1. Verify Redis Installation

```bash
# Check Redis version
redis-cli --version

# Check Redis service status
sudo systemctl status redis  # Linux
brew services info redis     # macOS

# Test basic connectivity
redis-cli ping               # Should return PONG
```

### 2. Check Redis Configuration

```bash
# View Redis configuration
redis-cli CONFIG GET protected-mode
redis-cli CONFIG GET bind
redis-cli CONFIG GET requirepass
redis-cli CONFIG GET port

# Check for authentication requirements
redis-cli AUTH your_password  # If authentication is required
```

### 3. Test Redis Operations Manually

```bash
# Try setting and getting a value
redis-cli SET test_key "test_value"
redis-cli GET test_key

# Check connection info
redis-cli CLIENT LIST
```

### 4. Debug Application Redis Connection

```bash
# Run with verbose Redis logging
export REDIS_DEBUG=true  # Enable if implemented
export NODE_DEBUG=redis  # Enable Node.js Redis client debugging

# Try the example script with debugging
node --trace-warnings examples/session-store-example.js
```

### 5. Check Network Configuration

```bash
# Test if Redis port is open
nc -zv localhost 6379

# Check if firewall is blocking Redis
sudo iptables -L | grep 6379  # Linux
```

## Common Issues and Solutions

### Authentication Problems

If Redis requires authentication, ensure you're providing the correct password in the Redis URL:

```
redis://username:password@localhost:6379
```

### Connection Limits

Redis may have connection limits configured:

```bash
# Check max clients setting
redis-cli CONFIG GET maxclients
```

### Protected Mode

If Redis is in protected mode, it might reject connections:

```bash
# Disable protected mode (for development only)
redis-cli CONFIG SET protected-mode no
```

### Client Library Issues

The Node.js Redis client might have compatibility issues:

1. Check the installed Redis client version:

   ```bash
   npm list | grep redis
   npm list | grep ioredis  # If using ioredis
   ```

2. Update to the latest version:
   ```bash
   npm update redis
   # or
   npm update ioredis
   ```

## Temporary Workaround

While troubleshooting, you can use the memory session store:

1. Use the provided script:

   ```bash
   ./use-memory-session.sh
   ```

2. Or set the environment variable manually:
   ```bash
   export FORCE_MEMORY_SESSION=true
   pnpm run start
   ```

## Redis Production Best Practices

When moving to production:

1. Use a dedicated Redis instance or managed service
2. Configure appropriate persistence (RDB or AOF)
3. Set up proper authentication
4. Consider Redis Sentinel or Redis Cluster for high availability
5. Implement monitoring and alerts for Redis health

## Further Resources

- [Redis Documentation](https://redis.io/documentation)
- [Redis Configuration](https://redis.io/topics/config)
- [Redis Clients](https://redis.io/clients)
- [ioredis GitHub](https://github.com/luin/ioredis) (If using ioredis)
