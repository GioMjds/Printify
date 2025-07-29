import { WebSocketServer, WebSocket } from 'ws';
import { v4 as uuidv4 } from 'uuid';
import type { Server as HttpServer } from 'http';

interface Client {
    ws: WebSocket;
    userId: string;
    channels: Set<string>;
}

type WebSocketMessage =
    | { type: 'joinChannel'; channel: string }
    | { type: 'leaveChannel'; channel: string }
    | { type: 'heartbeat' }
    | { type: 'notification'; userId: string; message: string; orderId?: string }
    | { type: string; [key: string]: unknown }; // fallback for unknown types

const clients = new Map<string, Client>();
const channels = new Map<string, Set<string>>();

export function createWebSocketServer(server: HttpServer) {
    const wss = new WebSocketServer({ server });

    wss.on('connection', (ws, req) => {
        const userId = new URL(req.url || '', 'http://localhost').searchParams.get('userId') || '';
        const clientId = uuidv4();

        const client: Client = {
            ws,
            userId,
            channels: new Set()
        };

        clients.set(clientId, client);

        ws.on('message', (message: string) => {
            try {
                const data: WebSocketMessage = JSON.parse(message);
                handleMessage(clientId, data);
            } catch (error) {
                console.error('Error parsing message:', error);
            }
        });

        ws.on('close', () => {
            // Leave all channels when client disconnects
            client.channels.forEach((channel: string) => {
                leaveChannel(clientId, channel);
            });
            clients.delete(clientId);
        });

        // Send initial connection confirmation
        ws.send(JSON.stringify({
            type: 'connect',
            userId
        }));
    });

    function handleMessage(clientId: string, data: WebSocketMessage) {
        const client = clients.get(clientId);
        if (!client) return;

        switch (data.type) {
            case 'joinChannel':
                joinChannel(clientId, data.channel as string);
                break;
            case 'leaveChannel':
                leaveChannel(clientId, data.channel as string);
                break;
            case 'heartbeat':
                break;
            case 'notification':
                sendNotification(
                    data.userId as string, 
                    data.message as string, 
                    data.orderId as string | undefined
                );
                break;
            default:
                console.log('Unknown message type:', data.type);
        }
    }

    function joinChannel(clientId: string, channelName: string) {
        const client = clients.get(clientId);
        if (!client) return;

        client.channels.add(channelName);

        if (!channels.has(channelName)) {
            channels.set(channelName, new Set());
        }
        channels.get(channelName)?.add(clientId);

        client.ws.send(JSON.stringify({
            type: 'channelJoin',
            channel: channelName,
            success: true
        }));
    }

    function leaveChannel(clientId: string, channelName: string) {
        const client = clients.get(clientId);
        if (!client) return;

        client.channels.delete(channelName);
        channels.get(channelName)?.delete(clientId);

        client.ws.send(JSON.stringify({
            type: 'channelLeave',
            channel: channelName,
            success: true
        }));
    }

    function sendNotification(userId: string, message: string, orderId?: string) {
        const notification = {
            id: uuidv4(),
            userId,
            message,
            orderId,
            createdAt: new Date().toISOString()
        };

        // Send to all clients for this user
        clients.forEach(client => {
            if (client.userId === userId) {
                client.ws.send(JSON.stringify({
                    type: 'notification',
                    ...notification
                }));
            }
        });
    }
}