# serverless-node-app-backend

## Backend of a TASK manger app which has 2 independent serverless environments (dev & prod)

1. cognito is protecting only PROD env apis and not the DEV. It's happening automatically.
2. Only the PROD is enhanced by CDN service not the DEV.
3. serverless.yml is used as IaC.
4. AWS codepipeline as CI/CD tool for well structured deployment.
5. API Gateway & DynamoDB & lambda are the backbones of it.
