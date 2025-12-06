#ifndef SERVER_H
#define SERVER_H

#include <sys/socket.h>
#include <netinet/in.h>

class Server {
public:
    virtual int accept_client() { return -1; }

    virtual ~Server() = default;
};

namespace ServerUtils {
    inline void handleClient(Server& server, std::vector<int>& results, int index, std::atomic<int>& counter) {
        int client_fd = server.accept_client();
        results[index] = client_fd;
        counter.fetch_add(1);
    }
}

#endif // SERVER_H