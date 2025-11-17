# Use latest GCC image
FROM gcc:latest

# Install cmake
RUN apt-get update && apt-get install -y cmake

# Copy your project files
COPY . /usr/src/mytest

# Set working directory
WORKDIR /usr/src/mytest

# Create build directory
RUN mkdir build
WORKDIR /usr/src/mytest/build

# Configure and build with cmake
RUN cmake .. && make

# Run tests when container starts
CMD ["./runTests"]
