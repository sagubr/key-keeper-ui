import { exec } from 'child_process';
import { promisify } from 'util';

const execPromise = promisify(exec);

const OPEN_API_URL = 'libs/openapi/config/api.spec.yml';
const GENERATOR_TYPE = 'typescript-angular';
const OUTPUT_DIR = 'libs/openapi';

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

generateAPI();
