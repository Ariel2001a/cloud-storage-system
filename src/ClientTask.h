#ifndef CLIENT_TASK_H
#define CLIENT_TASK_H

#include <string>
#include <mutex>

#include "ITask.h"
#include "CommandManager.h"
#include "TCPServerCommunication.h"
#include "HandleClient.h"

// ClientTask represents a task for handling communication with a single client
class ClientTask : public Task {
private:
    int client_socket;
    CommandManager* manager;
    std::mutex* manager_mutex;
    TCPServerCommunication* server_comm;

public:
    // Constructor: initializes the task with client socket, manager, mutex, and server communication
    ClientTask(int socket,
               CommandManager* mgr,
               std::mutex* mtx,
               TCPServerCommunication* comm);

    // Override execute() to handle client communication
    void execute() override;
};

#endif
