FROM node:22-alpine
WORKDIR /app
COPY package*.json ./
COPY packages/db/package*.json ./packages/db/
COPY apps/workers/package*.json ./apps/workers/
RUN npm install
COPY packages/db ./packages/db
COPY apps/workers ./apps/workers
COPY turbo.json ./
RUN npm run build --workspace=packages/db
RUN npm run build --workspace=apps/workers
CMD ["node", "apps/workers/dist/index.js"]
