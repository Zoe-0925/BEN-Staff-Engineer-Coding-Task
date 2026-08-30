import { readFile } from 'node:fs/promises';
import { spawn } from 'node:child_process';
import { parseEnv } from 'node:util';
import { fileURLToPath } from 'node:url';

const scenarioNames = ['success', 'auth-error', 'api-500', 'api-503', 'timeout', 'missing-config'];
const scenarioName = process.argv[2];

if (!scenarioName || !scenarioNames.includes(scenarioName)) {
  console.error(`Choose one scenario: ${scenarioNames.join(', ')}`);
  process.exitCode = 1;
} else {
  const environmentUrl = new URL(`./environments/${scenarioName}.env`, import.meta.url);
  const scenarioEnvironment = parseEnv(await readFile(environmentUrl, 'utf8'));
  const codeDirectory = fileURLToPath(new URL('..', import.meta.url));

  console.info(`Starting the ${scenarioName} E2E scenario.`);

  const appProcess = spawn('npm', ['run', 'dev'], {
    cwd: codeDirectory,
    env: { ...process.env, ...scenarioEnvironment },
    stdio: 'inherit',
  });

  const exitCode = await new Promise((resolve, reject) => {
    appProcess.once('error', reject);
    appProcess.once('exit', resolve);
  });

  process.exitCode = typeof exitCode === 'number' ? exitCode : 1;
}
