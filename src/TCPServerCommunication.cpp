#include "TCPServerCommunication.h"
#include <arpa/inet.h>
#include <unistd.h>
#include <string.h>
#include <cstdlib>
#include <iostream>
using namespace std;

TCPServerCommunication::TCPServerCommunication(int port) {
    server_socket = socket(AF_INET, SOCK_STREAM, 0);
    if (server_socket < 0) {
        perror("error creating socket");
    }

    struct sockaddr_in sin;
    memset(&sin, 0, sizeof(sin));
    sin.sin_family = AF_INET;
    sin.sin_addr.s_addr = INADDR_ANY;
    sin.sin_port = htons(port);

    if (bind(server_socket, (struct sockaddr *) &sin, sizeof(sin)) < 0) {
        perror("error binding socket");
    }

    if (listen(server_socket, 5) < 0) {
        perror("error listening to a socket");
    }

    struct sockaddr_in client_sin;
    unsigned int addr_len = sizeof(client_sin);
    client_socket = accept(server_socket,  (struct sockaddr *) &client_sin,  &addr_len);

    if (client_socket < 0) {
        perror("error accepting client");
    }
}

TCPServerCommunication::~TCPServerCommunication() {
    close(client_socket);
    close(server_socket);
}

string TCPServerCommunication::read() {
    char buffer[4096];
    int expected_data_len = sizeof(buffer);
    int read_bytes = recv(client_socket, buffer, expected_data_len, 0);
    if (read_bytes == 0) {
        // connection is closed
        return "";
    }
    else if (read_bytes < 0) {
        // error
        perror("recv failed");
        return "";
    }
    else {
        return string(buffer, read_bytes);
    }
}

void TCPServerCommunication::write(const string& message) {
    int sent_bytes = send(client_socket, message.c_str(), message.size(), 0);
    if (sent_bytes < 0) {
        perror("send failed");
    }
}