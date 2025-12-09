// ConsoleCommunication.cpp
// This class implements the ICommunication interface for console I/O.
// It handles reading input from the user via the console and writing
// output messages to the console.


#include "ICommunication.h"
#include "ConsoleCommunication.h"
#include <iostream>
#include <string>

using namespace std;

// Constructor: initializes the ConsoleCommunication object
ConsoleCommunication::ConsoleCommunication(): ICommunication() {};

// Read a line of input from the console and return it as a string
string ConsoleCommunication::read() {
    string line;
    getline(cin, line);
    return line;
} 

// Write a message to the console
void ConsoleCommunication::write(const string& message) {
    cout << message << endl;
}
