FROM node:18-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

FROM base AS build
COPY . /usr/src/app
WORKDIR /usr/src/app
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm deploy --filter=canvas-capture-desktop --prod /prod/desktop
RUN pnpm deploy --filter=canvas-capture-cli --prod /prod/cli

FROM base AS cli
COPY --from=build /prod/cli /prod/cli
WORKDIR /prod/cli

FROM base AS desktop
COPY --from=build /prod/desktop /prod/desktop
WORKDIR /prod/desktop