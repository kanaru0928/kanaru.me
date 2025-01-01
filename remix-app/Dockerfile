FROM node:20-slim AS base

WORKDIR /app

RUN apt-get update && apt-get install -y \
  openssl && \
  apt-get clean && rm -rf /var/lib/apt/lists/*
COPY package.json package-lock.json /app/

FROM base AS deps

COPY package.json package-lock.json panda.config.ts /app/
RUN npm install --force

FROM base AS production-deps

COPY package.json package-lock.json panda.config.ts /app/
RUN npm ci --force

FROM base AS build
ENV NODE_ENV=production

COPY --from=deps /app/node_modules /app/node_modules
ADD . .

RUN npm run build

FROM base AS runner
ENV NODE_ENV=production
ENV PORT=3000
COPY --from=public.ecr.aws/awsguru/aws-lambda-adapter:0.8.4 /lambda-adapter /opt/extensions/lambda-adapter

COPY --from=production-deps /app/node_modules /app/node_modules
COPY --from=build /app/build /app/build
COPY --from=build /app/public /app/public
COPY --from=build /app/package.json /app/package.json
EXPOSE 3000
CMD [ "npm", "start" ]
