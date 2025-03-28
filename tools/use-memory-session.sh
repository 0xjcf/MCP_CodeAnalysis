#!/bin/bash

# Script to run the MCP server with memory session store
# This is a temporary solution until Redis connectivity issues are resolved

echo "Starting MCP server with memory session store..."
echo "This is a workaround for Redis connectivity issues"
echo "See plan.md Tech Debt section for details"
echo 

# Set environment variable to force memory session store
export FORCE_MEMORY_SESSION=true

# Run the server
pnpm run start

# Note: This script is meant to be a temporary solution
# Redis connectivity issues should be resolved for production use 