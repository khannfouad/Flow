FROM node:22-alpine
WORKDIR /app
COPY package*.json ./
COPY packages/db/package*.json ./packages/db/
COPY apps/processor/package*.json ./apps/processor/
RUN npm install
COPY packages/db ./packages/db
COPY apps/processor ./apps/processor
COPY turbo.json ./
RUN npm run build --workspace=packages/db
RUN npm run build --workspace=apps/processor
CMD ["node", "apps/processor/dist/index.js"]
