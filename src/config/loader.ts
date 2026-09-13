// src/config/loader.ts
import fs from 'fs';
import path from 'path';
import { EnvContract } from '../types';

export function loadConfiguration(): EnvContract {
  const contract: EnvContract = {};
  const currentDir = process.cwd();
  
  // 1. Read package.json
  const packageJsonPath = path.join(currentDir, 'package.json');
  if (fs.existsSync(packageJsonPath)) {
    try {
      const fileContent = fs.readFileSync(packageJsonPath, 'utf-8');
      const packageData = JSON.parse(fileContent);

      if (packageData.engines) {
        // Dynamically copy everything in engines
        for (const [key, value] of Object.entries(packageData.engines)) {
            contract[key] = value as string;
        }
      }
    } catch (error) {
      console.warn('⚠️  Could not parse package.json.');
    }
  }

  // 2. Read .envcheckrc.json
  const envcheckrcPath = path.join(currentDir, '.envcheckrc.json');
  if (fs.existsSync(envcheckrcPath)) {
    try {
      const fileContent = fs.readFileSync(envcheckrcPath, 'utf-8');
      const rcData = JSON.parse(fileContent);

      // Dynamically merge the specific fields we care about
      
      for (const [key, value] of Object.entries(rcData)) {
          contract[key] = value as string;
      }
      
    } catch (error) {
      console.warn('⚠️  Could not parse .envcheckrc.json. Ensure it is valid JSON.');
    }
  }

  return contract;
}