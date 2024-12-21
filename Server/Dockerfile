FROM node:20.17.0-alpine

WORKDIR /app

# Copy và cài đặt các dependencies
COPY package*.json ./

RUN npm install

# Copy toàn bộ mã nguồn
COPY . .

# Expose cổng server (thay đổi nếu cần)
EXPOSE 5000

# Lệnh khởi chạy ứng dụng
CMD ["npm", "start"]
