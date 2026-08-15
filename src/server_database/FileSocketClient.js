const net = require('net');

const TCP_HOST = 'server';
const TCP_PORT = 3782;

class FileSocketClient {
  constructor(timeout = 5000, retries = 2) {
    this.timeout = timeout;
    this.retries = retries;
    this.client = null;
    this.isConnected = false;
    this.queue = [];
    this.currentResolve = null;
    this.currentReject = null;
    this.timeoutId = null; // Store timeout reference

    this._connect();
  }

  _connect() {
    if (this.client) this.client.destroy();

    this.client = new net.Socket();

    this.client.connect(TCP_PORT, TCP_HOST, () => {
      this.isConnected = true;
      
      this._processQueue();
    });

    this.client.on('data', chunk => {
      if (this.currentResolve) {
        clearTimeout(this.timeoutId); // Clear timeout when data arrives
        const resolve = this.currentResolve;
        this.currentResolve = null; // Reset before resolving
        resolve(chunk.toString().trim());
        this._processQueue();
      }
    });

    this.client.on('close', () => {
      this.isConnected = false;
      
      setTimeout(() => this._connect(), 1000);
    });

    this.client.on('error', err => {
      console.error('Socket Error:', err.message);
      if (this.currentReject) {
        this.currentReject(err);
        this.currentReject = null;
      }
      this.isConnected = false;
      this.client.destroy();
    });
  }

  sendCommand(cmd) {
    return new Promise((resolve, reject) => {
      this.queue.push({ cmd, resolve, reject, retries: this.retries });
      if (!this.currentResolve && this.isConnected) {
        this._processQueue();
      }
    });
  }

  _processQueue() {
    if (this.queue.length === 0 || this.currentResolve) return;

    if (!this.isConnected) {
      setTimeout(() => this._processQueue(), 500);
      return;
    }

    const { cmd, resolve, reject, retries } = this.queue.shift();
    this.currentResolve = resolve;
    this.currentReject = reject;

    this.client.write(cmd + '\n');

    this.timeoutId = setTimeout(() => {
      const rejectFn = this.currentReject;
      this.currentResolve = null;
      this.currentReject = null;

      if (retries > 0) {
        this.queue.unshift({ cmd, resolve, reject: rejectFn, retries: retries - 1 });
      } else {
        if (rejectFn) rejectFn(new Error(`Command timed out: ${cmd}`));
      }
      this._processQueue();
    }, this.timeout);
  }

  close() {
    if (this.client) this.client.destroy();
    this.isConnected = false;
  }
}

// --- KEY ADDITION HERE ---
// Create one instance to be used across the whole app
const fileSocket = new FileSocketClient();

// Export both the class (if needed) and the active instance
module.exports = { FileSocketClient, fileSocket };