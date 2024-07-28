FROM ubuntu:22.04
WORKDIR /app
RUN apt update && apt upgrade -y && apt-get install -y locales ca-certificates curl gnupg git && \
    mkdir -p /etc/apt/keyrings && curl -fsSL https://deb.nodesource.com/gpgkey/nodesource-repo.gpg.key | gpg --dearmor -o /etc/apt/keyrings/nodesource.gpg \
    && echo "deb [signed-by=/etc/apt/keyrings/nodesource.gpg] https://deb.nodesource.com/node_21.x nodistro main" | tee /etc/apt/sources.list.d/nodesource.list \
    && apt update && apt install nodejs -y \
    && npm install -g pnpm \
    && rm -rf /var/lib/apt/lists/* \
    && localedef -i en_US -c -f UTF-8 -A /usr/share/locale/locale.alias en_US.UTF-8

ENV LANG=en_US.utf8

COPY package.json .
COPY src .
COPY tsconfig.json .
COPY pnpm-lock.yaml .
RUN pnpm install && pnpm build && rm -rf src tsconfig.json
ENV NODE_ENV=production
CMD pnpm start:prod