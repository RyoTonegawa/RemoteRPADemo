import asyncio
import websockets
import json
import pyautogui

async def handle_message(websocket, path):
    async for message in websocket:
        print(f"Received message: {message}")
        data = json.loads(message)

        if data['type'] == 'keyPress':
            pyautogui.press(data['key'])
        elif data['type'] == 'mouseClick':
            pyautogui.click(button=data['button'])

async def main():
    async with websockets.serve(handle_message, "localhost", 8080):
        print("WebSocket server is running on ws://localhost:8080")
        await asyncio.Future()  # run forever

if __name__ == "__main__":
    asyncio.run(main())
