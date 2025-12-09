# Use the official Python 3 image as the base
ROM python:3

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy the Python client script into the container
COPY TCP_Client.py .

# Set the command to run when the container starts
ENTRYPOINT ["python3", "TCP_Client.py"]