FROM node:22-alpine
WORKDIR /app
COPY package*.json ./
COPY packages/db/package*.json ./packages/db/
COPY apps/scheduler/package*.json ./apps/scheduler/
RUN npm install
COPY packages/db ./packages/db
COPY apps/scheduler ./apps/scheduler
COPY turbo.json ./
RUN npm run build --workspace=packages/db
RUN npm run build --workspace=apps/scheduler
CMD ["node", "apps/scheduler/dist/index.js"]
