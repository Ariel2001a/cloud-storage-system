#ifndef CLIENT_TASK_H
#define CLIENT_TASK_H

#include <string>
#include <mutex>

#include "ITask.h"
#include "CommandManager.h"
#include "TCPServerCommunication.h"
#include "HandleClient.h"

class ClientTask : public Task {
private:
    int client_socket;
    CommandManager* manager;
    std::mutex* manager_mutex;
    TCPServerCommunication* server_comm;

public:
    ClientTask(int socket,
               CommandManager* mgr,
               std::mutex* mtx,
               TCPServerCommunication* comm);

    void execute() override;
};

#endif
