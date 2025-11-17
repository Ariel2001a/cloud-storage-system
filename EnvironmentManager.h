#ifndef ENVIRONMENTMANAGER_H
#define ENVIRONMENTMANAGER_H

#include <map>
#include <string>



class EnvironmentManager
{
public:
    bool createEnvironment(const std::string& key, const std::string& value);
    bool existEnvironment(const std::string& key) const;
    void setInMap(const std::string& key, const std::string& value);
    std::string checkPath(const std::string& key);

private:
    std::map<std::string, std::string> envMap;
};
#endif
