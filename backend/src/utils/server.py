import asyncio
import websockets
from vosk import Model, KaldiRecognizer

model = Model(r"C:\Users\Bolatbek\Til-Learn-Kazakh\backend\src\utils\vosk-model-small-kz-0.15")

async def recognize(websocket, path):
    rec = KaldiRecognizer(model, 16000)
    while True:
        data = await websocket.recv()
        if rec.AcceptWaveform(data):
            result = rec.Result()
            await websocket.send(result)
        else:
            partial = rec.PartialResult()
            await websocket.send(partial)

async def main():
    async with websockets.serve(recognize, "0.0.0.0", 2700):
        print("🟢 Vosk WebSocket server started on ws://0.0.0.0:2700")
        await asyncio.Future()  # просто висит, пока не остановишь

asyncio.run(main())
