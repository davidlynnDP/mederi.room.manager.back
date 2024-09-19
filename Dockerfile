FROM node:21-alpine3.19 as dev
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
CMD [ "npm", "run", "start:dev" ]



FROM node:21-alpine3.19 as dev-deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci


FROM node:21-alpine3.19 as builder
WORKDIR /app
COPY --from=dev-deps /app/node_modules ./node_modules
COPY . .
RUN npm run build


FROM node:21-alpine3.19 as prod-deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install --only=production


FROM node:21-alpine3.19 as prod
EXPOSE 3000
WORKDIR /app
COPY --from=prod-deps /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist


CMD [ "node","dist/main.js"]