FROM node:22-alpine
WORKDIR /app
COPY package*.json ./
COPY packages/db/package*.json ./packages/db/
COPY apps/entry_backend/package*.json ./apps/entry_backend/
RUN npm install
COPY packages/db ./packages/db
COPY apps/entry_backend ./apps/entry_backend
COPY turbo.json ./
RUN npm run build --workspace=packages/db
RUN npm run build --workspace=apps/entry_backend
CMD ["node", "apps/entry_backend/dist/index.js"]