#include "ClientTask.h"
#include <unistd.h>

// Constructor: initializes the task with client socket, command manager, mutex, and server communication
ClientTask::ClientTask(int socket,
                       CommandManager* mgr,
                       std::mutex* mtx,
                       TCPServerCommunication* comm)
    : client_socket(socket),
      manager(mgr),
      manager_mutex(mtx),
      server_comm(comm) {}

// Executes the client task
void ClientTask::execute() {
    while (true) {

        // Read a message from the client
        std::string message = server_comm->read(client_socket);
        if (message.empty())
            break;

        // Process the message using the command manager with proper synchronization
        std::string response =HandleClient::processClient(message, *manager, *manager_mutex);

        // Send the response back to the client
        server_comm->write(client_socket, response);
    }

    // Close the client socket when done
    close(client_socket);
}
