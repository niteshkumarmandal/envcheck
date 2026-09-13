#!/usr/bin/env node
// src/index.ts

import { loadConfiguration } from './config/loader';
import { analyzeEnvironment } from './analyzer';
import { formatTerminalOutput } from './formatters/terminal';
import { SystemState } from './types';
import { collectors } from './collectors/registry';
import pc from 'picocolors';

async function main() {
  const contract = loadConfiguration();

  if (Object.keys(contract).length === 0) {
    console.log(pc.yellow('\n⚠️  No environment constraints found.'));
    console.log('Add an "engines" field to your package.json, or create an .envcheckrc.json file.\n');
    process.exit(0);
  }

  // We only run collectors for things listed in the contract
  const state: SystemState = {};
  const displayNameMap: Record<string, string> = {};
  
  const collectionPromises = [];

  for (const toolName of Object.keys(contract)) {
    const collector = collectors.find(c => c.name === toolName);
    
    if (collector) {
      displayNameMap[toolName] = collector.displayName;
      // Push the promise into an array so we can run them concurrently
      collectionPromises.push(
        collector.collect().then(version => {
          state[toolName] = version;
        })
      );
    } else {
        // If they asked for a tool we don't support yet
        displayNameMap[toolName] = toolName;
        state[toolName] = null; 
        console.warn(pc.yellow(`⚠️  Warning: No collector found for "${toolName}".`));
    }
  }

  // Wait for all bash commands to finish simultaneously
  await Promise.all(collectionPromises);

  const findings = analyzeEnvironment(contract, state, displayNameMap);
  formatTerminalOutput(findings);
}

main();