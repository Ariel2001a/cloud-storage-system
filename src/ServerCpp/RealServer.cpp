#include <iostream>
#include <sys/socket.h>
#include <stdio.h>
#include <netinet/in.h>
#include <arpa/inet.h>
#include <unistd.h>
#include <string.h>
#include <cstdlib>
#include <mutex>
#include <pthread.h>

#include "TCPServerCommunication.h"
#include "HandleClient.h"
#include "CommandManager.h"
#include "Config.h"

// SERVER IMPLEMENTATION

using namespace std;

// Struct to hold arguments passed to each client thread
struct ThreadArgs {
    int client_socket;
    CommandManager* manager;
    std::mutex* manager_mutex;
    TCPServerCommunication* server_comm;
};

// Thread function to handle a single client
void* client_handler(void* arg) {
    ThreadArgs* args = (ThreadArgs*)arg;
    int client_socket = args->client_socket;
    CommandManager* manager = args->manager;
    std::mutex* manager_mutex = args->manager_mutex;
    TCPServerCommunication* server_comm = args->server_comm;

    while (true) {
        string message = server_comm->read(client_socket);
        if (message.empty()) break; // Client disconnected

        // Process message with mutex for thread-safe access
        string response = HandleClient::processClient(message, *manager, *manager_mutex);
        server_comm->write(client_socket, response);
    }

    close(client_socket);
    delete args;  // Free allocated arguments
    return nullptr;
}

int main(int argc, char* argv[]) {
    if (argc != 2) {
        cout << SERVER_ERROR << endl;
        return 1;
    }

    mutex manager_mutex;    // Protect shared CommandManager
    int server_port = atoi(argv[1]);
    CommandManager manager = HandleClient::init();
    TCPServerCommunication server_comm(server_port);

    while (true) {
        int client_socket = server_comm.acceptClient();  // Wait for a new client

        // Allocate arguments for the thread
        ThreadArgs* args = new ThreadArgs{ client_socket, &manager, &manager_mutex, &server_comm };
        pthread_t tid;

        if (pthread_create(&tid, nullptr, client_handler, args) != 0) {
            cout << SERVER_ERROR << endl;
            close(client_socket);
            delete args;
            continue;
        }

        pthread_detach(tid); // Run thread independently
    }

    return 0;
}