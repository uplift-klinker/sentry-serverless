const Sentry = require('@sentry/node');
const {awsIntegration} = require('@sentry/aws-serverless');
const {nodeProfilingIntegration} = require('@sentry/profiling-node');

Sentry.init({
    dsn: process.env.SENTRY_DSN,
    debug: process.env.SENTRY_DEBUG !== 'false',
    enabled: process.env.SENTRY_ENABLED !== 'false',
    serverName: process.env.AWS_LAMBDA_FUNCTION_NAME ?? 'not_set',
    integrations: [
        awsIntegration(),
        Sentry.postgresIntegration(),
        Sentry.captureConsoleIntegration(),
        Sentry.extraErrorDataIntegration(),
        Sentry.requestDataIntegration(),
        Sentry.graphqlIntegration(),
        nodeProfilingIntegration()
    ],
    _experiments: {
        enableLogs: true,
    }
})