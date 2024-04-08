FROM node:21-alpine3.18

WORKDIR /app

COPY package.json package.json 

RUN npm install

COPY . .

CMD ["node", "dist/main"]