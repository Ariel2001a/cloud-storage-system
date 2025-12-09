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

using namespace std;

// ---------------------------------------------------------
//     מבנה להעברת פרמטרים ל־pthread
// ---------------------------------------------------------
struct ThreadArgs {
    int client_socket;
    CommandManager* manager;
    std::mutex* manager_mutex;
    TCPServerCommunication* server_comm;
};

// ---------------------------------------------------------
//      פונקציית Thread — מטפלת בלקוח אחד
// ---------------------------------------------------------
void* client_handler(void* arg) {
    ThreadArgs* args = (ThreadArgs*)arg;

    int client_socket = args->client_socket;
    CommandManager* manager = args->manager;
    std::mutex* manager_mutex = args->manager_mutex;
    TCPServerCommunication* server_comm = args->server_comm;

    while (true) {

        std::string message = server_comm->read(client_socket);
        if (message.empty())
            break;

        std::string response = HandleClient::processClient(message, *manager, *manager_mutex);

        server_comm->write(client_socket, response);
    }

    close(client_socket);
    delete args;  // חובה — אחרת דליפת זיכרון

    return nullptr;
}

// ---------------------------------------------------------
//                    פונקציית main — השרת
// ---------------------------------------------------------
int main(int argc, char* argv[]) {

    if (argc != 2) {
        std::cout << SERVER_ERROR << std::endl;
        return 1;
    }

    std::mutex manager_mutex;

    const int server_port = atoi(argv[1]);

    CommandManager manager = HandleClient::init();

    TCPServerCommunication server_comm(server_port);

    while (true) {

        int client_socket = server_comm.acceptClient();

        // בניית מבנה args ל־pthread
        ThreadArgs* args = new ThreadArgs{
            client_socket,
            &manager,
            &manager_mutex,
            &server_comm
        };

        pthread_t tid;

        // יצירת thread חדש ללקוח
        if (pthread_create(&tid, nullptr, client_handler, args) != 0) {
            std::cout << SERVER_ERROR << std::endl;
            close(client_socket);
            delete args;
            continue;
        }

        // שחרור אוטומטי של המשאבים כשה-thread מסיים
        pthread_detach(tid);
    }

    return 0;
}