#include <iostream>
#include <sys/socket.h>
#include <stdio.h>
#include <netinet/in.h>
#include <arpa/inet.h>
#include <unistd.h>
#include <string.h>
#include <cstdlib>
#include <mutex>
#include <thread>

#include "TCPServerCommunication.h"
#include "HandleClient.h"
#include "CommandManager.h"
 
// SERVER IMPLEMENTATION
using namespace std;

int main(int argc, char* argv[]) {

    if (argc != 2) {
        std::cerr << "Usage: ./server <port>\n";
        return 1;
    }

    std::mutex manager_mutex;

    const int server_port = atoi(argv[1]);

    CommandManager manager = HandleClient::init();

    TCPServerCommunication server_comm(server_port);

    while (true) {

        int client_socket = server_comm.acceptClient();

        std::thread client_thread([client_socket, &manager, &manager_mutex, &server_comm]() {

            while (true) {
                string message = server_comm.read(client_socket);
                if (message.empty()) break;


                string response = HandleClient::processClient(message, manager, manager_mutex);

                server_comm.write(client_socket, response);
            }

            close(client_socket);
        });
        client_thread.detach();
    }

    return 0;
}