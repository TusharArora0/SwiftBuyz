#!/bin/bash
echo "Starting build test..."
cd "$(dirname "$0")"
npm run build
echo "Build test completed with exit code $?" 