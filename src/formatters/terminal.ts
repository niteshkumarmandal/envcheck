
import pc from 'picocolors';
import { Finding } from '../types';

export function formatTerminalOutput(findings: Finding[]): void {
  console.log(pc.cyan(pc.bold('\n🔍 Environment Scan Complete\n')));

  let hasFailures = false;

  findings.forEach(finding => {
    if (finding.status === 'pass') {
      console.log(`✅ ${pc.bold(finding.service)}`);
      console.log(pc.gray(`   Found: ${finding.actual} (Required: ${finding.expected})\n`));
    } else {
      hasFailures = true;
      console.log(`❌ ${pc.bold(pc.red(finding.service))}`);
      console.log(`   Required: ${finding.expected}`);
      console.log(`   Found:    ${pc.red(finding.actual)}`);
      if (finding.message) {
        console.log(pc.yellow(`   ↳ ${finding.message}`));
      }
      console.log(); // empty line for spacing
    }
  });

  if (hasFailures) {
    console.log(pc.red(pc.bold('⚠️  Environment drift detected. Please fix the issues above.\n')));
    process.exit(1); // Tell the OS the process failed
  } else {
    console.log(pc.green(pc.bold('✨ All checks passed! You are good to go.\n')));
    process.exit(0); // Tell the OS the process succeeded
  }
}