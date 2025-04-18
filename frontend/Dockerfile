FROM node:18-alpine

WORKDIR /app

# Установка зависимостей для разработки
RUN apk add --no-cache python3 make g++

# Копируем package.json и package-lock.json
COPY package*.json ./

# Устанавливаем зависимости
RUN npm install

# Копируем исходный код
COPY . .

EXPOSE 3000

# Запускаем в режиме разработки
CMD ["npm", "run", "dev"] 