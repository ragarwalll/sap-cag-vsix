#!/bin/bash

VSCE_TOKEN=$VSCE_PAT
npm install -g @vscode/vsce
vsce publish -p $VSCE_TOKEN