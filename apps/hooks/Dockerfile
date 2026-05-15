FROM node:22-alpine
WORKDIR /app
COPY package*.json ./
COPY packages/db/package*.json ./packages/db/
COPY apps/hooks/package*.json ./apps/hooks/
RUN npm install
COPY packages/db ./packages/db
COPY apps/hooks ./apps/hooks
COPY turbo.json ./
RUN npm run build --workspace=packages/db
RUN npm run build --workspace=apps/hooks
CMD ["node", "apps/hooks/dist/index.js"]
