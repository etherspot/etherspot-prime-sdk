/**
 * @ignore
 */
let WebSocketConstructor: any = null;

try {
  (async () => {
    if (typeof WebSocket !== 'undefined') {
      WebSocketConstructor = WebSocket;
    } else {
      const ws = await import('ws');
      WebSocketConstructor = ws.WebSocket || ws.default;
    }
  })();
} catch (err) {
  throw new Error('WebSocket not found. Please install `ws` for node.js');
}

// browsers don't have the `global` and WebSocket is available in window.WebSocket
if (global) {
  (global as any).WebSocket = WebSocketConstructor;
}
