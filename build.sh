#!/bin/sh

# Load environment variables from .env file
export $(grep -v '^#' .env | xargs)

# Run the build commands
npx tinacms build
npx astro build
