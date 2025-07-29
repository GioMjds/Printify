type WebSocketEventData = Record<string, unknown>;

// Define a generic event handler type
type WebSocketEventHandler<T = WebSocketEventData> = (data: T) => void;

export class WebSocketService {
    private socket: WebSocket | null = null;
    private retries = 0;
    private maxRetries = 5;
    private retryDelay = 3000;
    private heartbeatInterval = 25000;
    private heartbeatTimer?: NodeJS.Timeout;
    private currentUserId: string = "";
    private connecting: boolean = false;
    private reconnectTimer?: NodeJS.Timeout;
    private lastConnectTime: number = 0;
    private channels: Set<string> = new Set();
    private callbacks: Map<string, WebSocketEventHandler> = new Map();

    constructor(private url: string) {}

    connect(userId?: string): void {
        if (this.connecting || this.socket?.readyState === WebSocket.OPEN) return;

        this.connecting = true;
        this.currentUserId = userId || "";
        
        try {
            this.socket = new WebSocket(`${this.url}?userId=${userId}`);
            
            this.socket.onopen = () => {
                this.connecting = false;
                this.retries = 0;
                this.lastConnectTime = Date.now();
                this.startHeartbeat();
                this.triggerEvent('connect', { userId });
            };

            this.socket.onmessage = (event) => {
                try {
                    const data: WebSocketEventData = JSON.parse(event.data);
                    if (typeof data.type === "string") {
                        this.triggerEvent(data.type, data);
                    }
                } catch (error) {
                    console.error('Error parsing WebSocket message:', error);
                }
            };

            this.socket.onclose = (event) => {
                this.connecting = false;
                this.stopHeartbeat();
                this.triggerEvent('disconnect', { reason: event.reason });
                
                if (this.retries < this.maxRetries) {
                    this.reconnectTimer = setTimeout(() => {
                        this.retries++;
                        this.connect(this.currentUserId);
                    }, this.retryDelay);
                }
            };

            this.socket.onerror = (error) => {
                this.connecting = false;
                console.error('WebSocket error:', error);
            };

        } catch (error) {
            this.connecting = false;
            console.error('WebSocket connection error:', error);
        }
    }

    disconnect(): void {
        if (this.reconnectTimer) clearTimeout(this.reconnectTimer);
        this.stopHeartbeat();
        if (this.socket) {
            this.socket.close();
            this.socket = null;
        }
        this.channels.clear();
    }

    send(data: object): boolean {
        if (!this.socket || this.socket.readyState !== WebSocket.OPEN) return false;
        
        try {
            this.socket.send(JSON.stringify(data));
            return true;
        } catch (error) {
            console.error('Error sending WebSocket message:', error);
            return false;
        }
    }

    on<T extends WebSocketEventData = WebSocketEventData>(eventType: string, handler: WebSocketEventHandler<T>): void {
        this.callbacks.set(eventType, handler as WebSocketEventHandler);
    }

    off(eventType: string): void {
        this.callbacks.delete(eventType);
    }

    async joinChannel(channelName: string): Promise<boolean> {
        if (!this.socket || this.socket.readyState !== WebSocket.OPEN) return false;
        
        const success = this.send({
            type: 'joinChannel',
            channel: channelName
        });
        
        if (success) {
            this.channels.add(channelName);
        }
        
        return success;
    }

    async leaveChannel(channelName: string): Promise<boolean> {
        if (!this.socket || this.socket.readyState !== WebSocket.OPEN) return false;
        
        const success = this.send({
            type: 'leaveChannel',
            channel: channelName
        });
        
        if (success) {
            this.channels.delete(channelName);
        }
        
        return success;
    }

    getConnectedChannels(): string[] {
        return Array.from(this.channels);
    }

    get isConnected(): boolean {
        return this.socket?.readyState === WebSocket.OPEN;
    }

    getCurrentUserId(): string {
        return this.currentUserId;
    }

    private startHeartbeat(): void {
        this.stopHeartbeat();
        this.heartbeatTimer = setInterval(() => {
            if (this.isConnected) {
                this.send({ type: 'heartbeat' });
            }
        }, this.heartbeatInterval);
    }

    private stopHeartbeat(): void {
        if (this.heartbeatTimer) {
            clearInterval(this.heartbeatTimer);
            this.heartbeatTimer = undefined;
        }
    }

    private triggerEvent(type: string, data: WebSocketEventData): void {
        const handler = this.callbacks.get(type);
        if (handler) {
            handler(data);
        }
    }
}