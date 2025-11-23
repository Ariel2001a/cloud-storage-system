FROM gcc:latest

RUN apt-get update && apt-get install -y cmake

COPY . /usr/src/mytest

WORKDIR /usr/src/mytest
ENV EX1_DIR=/usr/src/mytest


RUN mkdir build && mkdir -p /usr/src/mytest/newFiles
WORKDIR /usr/src/mytest/build

RUN cmake .. && make

ENV EX1_DIR=/usr/src/mytest/newFiles

CMD [ "./MyProgram" ]