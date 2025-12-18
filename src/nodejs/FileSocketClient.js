import net from 'net';

const TCP_HOST = '127.0.0.1';
const TCP_PORT = 3782;

export class FileSocketClient {
  constructor(timeout = 5000, retries = 2) {
    this.timeout = timeout;          // max wait per command (ms)
    this.retries = retries;          // retry count
    this.client = null;              // persistent TCP socket
    this.isConnected = false;        
    this.queue = [];                 // queued commands
    this.currentResolve = null;      
    this.currentReject = null;       

    this._connect();                 // initialize persistent connection
  }

  // establish or re-establish socket connection
  _connect() {
    if (this.client) this.client.destroy(); // destroy old socket if any

    this.client = new net.Socket();

    this.client.connect(TCP_PORT, TCP_HOST, () => {
      this.isConnected = true;
      console.log('Connected to C++ server');
      this._processQueue(); // start processing any queued commands
    });

    this.client.on('data', chunk => {
      if (this.currentResolve) {
        clearTimeout(this.timeoutId);
        this.currentResolve(chunk.toString().trim());
        this._processQueue(); // continue with next command
      }
    });

    this.client.on('close', () => {
      this.isConnected = false;
      console.log('Socket closed, reconnecting...');
      setTimeout(() => this._connect(), 1000);
    });

    this.client.on('error', err => {
      if (this.currentReject) this.currentReject(err);
      this.isConnected = false;
      this.client.destroy();
    });
  }

  // main method for sending commands
  sendCommand(cmd) {
    return new Promise((resolve, reject) => {
      this.queue.push({ cmd, resolve, reject, retries: this.retries });
      if (!this.currentResolve && this.isConnected) {
        this._processQueue();
      }
    });
  }

  // internal queue processor
  _processQueue() {
    if (this.queue.length === 0) {
      this.currentResolve = null;
      this.currentReject = null;
      return;
    }

    if (!this.isConnected) {
      setTimeout(() => this._processQueue(), 500);
      return;
    }

    const { cmd, resolve, reject, retries } = this.queue.shift();
    this.currentResolve = resolve;
    this.currentReject = reject;

    this.client.write(cmd + '\n');

    this.timeoutId = setTimeout(() => {
      if (retries > 0) {
        console.log(`Timeout, retrying: ${cmd}`);
        this.queue.unshift({ cmd, resolve, reject, retries: retries - 1 });
      } else {
        reject(new Error(`Command timed out: ${cmd}`));
      }
      this._processQueue();
    }, this.timeout);
  }

  // close socket manually
  close() {
    if (this.client) this.client.destroy();
    this.isConnected = false;
  }
}
