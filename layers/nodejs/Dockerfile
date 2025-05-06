FROM --platform=amd64 public.ecr.aws/lambda/nodejs:20

WORKDIR /asset

COPY package.json nodejs/
COPY sentry-init.js .

RUN corepack enable
RUN cd nodejs && yarn install --production