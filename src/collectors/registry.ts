// src/collectors/registry.ts
import fs from 'fs';
import path from 'path';
import { Collector } from '../types';
import { runCommand } from '../utils/exec';

// --- HELPER 1: Extract SemVer from messy terminal output ---
function extractVersion(output: string): string | null {
  const match = output.match(/(\d+\.\d+(\.\d+)?)/);
  return match ? match[0] : null;
}

// --- HELPER 2: Check local node_modules for JS libraries ---
function getLocalPackageVersion(packageName: string): string | null {
  try {
    const pkgPath = path.join(process.cwd(), 'node_modules', packageName, 'package.json');
    if (fs.existsSync(pkgPath)) {
      const data = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
      return data.version || null;
    }
    return null;
  } catch {
    return null; // Failed to read or parse
  }
}

export const collectors: Collector[] = [
  // ==========================================
  // 1. RUNTIMES
  // ==========================================
  { name: 'node', displayName: 'Node.js', async collect() { return process.version.replace('v', '') || null; } },
  { name: 'python', displayName: 'Python', async collect() { 
      try { return extractVersion(await runCommand('python --version')) || extractVersion(await runCommand('python3 --version')); } catch { return null; }
  }},
  { name: 'java', displayName: 'Java (JDK)', async collect() { try { return extractVersion(await runCommand('java -version')); } catch { return null; } } },
  { name: 'go', displayName: 'Go', async collect() { try { return extractVersion(await runCommand('go version')); } catch { return null; } } },
  { name: 'rust', displayName: 'Rust (rustc)', async collect() { try { return extractVersion(await runCommand('rustc --version')); } catch { return null; } } },
  { name: 'dotnet', displayName: '.NET', async collect() { try { return extractVersion(await runCommand('dotnet --version')); } catch { return null; } } },

  // ==========================================
  // 2. PACKAGE MANAGERS
  // ==========================================
  { name: 'npm', displayName: 'npm', async collect() { try { return extractVersion(await runCommand('npm -v')); } catch { return null; } } },
  { name: 'pnpm', displayName: 'pnpm', async collect() { try { return extractVersion(await runCommand('pnpm -v')); } catch { return null; } } },
  { name: 'yarn', displayName: 'Yarn', async collect() { try { return extractVersion(await runCommand('yarn -v')); } catch { return null; } } },
  { name: 'pip', displayName: 'pip', async collect() { try { return extractVersion(await runCommand('pip --version')) || extractVersion(await runCommand('pip3 --version')); } catch { return null; } } },
  { name: 'uv', displayName: 'uv', async collect() { try { return extractVersion(await runCommand('uv --version')); } catch { return null; } } },
  { name: 'poetry', displayName: 'Poetry', async collect() { try { return extractVersion(await runCommand('poetry --version')); } catch { return null; } } },
  { name: 'maven', displayName: 'Maven', async collect() { try { return extractVersion(await runCommand('mvn -v')); } catch { return null; } } },
  { name: 'gradle', displayName: 'Gradle', async collect() { try { return extractVersion(await runCommand('gradle -v')); } catch { return null; } } },
  { name: 'cargo', displayName: 'Cargo', async collect() { try { return extractVersion(await runCommand('cargo --version')); } catch { return null; } } },

  // ==========================================
  // 3. DATABASES
  // ==========================================
  { name: 'postgres', displayName: 'PostgreSQL', async collect() { try { return extractVersion(await runCommand('psql -V')); } catch { return null; } } },
  { name: 'mysql', displayName: 'MySQL', async collect() { try { return extractVersion(await runCommand('mysql -V')); } catch { return null; } } },
  { name: 'mongodb', displayName: 'MongoDB (mongosh)', async collect() { 
      // Checking the mongo shell is more reliable on dev machines than the daemon (mongod)
      try { return extractVersion(await runCommand('mongosh --version')); } catch { return null; } 
  }},
  { name: 'redis', displayName: 'Redis', async collect() { 
      try { return extractVersion(await runCommand('redis-server -v')) || extractVersion(await runCommand('redis-cli -v')); } catch { return null; } 
  }},

  // ==========================================
  // 4. DEVELOPER TOOLS
  // ==========================================
  { name: 'git', displayName: 'Git', async collect() { try { return extractVersion(await runCommand('git --version')); } catch { return null; } } },
  { name: 'docker', displayName: 'Docker', async collect() { try { return extractVersion(await runCommand('docker --version')); } catch { return null; } } },
  { name: 'docker-compose', displayName: 'Docker Compose', async collect() { 
      // Handles both newer `docker compose` and older `docker-compose` syntax
      try { return extractVersion(await runCommand('docker compose version')) || extractVersion(await runCommand('docker-compose --version')); } catch { return null; } 
  }},
  { name: 'curl', displayName: 'curl', async collect() { try { return extractVersion(await runCommand('curl --version')); } catch { return null; } } },
  { name: 'openssl', displayName: 'OpenSSL', async collect() { try { return extractVersion(await runCommand('openssl version')); } catch { return null; } } },

  // ==========================================
  // 5. PROJECT DETECTION (Local Dependencies)
  // ==========================================
  { name: 'typescript', displayName: 'TypeScript', async collect() { return getLocalPackageVersion('typescript'); } },
  { name: 'react', displayName: 'React', async collect() { return getLocalPackageVersion('react'); } },
  { name: 'next', displayName: 'Next.js', async collect() { return getLocalPackageVersion('next'); } },
  { name: 'express', displayName: 'Express', async collect() { return getLocalPackageVersion('express'); } },
  { name: 'nestjs', displayName: '@nestjs/core', async collect() { return getLocalPackageVersion('@nestjs/core'); } },
  { name: 'prisma', displayName: 'Prisma', async collect() { return getLocalPackageVersion('prisma'); } },
  { name: 'drizzle', displayName: 'Drizzle ORM', async collect() { return getLocalPackageVersion('drizzle-orm'); } },
];