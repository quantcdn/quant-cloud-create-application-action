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
    const composeFilePath = core.getInput('compose_file', { required: true });
    
    // Default to the public Quant Cloud API
    const baseUrl = core.getInput('base_url', { required: false }) || 'https://dashboard.quantcdn.io/api/v3';

    // Read the docker-compose file
    const composeContent = fs.readFileSync(path.join(process.env.GITHUB_WORKSPACE || '', composeFilePath), 'utf8');

    if (!composeContent) {
        core.setFailed('Compose file not found at ' + composeFilePath);
        return;
    }

    const composeClient = new ComposeApi(baseUrl);
    composeClient.setDefaultAuthentication(apiOpts(apiKey));

    const validateRequest = new ValidateComposeRequest();
    validateRequest.compose = JSON.stringify(composeContent);

    let validateResponse: ValidateCompose200Response;

    try {
        const { body } = await composeClient.validateCompose(org, validateRequest);
        validateResponse = body;
    } catch (error) {
        core.setFailed('Compose file is invalid');
        return;
    }

    if (validateResponse.translationWarnings) {
        core.warning('Compose file has translation warnings');
        for (const warning of validateResponse.translationWarnings) {
            core.warning(warning);
        }
        core.setFailed('Compose file is invalid');
    }

    // Create the client
    const client = new ApplicationsApi(baseUrl);
    client.setDefaultAuthentication(apiOpts(apiKey));

    const cloudApplication = new Application();

    cloudApplication.appName = appName;
    cloudApplication.composeDefinition = validateResponse.translatedComposeDefinition;

    const { body } = await client.createApplication(org, cloudApplication);

    core.setOutput('app_name', body.appName);

    core.info(`Successfully created application with ID: ${body.appName}`);
}

run(); 