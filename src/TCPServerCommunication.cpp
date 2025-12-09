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

    if (listen(server_socket, 10) < 0) {
        perror("error listening to a socket");
    }
}

TCPServerCommunication::~TCPServerCommunication() {
    close(server_socket);
}

int TCPServerCommunication::acceptClient() {
    struct sockaddr_in client_addr;
    socklen_t client_len = sizeof(client_addr);
    int client_socket = accept(server_socket, (struct sockaddr *)&client_addr, &client_len);
    if (client_socket < 0) {
        perror("error accepting client");
    }
    return client_socket;
}

string TCPServerCommunication::read(int client_socket) {
    char buffer[4096];
    int read_bytes = recv(client_socket, buffer, sizeof(buffer), 0);

    if (read_bytes <= 0)
        return "";

    return string(buffer, read_bytes);
}

void TCPServerCommunication::write(int client_socket, const string& msg) {
    send(client_socket, msg.c_str(), msg.size(), 0);
}
