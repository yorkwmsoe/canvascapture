FROM node:18-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

FROM base AS build
COPY . /usr/src/app
WORKDIR /usr/src/app
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
COPY /apps/desktop /apps/desktop
COPY /apps/cli /apps/cli

FROM base AS cli
COPY --from=build /apps/cli /apps/cli
WORKDIR /apps/cli

FROM base AS desktop
COPY --from=build /apps/desktop /apps/desktop
WORKDIR /apps/desktop