#include "ThreadPool.h"

// Static worker function called by pthreads, redirects to the member run() method
void* ThreadPool::workerThread(void* arg) {
    ((ThreadPool*)arg)->run();
    return nullptr;
}

// Constructor: creates a thread pool with the specified number of threads
ThreadPool::ThreadPool(size_t numThreads) : stop(false) {
    workers.resize(numThreads);
    for (size_t i = 0; i < numThreads; ++i) {
        pthread_create(&workers[i], nullptr, workerThread, this);
    }
}

// Main loop for each worker thread: fetches and executes tasks from the queue
void ThreadPool::run() {
    while (true) {
        Task* task;

        {
            std::unique_lock<std::mutex> lock(queue_mutex);

            // Wait until there is a task or the pool is stopping
            cv.wait(lock, [this] {
                return !tasks.empty() || stop;
            });

            // Exit if stopping and no tasks remain
            if (stop && tasks.empty())
                return;

            // Get the next task from the queue
            task = tasks.front();
            tasks.pop();
        }

        // Execute the task outside the lock
        task->execute();
        delete task;
    }
}

// Submit a new task to the pool
void ThreadPool::submit(Task* task) {
    {
        std::lock_guard<std::mutex> lock(queue_mutex);
        tasks.push(task);
    }
    cv.notify_one();
}

// Destructor: stop all threads and clean up
ThreadPool::~ThreadPool() {
    {
        std::lock_guard<std::mutex> lock(queue_mutex);
        stop = true;
    }

    cv.notify_all();

    // Join all threads
    for (pthread_t& t : workers) {
        pthread_join(t, nullptr);
    }
}
