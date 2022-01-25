FROM node:14.18.3-alpine

# тут мы указываем куда положем наш сервис в контейнере
WORKDIR /usr/src/tracker

# эта гоманда говорит " скопируй package.json и package-lock.json в root дерикторию"
COPY package*.json ./

RUN npm install

# Все файлы которые лажеат в проекте, ъотим скопировать внутрь контейнера
COPY . .

RUN npm run build

CMD ./scripts/start.sh

