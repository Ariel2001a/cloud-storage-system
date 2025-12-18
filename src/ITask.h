#ifndef TASK_H
#define TASK_H

class Task {
public:
    virtual ~Task() = default;
    virtual void execute() = 0;
};

#endif