#ifndef TCP_SERVER_COMMUNICATION_H
#define TCP_SERVER_COMMUNICATION_H

#include "ICommunication.h"

using namespace std;

class TCPServerCommunication : public ICommunication {
public: 
    TCPServerCommunication(int port);
    ~TCPServerCommunication();
    string read() override;
    void write(const string& message) override;

private:
    int server_socket;
    int client_socket;
};

#endif // TCP_SERVER_COMMUNICATION_H
