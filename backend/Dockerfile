FROM node:20-alpine

WORKDIR /app

# Устанавливаем необходимые системные зависимости
RUN apk add --no-cache python3 make g++

# Копируем package.json и package-lock.json
COPY package*.json ./

# Устанавливаем зависимости
RUN npm install

# Копируем исходный код
COPY . .

# Создаем директорию для загрузок
RUN mkdir -p uploads

EXPOSE 4000

# Запускаем сервер в режиме разработки
CMD ["npm", "run", "dev"]