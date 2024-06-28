"use client"
import { useState, useEffect } from 'react';

type MessageType = 'keyPress' | 'mouseClick';

interface Message {
  type: MessageType;
  key: string;
}

const Home: React.FC = () => {
  const [message, setMessage] = useState<string>('');
  const [ws, setWs] = useState<WebSocket | null>(null);

  useEffect(() => {
    const websocket = new WebSocket('ws://localhost:8080');
    setWs(websocket);

    websocket.onopen = () => {
      console.log('WebSocket connection established');
    };

    websocket.onmessage = (event) => {
      console.log(`Message from server: ${event.data}`);
    };

    return () => {
      websocket.close();
    };
  }, []);

  const sendMessage = (type: MessageType, keyOrButton: string) => {
    if (ws) {
      const message: Message = { type, key: keyOrButton };
      ws.send(JSON.stringify(message));
      setMessage('');
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      sendMessage('keyPress', 'enter');
    }, 1000); // 10秒ごとに送信

    return () => clearInterval(interval); // コンポーネントのアンマウント時にクリア
  }, [ws]); // wsが変更されるたびにこのエフェクトを再実行

  return (
    <div>
      <h1>WebSocket Client</h1>
      <button onClick={() => sendMessage('keyPress', 'enter')}>Send Enter Key Press</button>
      <button onClick={() => sendMessage('mouseClick', 'left')}>Send Mouse Click</button>
    </div>
  );
}

export default Home;
