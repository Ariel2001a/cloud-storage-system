FROM gcc:latest

RUN apt-get update && apt-get install -y cmake

COPY . /usr/src/app

WORKDIR /usr/src/app

RUN mkdir build && mkdir -p /usr/src/app/newFiles
WORKDIR /usr/src/app/build

RUN cmake .. && make
#folder of created and saved files
ENV EX1_DIR=/usr/src/app/newFiles


CMD [ "./MyProgram" ]