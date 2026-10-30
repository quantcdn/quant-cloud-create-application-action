import * as core from '@actions/core';
import { ApplicationsApi, Configuration } from '@quantcdn/quant-client';

async function run() {
  const apiKey = core.getInput('api_key', { required: true });
  core.setSecret(apiKey);
  const org = core.getInput('organization', { required: true });
  const appName = core.getInput('app_name', { required: true });
  const composeSpec = JSON.parse(core.getInput('compose_spec', { required: true }));
  const baseUrl = core.getInput('base_url') || 'https://dashboard.quantcdn.io/api/v3';
  const client = new ApplicationsApi(new Configuration({ basePath: baseUrl.replace(/\/+$/, '').replace(/\/api\/v3$/, ''), accessToken: apiKey }));
  const response = await client.createApplication(org, { appName, composeDefinition: composeSpec });
  await core.setOutput('app_name', response.data.appName);
  core.info(`Successfully created application: ${response.data.appName}`);
}
run().catch(error => core.setFailed(error instanceof Error ? error.message : 'Application creation failed'));
