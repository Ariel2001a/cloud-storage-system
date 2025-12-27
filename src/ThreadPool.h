#ifndef THREAD_POOL_H
#define THREAD_POOL_H

#include <vector>
#include <queue>
#include <mutex>
#include <condition_variable>
#include <pthread.h>

#include "ITask.h"

// ThreadPool class: manages a fixed number of worker threads
// that execute submitted tasks asynchronously
class ThreadPool {
private:
    std::vector<pthread_t> workers;
    std::queue<Task*> tasks;

    std::mutex queue_mutex;
    std::condition_variable_any cv;
    bool stop;

    static void* workerThread(void* arg);
    void run();

public:
    explicit ThreadPool(size_t numThreads);
    ~ThreadPool();

    void submit(Task* task);
};

#endif
