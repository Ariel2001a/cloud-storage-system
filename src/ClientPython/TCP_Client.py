"""
This is a simple TCP client written in Python.

It connects to a TCP server using the IP address and port provided
as command-line arguments. After connecting, it allows the user 
to send commands to the server and print the responses.

Key steps:
1. Parse command-line arguments (server IP and port).
2. Create a TCP socket.
3. Connect to the server.
4. Continuously read input from the user, send it to the server,
   and print the server's response.
5. Handle exceptions and close the connection properly.
"""

import socket
import sys

def main():

     # Ensure the user provides exactly 2 arguments: server IP and port
    if len(sys.argv) != 3:
        print(f"Usage: python {sys.argv[0]} <server_ip> <server_port>")
        return

    SERVER_IP = sys.argv[1]
    SERVER_PORT = int(sys.argv[2])

    # Create a TCP socket using a context manager for automatic cleanup
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:

        # Attempt to connect to the server
        try:
            s.connect((SERVER_IP, SERVER_PORT))
        except Exception as e:
            print(f"Failed to connect to server: {e}")
            return

        # Main loop: read input, send to server, receive response
        while True:

            # Read a command from the user
            cmd_line = input()

             # Optionally allow the user to quit
            if cmd_line.lower() == 'quit':
                break

            # Send command to the server
            try:
                s.sendall(cmd_line.encode('utf-8'))
            except Exception as e:
                print(f"Error sending data: {e}")
                break

            # Receive response from the server
            try:
                data = s.recv(4096)
                if not data:
                    break
                print(data.decode('utf-8'))
            except Exception as e:
                print(f"Error receiving data: {e}")
                break

# Entry point for the script
if __name__ == "__main__":
    main()