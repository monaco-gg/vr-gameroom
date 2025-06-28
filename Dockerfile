# ========== STAGE 1: BUILD ==========
FROM node:20-alpine AS builder
WORKDIR /src

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# ========== STAGE 2: PRODUCTION ==========
FROM node:20-alpine
WORKDIR /src

ENV NODE_ENV=production

COPY --from=builder /src/package*.json ./
COPY --from=builder /src/node_modules ./node_modules
COPY --from=builder /src/.next ./.next
COPY --from=builder /src/public ./public

EXPOSE 8052
CMD ["npm", "run", "start"]
