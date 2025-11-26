# Image Node nhẹ
FROM node:20-alpine

# Thư mục làm việc trong container
WORKDIR /app

# Copy file package vào trước để cache layer npm install
COPY package*.json ./

# Cài dependency (chỉ prod cho nhẹ, tuỳ bạn)
RUN npm install --production

# Copy toàn bộ source code vào container
COPY . .

# Biến môi trường (có thể override bằng docker-compose)
ENV NODE_ENV=production
ENV PORT=8080

# Expose port Express sẽ listen
EXPOSE 8080

# Lệnh chạy app
# YÊU CẦU trong package.json phải có "start": "node index.js" hoặc tương tự
CMD ["npm", "start"]
