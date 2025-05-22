# Quant Cloud Create Action

This GitHub Action deploys your project to Quant Cloud using the Quant TS client. It validates your docker-compose file before deployment.

## Usage

```yaml
- uses: quantcdn/quant-cloud-create-application-action@v1
  with:
    api_key: ${{ secrets.QUANT_API_KEY }}
    organization: your-org-id
    app_name: my-app
    compose_file: docker-compose.yml
    environment: production
    base_url: https://dashboard.quantcdn.io/api/v3
```

## Inputs

- `api_key`: Your Quant API key (required)
- `organization`: Your Quant organisation ID (required)
- `app_name`: Name for your application (required)
- `compose_file`: Path to docker-compose.yml file in the repository (required)
- `environment`: Deployment environment (default: 'production')
- `base_url`: Quant Cloud API URL (default: 'https://dashboard.quantcdn.io/api/v3')

## Outputs

- `application_id`: The ID of the created application

## Features

- Validates docker-compose file before deployment
- Provides warnings for compose translation issues
- Uses Quant Cloud's compose validation service 