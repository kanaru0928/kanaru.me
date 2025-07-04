FROM node:22-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
ENV AWS_REGION=ap-northeast-1
RUN npm install -g pnpm
COPY . /app
WORKDIR /app

FROM base AS prod-deps
RUN pnpm fetch --prod
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod --frozen-lockfile

FROM base AS build
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm run build

FROM base AS runner
ENV NODE_ENV=production
ENV PORT=3000
COPY --from=public.ecr.aws/awsguru/aws-lambda-adapter:0.8.4 /lambda-adapter /opt/extensions/lambda-adapter

COPY --from=prod-deps /app/node_modules /app/node_modules
COPY --from=build /app/build/server /app/build/server
COPY --from=build /app/package.json /app/package.json
EXPOSE 3000
CMD [ "pnpm", "start" ]
