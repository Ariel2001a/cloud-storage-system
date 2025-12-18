#include "ThreadPool.h"

void* ThreadPool::workerThread(void* arg) {
    ((ThreadPool*)arg)->run();
    return nullptr;
}

ThreadPool::ThreadPool(size_t numThreads) : stop(false) {
    workers.resize(numThreads);
    for (size_t i = 0; i < numThreads; ++i) {
        pthread_create(&workers[i], nullptr, workerThread, this);
    }
}

void ThreadPool::run() {
    while (true) {
        Task* task;

        {
            std::unique_lock<std::mutex> lock(queue_mutex);
            cv.wait(lock, [this] {
                return !tasks.empty() || stop;
            });

            if (stop && tasks.empty())
                return;

            task = tasks.front();
            tasks.pop();
        }

        task->execute();
        delete task;
    }
}

void ThreadPool::submit(Task* task) {
    {
        std::lock_guard<std::mutex> lock(queue_mutex);
        tasks.push(task);
    }
    cv.notify_one();
}

ThreadPool::~ThreadPool() {
    {
        std::lock_guard<std::mutex> lock(queue_mutex);
        stop = true;
    }

    cv.notify_all();

    for (pthread_t& t : workers) {
        pthread_join(t, nullptr);
    }
}
