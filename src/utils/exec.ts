// src/utils/exec.ts
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export async function runCommand(command: string): Promise<string> {
  try {
    const { stdout, stderr } = await execAsync(command);
    // Some tools (like Java) output their version to stderr instead of stdout.
    // We check stdout first, and if it's empty, we fall back to stderr.
    const output = stdout.trim() || stderr.trim();
    return output;
  } catch (error: any) {
    // If the command actually fails (e.g., command not found),
    // execAsync throws an error. We can sometimes extract the output from it.
    if (error.stdout || error.stderr) {
       return (error.stdout || error.stderr).toString().trim();
    }
    throw new Error(`Command failed: ${command}`);
  }
}