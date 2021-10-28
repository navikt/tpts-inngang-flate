FROM navikt/node-express:12.2.0-alpine

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}
ENV TZ="Europe/Oslo"

WORKDIR /app

COPY node_modules/ node_modules/
COPY dist/server/ dist/server/
COPY dist/client/ dist/client/
COPY wiki.json wiki.json

EXPOSE 3000
