
import { io, Socket } from 'socket.io-client';

class SocketService {
  private socket: Socket | null = null;
  private callbacks: { [key: string]: Function[] } = {};

  connect(token: string) {
    this.socket = io('http://localhost:3001', {
      auth: {
        token,
      },
    });

    this.socket.on('connect', () => {
      console.log('Connected to server');
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from server');
    });

    // Listen for thread updates
    this.socket.on('thread_updated', (data) => {
      this.emit('thread_updated', data);
    });

    // Listen for new collaborators
    this.socket.on('collaborator_joined', (data) => {
      this.emit('collaborator_joined', data);
    });

    // Listen for collaborator left
    this.socket.on('collaborator_left', (data) => {
      this.emit('collaborator_left', data);
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  // Join a thread room for collaboration
  joinThread(threadId: string) {
    if (this.socket) {
      this.socket.emit('join_thread', threadId);
    }
  }

  // Leave a thread room
  leaveThread(threadId: string) {
    if (this.socket) {
      this.socket.emit('leave_thread', threadId);
    }
  }

  // Send thread updates
  updateThread(threadId: string, content: string) {
    if (this.socket) {
      this.socket.emit('update_thread', { threadId, content });
    }
  }

  // Event subscription
  on(event: string, callback: Function) {
    if (!this.callbacks[event]) {
      this.callbacks[event] = [];
    }
    this.callbacks[event].push(callback);
  }

  // Event emission
  private emit(event: string, data: any) {
    if (this.callbacks[event]) {
      this.callbacks[event].forEach(callback => callback(data));
    }
  }

  // Remove event listener
  off(event: string, callback: Function) {
    if (this.callbacks[event]) {
      this.callbacks[event] = this.callbacks[event].filter(cb => cb !== callback);
    }
  }
}

export const socketService = new SocketService();
