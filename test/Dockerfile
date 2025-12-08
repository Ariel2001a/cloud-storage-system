FROM gcc:latest

RUN apt-get update && apt-get install -y cmake

COPY ./test /usr/src/app/test
COPY ./src /usr/src/app/src

WORKDIR /usr/src/mytest/test
RUN mkdir -p build

WORKDIR /usr/src/app/test/build
RUN cmake .. && make

ENV EX1_DIR=/usr/src/app/newFiles
