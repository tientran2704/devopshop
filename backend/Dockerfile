# Dùng OpenJDK 17
FROM eclipse-temurin:17-jdk-alpine

# Thư mục làm việc
WORKDIR /app

# Cài Maven và các công cụ cần thiết
RUN apk add --no-cache maven curl

# Copy Maven settings để tăng timeout và retry khi download dependencies
RUN mkdir -p /root/.m2
COPY .m2/settings.xml /root/.m2/settings.xml

# Copy pom.xml trước để tận dụng Docker layer caching
COPY pom.xml .

# Download dependencies (tách riêng để cache tốt hơn)
# Retry nếu download thất bại
RUN mvn dependency:go-offline -B || \
    (sleep 5 && mvn dependency:go-offline -B) || \
    (sleep 10 && mvn dependency:go-offline -B) || \
    mvn dependency:resolve -B

# Copy source code
COPY src ./src

# Build ứng dụng với retry mechanism
RUN mvn clean package -DskipTests -B || \
    (echo "Build failed, retrying..." && sleep 5 && mvn clean package -DskipTests -B) || \
    (echo "Build failed again, retrying one more time..." && sleep 10 && mvn clean package -DskipTests -B)

# Expose port
EXPOSE 8080

# Run ứng dụng
ENTRYPOINT ["java","-jar","target/cafe-management-1.0.0.jar"]
