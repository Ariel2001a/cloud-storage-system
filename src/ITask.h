#ifndef TASK_H
#define TASK_H

// Abstract base class for tasks submitted to the ThreadPool
class Task {
public:
    // Virtual destructor for proper cleanup
    virtual ~Task() = default;

    // Pure virtual function: define task behavior
    virtual void execute() = 0;
};

#endif