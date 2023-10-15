#!/bin/bash

# Get the current directory of the script
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Execute the publish.sh script
$DIR/semantic-release.sh

# Run npm format
npm run format

# Add all changes to Git
git add .

# Extract the version from package.json
VERSION=$(grep -o '"version": "[^"]*' package.json | sed 's/"version": "//')

# Commit changes with a version number
git commit -am "chore: release v$VERSION" --no-verify

# Push changes to Git
git push --no-verify
