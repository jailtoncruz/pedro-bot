FROM openjdk:24-slim
WORKDIR /app
COPY lavalink/lavalink-4_0_7.jar lavalink.jar
CMD java -jar lavalink.jar