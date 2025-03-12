# 教室预订系统后端

## 项目描述
这是教室预订系统的 Spring Boot 后端服务，提供用户管理、教室管理、预订管理等功能的 RESTful API。

## 技术栈
- Spring Boot 3.x
- Spring Data JPA
- Spring Security
- MySQL

## 如何运行
1. 确保安装了 JDK 17+ 和 Maven
2. 配置 `application.properties` 中的数据库连接信息
3. 运行命令：`mvn spring-boot:run`
4. 服务将在 http://localhost:8080 上启动

## API 文档
启动应用后访问：http://localhost:8080/swagger-ui.html