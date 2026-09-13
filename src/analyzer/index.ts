
import semver from 'semver';
import { EnvContract, SystemState, Finding } from '../types';

export function analyzeEnvironment(contract: EnvContract, state: SystemState, displayNameMap: Record<string, string>): Finding[] {
  const findings: Finding[] = [];

  // We only analyze tools that were requested in the contract
  for (const [toolName, expectedVersion] of Object.entries(contract)) {
    const actualVersion = state[toolName];
    const displayName = displayNameMap[toolName] || toolName;

    if (!actualVersion) {
      findings.push({
        service: displayName,
        status: 'fail',
        expected: expectedVersion,
        actual: 'Not Installed or Not in PATH',
      });
      continue;
    }

    // Try to safely coerce versions like "15.2" into "15.2.0"
    const cleanActual = semver.coerce(actualVersion);
    const isCompliant = cleanActual ? semver.satisfies(cleanActual, expectedVersion) : false;

    findings.push({
      service: displayName,
      status: isCompliant ? 'pass' : 'fail',
      expected: expectedVersion,
      actual: actualVersion,
    });
  }

  return findings;
}
