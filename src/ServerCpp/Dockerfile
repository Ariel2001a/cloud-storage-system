
# Use the latest GCC image as the base (includes g++ compiler)
FROM gcc:latest


# Install make and clean up apt cache
RUN apt-get update && \
    apt-get install -y make && \
    apt-get clean

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy the main server source file into the container
COPY ServerCpp/RealServer.cpp .


# Copy all other C++ source files into the container
COPY *.cpp .


# Copy all header files into the container
COPY *.h .



# Compile all C++ source files into an executable named ServerCpp
# Enable C++17 standard and pthread support for multithreading
RUN g++ -std=c++17 -pthread -o ServerCpp *.cpp


# Expose the port that the server will listen on
EXPOSE 3782


# Set the command to run when the container starts
ENTRYPOINT ["./ServerCpp"]



