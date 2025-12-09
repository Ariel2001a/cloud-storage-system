// TCPServerCommunication.h
// This class implements the ICommunication interface for TCP server communication.
// It provides methods to create a server socket, accept client connections,
// and read/write messages from/to clients.

#ifndef TCP_SERVER_COMMUNICATION_H
#define TCP_SERVER_COMMUNICATION_H

#include "ICommunication.h"

using namespace std;

class TCPServerCommunication : public ICommunication {
public: 

    // Constructor: create a TCP server socket on the specified port
    TCPServerCommunication(int port);

    // Destructor: close the server socket
    ~TCPServerCommunication();

    // Read data from a connected client socket
    string read(int client_socket);

    // Write data to a connected client socket
    void write(int client_socket, const string& message);

    // Accept a new client connection and return the client socket descriptor
    int acceptClient();

private:
    int server_socket;
};

#endif // TCP_SERVER_COMMUNICATION_H
