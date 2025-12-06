#include <iostream>
#include <sys/socket.h>
#include <stdio.h>
#include <netinet/in.h>
#include <arpa/inet.h>
#include <unistd.h>
#include <string.h>
#include <cstdlib>

#include "TCPServerCommunication.h"
#include "HandleClient.h"
#include "CommandManager.h"

using namespace std;

int main(int argc, char* argv[]) {

    if (argc != 2) {
        std::cerr << "Usage: ./server <port>\n";
        return 1;
    }

    const int server_port = atoi(argv[1]);

    CommandManager manager = HandleClient::init();

    TCPServerCommunication server_comm(server_port);

    string message_from_client = server_comm.read();

    string message_to_client = HandleClient::processClient(message_from_client, manager);

    server_comm.write(message_to_client);

    server_comm.~TCPServerCommunication();

    return 0;
}