from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from cure.ws_manager import WSManager

router = APIRouter()
manager = WSManager()

@router.websocket("/ws/{userId}")
async def websocket_endpoint(websocket: WebSocket, userId: str):
    await manager.connect(userId, websocket)
    try:
        while True:
            await websocket.receive_text()  # keep alive
    except WebSocketDisconnect:
        manager.disconnect(userId)

