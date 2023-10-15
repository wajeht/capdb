#!/bin/bash

source .env

NPM_TOKEN=$NPM_TOKEN GH_TOKEN=$GH_TOKEN npx semantic-release --no-ci
