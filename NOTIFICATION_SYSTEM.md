# Socket.io Notification System

## Overview
This notification system uses Socket.io to send real-time notifications to all connected users when an event is created. The system consists of:

1. **Backend (Node.js + Socket.io)**: Emits notifications when events are created
2. **Frontend (React + Socket.io-client)**: Receives and displays notifications

## How it Works

### Backend Implementation
- Socket.io server is set up in `src/index.ts`
- When an event is created via `createEvent` controller, a notification is emitted to all connected clients
- The notification includes event details like name, description, dates, etc.

### Frontend Implementation
- `NotificationContext` manages socket connection and notification state
- `NotificationBell` component displays notifications in the header
- Toast notifications are shown using the existing Sonner toast system
- Notifications are stored in context and displayed in a dropdown

## Features
- ✅ Real-time notifications when events are created
- ✅ Toast notifications for immediate feedback
- ✅ Notification bell with unread count
- ✅ Connection status indicator
- ✅ Notification history
- ✅ Auto-reconnection on connection loss

## Usage

### For Developers
1. The system automatically connects when the app loads
2. Notifications are received and displayed automatically
3. No additional setup required for basic functionality

### For Users
1. Click the notification bell in the header to see notifications
2. Toast notifications appear automatically when events are created
3. Red badge shows unread notification count
4. Yellow dot indicates connection status

## Configuration
- Backend URL is configured via `VITE_BACKEND_URL` environment variable
- Default fallback is `http://localhost:1000`
- Socket connection is established automatically on app load

## Testing
To test the notification system:
1. Start both backend and frontend servers
2. Open multiple browser tabs/windows
3. Create an event in one tab
4. All other tabs should receive the notification immediately
