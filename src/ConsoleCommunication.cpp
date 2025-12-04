#include "ICommunication.h"
#include "ConsoleCommunication.h"
#include <iostream>
#include <string>

using namespace std;

ConsoleCommunication::ConsoleCommunication(): ICommunication() {};

string ConsoleCommunication::read() {
    string line;
    getline(cin, line);
    return line;
} 
void ConsoleCommunication::write(const string& message) {
    cout << message << endl;
}
