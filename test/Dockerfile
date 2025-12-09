# Use the latest GCC image as the base (includes g++ compiler)
FROM gcc:latest

# Install necessary tools: cmake, g++ compiler, and make
RUN apt-get update && apt-get install -y cmake g++ make


# Copy source code and test directories into the container
COPY ./test /usr/src/app/test
COPY ./src /usr/src/app/src

# Set working directory to the test folder and create a build directory
WORKDIR /usr/src/app/test
RUN mkdir -p build

# Switch to the build directory, configure the project with CMake and compile
WORKDIR /usr/src/app/test/build
RUN cmake .. && make


# Set an environment variable for a directory and create it
ENV EX1_DIR=/usr/src/app/newFiles
RUN mkdir -p /usr/src/app/newFiles
