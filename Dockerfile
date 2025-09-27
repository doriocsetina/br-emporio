# Step 1: Build the app
FROM node:22-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm install

# Allow build-time database URL argument
RUN npx drizzle-kit generate

COPY . .
RUN npm run build

# Step 2: Run the app
FROM node:22-alpine
WORKDIR /app


COPY --from=builder /app/package*.json ./
RUN npm install --omit=dev

COPY --from=builder /app/build ./build
COPY --from=builder /app/.svelte-kit ./.svelte-kit
COPY --from=builder /app/static ./static
COPY --from=builder /app/drizzle ./drizzle

EXPOSE 3000
CMD ["node", "build"]
