#include <iostream>
#include <sys/socket.h>
#include <stdio.h>
#include <netinet/in.h>
#include <arpa/inet.h>
#include <unistd.h>
#include <string.h>
#include <cstdlib>


using namespace std;

int main(int argc, char* argv[]) {

    // make sure we got IP and port
    if (argc != 3) {
        cout << "500 Internal Server Error" << endl;
        return 1;
    }

    // read server details from args
    std::string server_ip = argv[1];
    int port = std::atoi(argv[2]);

    // create a TCP socket
    int sock = socket(AF_INET, SOCK_STREAM, 0);
    if (sock < 0) {
        cout << "500 Internal Server Error" << endl;
    }

    // fill server address info
    struct sockaddr_in sin;
    memset(&sin, 0, sizeof(sin));
    sin.sin_family = AF_INET;
    sin.sin_addr.s_addr = inet_addr(server_ip.c_str());
    sin.sin_port = htons(port);

    // try to connect to the server
    if (connect(sock, (struct sockaddr *) &sin, sizeof(sin)) < 0) {
        cout << "500 Internal Server Error" << endl;
    }

    // main loop: read user input, send to server, get response
    while (true) {

        // get a full line from the user
        string line;
        getline(cin, line);

        // send it to the server
        int sent_bytes = send(sock, line.c_str(), line.size(), 0);
        if (sent_bytes < 0) {
            cout << "500 Internal Server Error" << endl;
            break;
        }

        // buffer for server reply
        char buffer[4096];
        int expected_data_len = sizeof(buffer);

        // wait for server response
        int read_bytes = recv(sock, buffer, expected_data_len, 0);

        // server closed connection
        if (read_bytes == 0) {
            break;
        }
        // error reading
        else if (read_bytes < 0) {
            cout << "500 Internal Server Error" << endl;
            break;
        }
        // got data, print it
        else {
            cout << string(buffer, read_bytes) << endl;
        }
    }

    // close the socket
    close(sock);

    return 0;
}
