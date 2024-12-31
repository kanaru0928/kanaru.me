FROM node:20-slim AS base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
ENV NODE_ENV=production

WORKDIR /app

RUN apt-get update && apt-get install -y \
  openssl && \
  apt-get clean && rm -rf /var/lib/apt/lists/*
COPY package.json pnpm-lock.yaml /app/
RUN corepack enable

FROM base AS deps

COPY package.json pnpm-lock.yaml panda.config.ts /app/
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --production=false --frozen-lockfile

FROM base AS production-deps

COPY package.json pnpm-lock.yaml panda.config.ts /app/
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod --frozen-lockfile

FROM base AS build

COPY --from=deps /app/node_modules /app/node_modules
ADD . .

RUN pnpm run build

FROM base AS runner
COPY --from=public.ecr.aws/awsguru/aws-lambda-adapter:0.8.4 /lambda-adapter /opt/extensions/lambda-adapter

COPY --from=production-deps /app/node_modules /app/node_modules
COPY --from=build /app/build /app/build
COPY --from=build /app/public /app/public
COPY --from=build /app/package.json /app/package.json
EXPOSE 3000
CMD [ "pnpm", "start" ]
