#include <map>
#include <string>
#include <iostream>
#include "EnvironmentManager.h"

bool EnvironmentManager::createEnvironment(const std::string& key, const std::string& value){
    if(key.empty() || value.empty()){
        return false;
    }
    setInMap(key, value);
    return true;
}

void EnvironmentManager::setInMap(const std::string& key, const std::string& value){
    envMap[key] = value;
}

bool EnvironmentManager::existEnvironment(const std::string& key) const{
    return envMap.find(key) != envMap.end();
}

std::string EnvironmentManager::checkPath(const std::string& key){
    if(existEnvironment(key)){
        return envMap[key];    
    }
    return "";
}