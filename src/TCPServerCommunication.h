#ifndef TCP_SERVER_COMMUNICATION_H
#define TCP_SERVER_COMMUNICATION_H

#include "ICommunication.h"

using namespace std;

class TCPServerCommunication : public ICommunication {
public: 
    TCPServerCommunication(int port);
    ~TCPServerCommunication();
    string read(int client_socket);
    void write(int client_socket, const string& message);

    int acceptClient();

private:
    int server_socket;
};

#endif // TCP_SERVER_COMMUNICATION_H
