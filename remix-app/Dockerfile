FROM oven/bun:1 AS base

WORKDIR /app

RUN apt-get update && apt-get install -y \
  openssl && \
  apt-get clean && rm -rf /var/lib/apt/lists/*
COPY package.json bun.lockb /app/

FROM base AS deps

COPY package.json bun.lockb panda.config.ts /app/
RUN bun install --frozen-lockfile

FROM base AS production-deps

COPY package.json bun.lockb panda.config.ts /app/
RUN bun install --production --frozen-lockfile

FROM base AS build
ENV NODE_ENV=production

COPY --from=deps /app/node_modules /app/node_modules
ADD . .

RUN bun run build

FROM base AS runner
ENV NODE_ENV=production

COPY --from=public.ecr.aws/awsguru/aws-lambda-adapter:0.8.4 /lambda-adapter /opt/extensions/lambda-adapter

COPY --from=production-deps /app/node_modules /app/node_modules
COPY --from=build /app/build /app/build
COPY --from=build /app/public /app/public
COPY --from=build /app/package.json /app/package.json
EXPOSE 3000
CMD [ "bun", "start" ]
