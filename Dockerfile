ARG NODE_VERSION=24.18.0

FROM node:${NODE_VERSION}-slim AS dependencies
ENV NODE_OPTIONS="--max-old-space-size=1536"
WORKDIR /app
#COPY package.json pnpm-lock.yaml ./
COPY package.json ./
RUN npm install -g pnpm
RUN corepack enable
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile false

FROM node:${NODE_VERSION}-slim AS build
ENV NODE_OPTIONS="--max-old-space-size=1536"
RUN corepack enable
WORKDIR /app
COPY . /app/
COPY ./.env ./.env
COPY --from=dependencies /app/node_modules /app/node_modules
#RUN npm install -g pnpm
RUN pnpm run build

FROM node:${NODE_VERSION}-slim AS lint
WORKDIR /app
COPY . /app/
COPY --from=dependencies /app/node_modules /app/node_modules
RUN npm install -g pnpm
RUN pnpm run lint

FROM node:${NODE_VERSION}-slim AS test
WORKDIR /app
COPY . /app/
COPY --from=build /app/ /app/
RUN npm install -g pnpm
RUN pnpm run test

FROM openjdk:18-alpine AS dependency_check
RUN apk update
RUN apk add yarn
RUN apk add openjdk8
RUN apk add wget tar gzip
RUN wget https://github.com/jeremylong/DependencyCheck/releases/download/v8.2.1/dependency-check-8.2.1-release.zip \
    && unzip dependency-check-8.2.1-release.zip\
    && rm dependency-check-8.2.1-release.zip
COPY --from=dependencies /app/node_modules /app/node_modules
WORKDIR /app
COPY ./ ./
RUN /dependency-check/bin/dependency-check.sh --scan . --out ./report/ --format "JSON"

FROM sonarsource/sonar-scanner-cli AS sonarqube
WORKDIR /app
COPY ./ ./
COPY --from=dependency_check ./app/report/dependency-check-report.json ./report/
ARG DSONAR_PROJECT_KEY
ENV dsonar_project_key=${DSONAR_PROJECT_KEY}
ARG DSONAR_LOGIN
ENV dsonar_login=${DSONAR_LOGIN}
ARG DSONAR_HOST
ENV dsonar_host=${DSONAR_HOST}
RUN sonar-scanner \
  -Dsonar.projectKey=${dsonar_project_key}\
  -Dsonar.sources=. \
  -Dsonar.host.url=${dsonar_host} \
  -Dsonar.login=${dsonar_login} \
  -Dsonar.dependencyCheck.jsonReportPath=./report/dependency-check-report.json \
  -X

FROM node:${NODE_VERSION}-slim AS app
WORKDIR /app
COPY --from=build /app/ /app/
RUN npm install -g pnpm
EXPOSE 3000 443 80
CMD [ "pnpm","start"]
