import socket
import sys

def main():
    if len(sys.argv) != 3:
        print(f"Usage: python {sys.argv[0]} <server_ip> <server_port>")
        return

    SERVER_IP = sys.argv[1]
    SERVER_PORT = int(sys.argv[2])

    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        try:
            s.connect((SERVER_IP, SERVER_PORT))
        except Exception as e:
            print(f"Failed to connect to server: {e}")
            return

        print(f"Connected to server {SERVER_IP}:{SERVER_PORT}")

        while True:
            cmd_line = input("Enter command with arguments (type 'quit' to exit): ")

            if cmd_line.lower() == 'quit':
                break

            try:
                s.sendall(cmd_line.encode('utf-8'))
            except Exception as e:
                print(f"Error sending data: {e}")
                break

            try:
                data = s.recv(4096)
                if not data:
                    print("Server closed the connection")
                    break
                print("Server response:", data.decode('utf-8'))
            except Exception as e:
                print(f"Error receiving data: {e}")
                break

if __name__ == "__main__":
    main()