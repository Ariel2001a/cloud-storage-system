#ifndef SERVER_H
#define SERVER_H

#include <sys/socket.h>
#include <netinet/in.h>
#include <condition_variable>
#include <string>
#include <vector>
#include <mutex>
#include <condition_variable>  
#include <atomic>   

class Server {
public:
    virtual int accept_client() { return -1; }
    
    virtual std::string processMessage(const std::string& msg) {
        if (msg.empty()) return "ERROR";
        if (msg == "PING") return "PONG";
        return "OK";
    }

    std::string handle_message(const std::string& msg);


    virtual ~Server() = default;
};

namespace ServerUtils {
    inline void handleClientInOrder(Server& server, std::vector<int>& results,
                                        int index, std::atomic<int>& counter,
                                        std::mutex& mtx, std::condition_variable& cv,
                                        int& next_index) {
            int client_fd = server.accept_client();

            std::unique_lock<std::mutex> lock(mtx);
            cv.wait(lock, [&]{ return index == next_index; });

            results[index] = client_fd;
            ++next_index;
            counter.fetch_add(1);

            cv.notify_all();
        }
}

#endif // SERVER_H