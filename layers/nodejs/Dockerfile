FROM --platform=amd64 public.ecr.aws/lambda/nodejs:20

WORKDIR /asset

COPY nodejs/package.json nodejs/
COPY nodejs/sentry-init.js nodejs/

RUN corepack enable