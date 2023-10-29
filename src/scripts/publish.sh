#!/bin/bash

git config --global user.email "58354193+wajeht@users.noreply.github.com"
git config --global user.name "wajeht"

# Get the current directory of the script
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Execute the publish.sh script
$DIR/semantic-release.sh

npm run format
git add .

# Extract the version from package.json
VERSION=$(grep -o '"version": "[^"]*' package.json | sed 's/"version": "//')

git commit -am "chore: release v$VERSION" --no-verify
git push --no-verify
