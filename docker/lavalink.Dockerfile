FROM ubuntu:22.04
WORKDIR /app
RUN apt update && apt upgrade -y && apt-get install -y locales openjdk-17-jdk && rm -rf /var/lib/apt/lists/* \
    && localedef -i en_US -c -f UTF-8 -A /usr/share/locale/locale.alias en_US.UTF-8
ENV LANG=en_US.utf8
COPY lavalink/lavalink-4_0_7.jar lavalink.jar
CMD java -jar lavalink.jar