# Dùng OpenJDK 17
FROM eclipse-temurin:17-jdk-alpine

# Thư mục làm việc
WORKDIR /app

# Copy file Maven build
COPY pom.xml .
COPY src ./src
COPY mvnw .
COPY .mvn .mvn

# Build ứng dụng
RUN ./mvnw clean package -DskipTests || mvn clean package -DskipTests

# Expose port
EXPOSE 8080

# Run ứng dụng
ENTRYPOINT ["java","-jar","target/cafe-management-1.0.0.jar"]
