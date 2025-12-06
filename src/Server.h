#ifndef SERVER_H
#define SERVER_H

#include <sys/socket.h>
#include <netinet/in.h>

class Server {
public:
    virtual int accept_client() { return -1; }

    virtual ~Server() = default;
};

#endif // SERVER_H