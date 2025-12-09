FROM gcc:latest

RUN apt-get update && apt-get install -y cmake g++ make

COPY ./test /usr/src/app/test
COPY ./src /usr/src/app/src

WORKDIR /usr/src/app/test
RUN mkdir -p build

WORKDIR /usr/src/app/test/build
RUN cmake .. && make

ENV EX1_DIR=/usr/src/app/newFiles
RUN mkdir -p /usr/src/app/newFiles
