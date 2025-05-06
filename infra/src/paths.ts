import path from "node:path";

export const REPO_ROOT_PATH = path.resolve(__dirname, '..', '..');
export const NODEJS_LAYERS_DOCKER_FILE_PATH = path.resolve(REPO_ROOT_PATH, 'layers', 'nodejs', 'dockerfile');
export const SUBSCRIBER_CODE_PATH = path.resolve(REPO_ROOT_PATH, 'lambdas', 'subscriber', 'dist');
export const RESOLVER_CODE_PATH = path.resolve(REPO_ROOT_PATH, 'lambdas', 'resolver', 'dist');
export const RESOLVER_SCHEMA_PATH = path.resolve(REPO_ROOT_PATH, 'lambdas', 'resolver', 'src', 'schema.graphql');