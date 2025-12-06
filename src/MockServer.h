#ifndef MOCKSERVER_H
#define MOCKSERVER_H

#include "Server.h"
#include <queue>
#include <mutex>

class MockServer : public Server {
public:
    MockServer(const std::vector<int>& values) {
        for (int v : values) {
            clients.push(v);
        }
    }

    int accept_client() override {
        std::lock_guard<std::mutex> lock(mtx);
        if (clients.empty()) return -1;
        int client_fd = clients.front();
        clients.pop();
        return client_fd;
    }

private:
    std::queue<int> clients;
    std::mutex mtx;
};

#endif // MOCKSERVER_H
