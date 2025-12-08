FROM gcc:latest


  RUN apt-get update && apt-get install -y cmake
WORKDIR /usr/src/app

# Copy the correct client source
COPY tcp_c.cpp .

#Compile
RUN g++ -std=c++17 -o tcp_c tcp_c.cpp

ENTRYPOINT ["./tcp_c"]



