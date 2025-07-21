import { WebSocketServer, WebSocket } from 'ws';
import { URL } from 'url';

interface ClientInfo {
    ws: WebSocket;
    userId: string;
    connectedAt: Date;
}

const wss = new WebSocketServer({ 
    port: 3001,
    host: '0.0.0.0'
});

const clients = new Map<string, ClientInfo>(); // userId -> ClientInfo

console.log('🚀 WebSocket server starting on ws://localhost:3001');

wss.on('connection', (ws: WebSocket, req) => {
    let userId: string | null = null;
    
    try {
        const url = new URL(req.url || '', `http://${req.headers.host}`);
        userId = url.searchParams.get('userId');
        
        if (!userId) {
            console.warn('❌ Connection rejected: No userId provided');
            ws.close(1008, 'userId required');
            return;
        }

        // Store client info
        const clientInfo: ClientInfo = {
            ws,
            userId,
            connectedAt: new Date()
        };
        
        clients.set(userId, clientInfo);
        console.log(`✅ User ${userId} connected to WebSocket (Total: ${clients.size})`);
        
        // Send connection confirmation
        ws.send(JSON.stringify({
            type: 'connect',
            userId: userId,
            timestamp: Date.now(),
            message: 'Connected successfully'
        }));

    } catch (error) {
        console.error('❌ Error during connection setup:', error);
        ws.close(1011, 'Server error');
        return;
    }

    // Handle incoming messages
    ws.on('message', (data: Buffer) => {
        try {
            const message = JSON.parse(data.toString());
            
            switch (message.type) {
                case 'heartbeat':
                    ws.send(JSON.stringify({ 
                        type: 'heartbeat_ack',
                        timestamp: Date.now()
                    }));
                    break;
                    
                case 'ping':
                    ws.send(JSON.stringify({ 
                        type: 'pong',
                        timestamp: Date.now()
                    }));
                    break;
                    
                default:
                    console.log(`📨 Message from ${userId}:`, message);
            }
        } catch (error) {
            console.error('❌ Error parsing message:', error);
            ws.send(JSON.stringify({
                type: 'error',
                message: 'Invalid message format',
                timestamp: Date.now()
            }));
        }
    });

    // Handle connection close
    ws.on('close', (code: number, reason: Buffer) => {
        if (userId) {
            clients.delete(userId);
            console.log(`🔌 User ${userId} disconnected (Code: ${code}, Reason: ${reason.toString()}) (Total: ${clients.size})`);
        }
    });

    // Handle connection errors
    ws.on('error', (error: Error) => {
        console.error(`❌ WebSocket error for user ${userId}:`, error.message);
        if (userId) {
            clients.delete(userId);
        }
    });
});

// Handle server errors
wss.on('error', (error: Error) => {
    console.error('❌ WebSocket Server error:', error);
});

// Function to send notification to specific user
export function sendNotificationToUser(userId: string, notification: any): boolean {
    const client = clients.get(userId);
    if (client && client.ws.readyState === WebSocket.OPEN) {
        try {
            client.ws.send(JSON.stringify({
                type: 'notification',
                ...notification,
                timestamp: Date.now()
            }));
            console.log(`📬 Notification sent to user ${userId}`);
            return true;
        } catch (error) {
            console.error(`❌ Failed to send notification to ${userId}:`, error);
            clients.delete(userId);
            return false;
        }
    }
    console.warn(`⚠️  User ${userId} not connected or connection not ready`);
    return false;
}

// Function to broadcast to all connected users
export function broadcastToAll(message: any): number {
    let sentCount = 0;
    
    clients.forEach((client, userId) => {
        if (client.ws.readyState === WebSocket.OPEN) {
            try {
                client.ws.send(JSON.stringify({
                    ...message,
                    timestamp: Date.now()
                }));
                sentCount++;
            } catch (error) {
                console.error(`❌ Failed to broadcast to ${userId}:`, error);
                clients.delete(userId);
            }
        } else {
            // Clean up disconnected clients
            clients.delete(userId);
        }
    });
    
    console.log(`📢 Broadcast sent to ${sentCount} users`);
    return sentCount;
}

// Function to get connected users
export function getConnectedUsers(): string[] {
    return Array.from(clients.keys());
}

// Function to get connection stats
export function getConnectionStats() {
    return {
        totalConnections: clients.size,
        connectedUsers: Array.from(clients.values()).map(client => ({
            userId: client.userId,
            connectedAt: client.connectedAt,
            status: client.ws.readyState === WebSocket.OPEN ? 'connected' : 'disconnected'
        }))
    };
}

// Heartbeat to keep connections alive and clean up dead connections
setInterval(() => {
    const deadConnections: string[] = [];
    
    clients.forEach((client, userId) => {
        if (client.ws.readyState === WebSocket.OPEN) {
            try {
                client.ws.ping();
            } catch (error) {
                console.warn(`⚠️  Failed to ping ${userId}, marking for removal`);
                deadConnections.push(userId);
            }
        } else {
            deadConnections.push(userId);
        }
    });
    
    // Clean up dead connections
    deadConnections.forEach(userId => {
        clients.delete(userId);
        console.log(`🧹 Cleaned up dead connection for user ${userId}`);
    });
    
    if (deadConnections.length > 0) {
        console.log(`🧹 Cleaned up ${deadConnections.length} dead connections`);
    }
}, 30000); // Check every 30 seconds

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\n🛑 Shutting down WebSocket server...');
    
    // Close all client connections
    clients.forEach((client, userId) => {
        client.ws.close(1001, 'Server shutting down');
        console.log(`👋 Closed connection for user ${userId}`);
    });
    
    // Close the server
    wss.close(() => {
        console.log('✅ WebSocket server closed gracefully');
        process.exit(0);
    });
});

process.on('SIGTERM', () => {
    console.log('\n🛑 Received SIGTERM, shutting down WebSocket server...');
    wss.close(() => {
        console.log('✅ WebSocket server closed gracefully');
        process.exit(0);
    });
});

console.log('✅ WebSocket server is running on ws://localhost:3001');
console.log('📊 Server ready to accept connections...');

export default {
    sendNotificationToUser,
    broadcastToAll,
    getConnectedUsers,
    getConnectionStats
};