# consumer.py
# Grant Wells
# Setting up WebSocket communication.

import json
from channels.generic.websocket import AsyncWebsocketConsumer


class CyberAttackConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        # Join attack update
        await self.channel_layer.group_add("attack_updates", self.channel_name)

    async def disconnect(self, close_code):
        # Leave the attack updates group
        await self.channel_layer.group_discard("attack_updates", self.channel_name)

    async def cyber_attack_message(self, event):
        """Send the attack data to the WebSocket."""

        message = event["message"]

        # Send the attack data to the websocket.
        await self.send(text_data=json.dumps(message))
