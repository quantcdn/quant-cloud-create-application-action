import * as core from '@actions/core';
import { 
    ApplicationsApi, 
    Application, 
    ComposeApi,
    ValidateComposeRequest,
    ValidateCompose200Response
} from 'quant-ts-client';
import * as fs from 'fs';
import * as path from 'path';

const apiOpts = (apiKey: string) => {
    return{
        applyToRequest: (requestOptions: any) => {
            if (requestOptions && requestOptions.headers) {
                requestOptions.headers["Authorization"] = `Bearer ${apiKey}`;
            }
        }
    }
}

async function run() {
    const apiKey = core.getInput('api_key', { required: true });
    const org = core.getInput('organization', { required: true });
    const appName = core.getInput('app_name', { required: true });
    const composeSpec = JSON.parse(core.getInput('compose_spec', { required: true }));
    
    // Default to the public Quant Cloud API
    const baseUrl = core.getInput('base_url', { required: false }) || 'https://dashboard.quantcdn.io/api/v3';

    // Create the client
    const client = new ApplicationsApi(baseUrl);
    client.setDefaultAuthentication(apiOpts(apiKey));

    const cloudApplication = new Application();

    cloudApplication.appName = appName;
    cloudApplication.composeDefinition = composeSpec;

    const { body } = await client.createApplication(org, cloudApplication);

    core.setOutput('app_name', body.appName);

    core.info(`Successfully created application with ID: ${body.appName}`);
}

run(); 