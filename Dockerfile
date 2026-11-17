FROM node:22-slim as builder

WORKDIR /my-build

ARG VITE_API_BASE_URL

ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

COPY package.json ./
COPY package-lock.json ./

RUN npm ci

COPY . .

RUN npm run build


FROM nginx:alpine

RUN rm -rf /usr/share/nginx/html/*

COPY --from=builder /my-build/dist /usr/share/nginx/html

RUN rm -rf /etc/nginx/conf.d/default.conf

COPY nginx.conf /etc/nginx/conf.d

EXPOSE 80
