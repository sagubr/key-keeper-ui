import { exec } from 'child_process';
import { promisify } from 'util';

const execPromise = promisify(exec);

const OPEN_API_URL = 'src/libs/openapi-generator/configuration/api.spec.yml';
const GENERATOR_TYPE = 'typescript-angular';
const OUTPUT_DIR = 'src/libs/openapi-generator';

async function generateAPI() {
  const command = `openapi-generator-cli generate -i ${OPEN_API_URL} -g ${GENERATOR_TYPE} -o ${OUTPUT_DIR}`;

  try {
    console.log('Generating OpenAPI code...');
    await execPromise(command);
    console.log('OpenAPI code generation completed successfully.');
  } catch (error) {
    console.error(
      `Failed to generate OpenAPI code. Command: "${command}"`,
      error
    );
  }
}

generateAPI().then(r => r);
