#ifndef MOCKSERVER_H
#define MOCKSERVER_H

#include "Server.h"
#include <gmock/gmock.h>

class MockServer : public Server {
public:
    MOCK_METHOD(int, accept_client, (), (override));
};

#endif // MOCKSERVER_H