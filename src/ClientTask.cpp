#include "ClientTask.h"
#include <unistd.h>

ClientTask::ClientTask(int socket,
                       CommandManager* mgr,
                       std::mutex* mtx,
                       TCPServerCommunication* comm)
    : client_socket(socket),
      manager(mgr),
      manager_mutex(mtx),
      server_comm(comm) {}

void ClientTask::execute() {
    while (true) {
        std::string message = server_comm->read(client_socket);
        if (message.empty())
            break;

        std::string response =HandleClient::processClient(message, *manager, *manager_mutex);

        server_comm->write(client_socket, response);
    }

    close(client_socket);
}
