#include <iostream>
#include <sys/socket.h>
#include <stdio.h>
#include <netinet/in.h>
#include <arpa/inet.h>
#include <unistd.h>
#include <string.h>
#include <cstdlib>

using namespace std;

int main(int argc, char* argv[]) {




    if (argc != 3) {
    std::cerr << "Usage: ./client <server_ip> <port>\n";
    return 1;
}

    std::string server_ip = argv[1];      
    int port = std::atoi(argv[2]); 

    int sock = socket(AF_INET, SOCK_STREAM, 0);
    if (sock < 0) {
        perror("error creating socket");
    }

    struct sockaddr_in sin;
    memset(&sin, 0, sizeof(sin));
    sin.sin_family = AF_INET;
    sin.sin_addr.s_addr = inet_addr(server_ip.c_str());
    sin.sin_port = htons(port);

    if (connect(sock, (struct sockaddr *) &sin, sizeof(sin)) < 0) {
        perror("error connecting to server");
    }
 while (true) {
        
        string line;
        getline(cin, line);         // read full line from user

        // send command to server
        int sent_bytes = send(sock, line.c_str(), line.size(), 0);
        if (sent_bytes < 0) {
            perror("send failed");
            break;
        }



        char buffer[4096];
        int expected_data_len = sizeof(buffer);
        int read_bytes = recv(sock, buffer, expected_data_len, 0);

    if (read_bytes == 0) {
            break;
    // connection is closed
    }
    else if (read_bytes < 0) {
            
          perror("recv failed");
          break;
    // error
    }
    else {
        cout << string(buffer, read_bytes) << endl;

    }

   
}

 close(sock);


    return 0;
}