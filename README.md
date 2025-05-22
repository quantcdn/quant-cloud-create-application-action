# Quant Cloud Create Action

This GitHub Action deploys your project to Quant Cloud using the Quant TS client. It validates your docker-compose file before deployment.

## Usage

```yaml
- uses: quantcdn/quant-cloud-compose-action@v1
  id: compose
  with:
    api_key: ${{ secrets.QUANT_API_KEY }}
    organization: your-org-id
    compose_file: docker-compose.yml

- uses: quantcdn/quant-cloud-create-application-action@v1
  with:
    api_key: ${{ secrets.QUANT_API_KEY }}
    organization: your-org-id
    app_name: my-app
    compose_spec: ${{ steps.compose.outputs.translated_compose }}
    base_url: https://dashboard.quantcdn.io/api/v3
```

## Inputs

- `api_key`: Your Quant API key (required)
- `organization`: Your Quant organisation ID (required)
- `app_name`: Name for your application (required)
- `compose_spec`: JSON string of the validated compose specification from quant-cloud-compose-action (required)
- `base_url`: Quant Cloud API URL (default: 'https://dashboard.quantcdn.io/api/v3')

## Outputs

- `app_name`: The name of the created application

## Features

- Uses validated compose specification from quant-cloud-compose-action
- Creates application in Quant Cloud
- Validates docker-compose file before deployment
- Provides warnings for compose translation issues
- Uses Quant Cloud's compose validation service 