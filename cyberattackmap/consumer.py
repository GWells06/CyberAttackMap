# consumer.py
# Grant Wells
# Setting up WebSocket communication.

import json
from channels.generic.websocket import AsyncWebsocketConsumer
from .generate_attacks import attack_simulator


class CyberAttackConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        # Join attack update
        await self.channel_layer.group_add("attack_updates", self.channel_name)

        await self.accept()

        # Start the attack simulator if it hasn't started.
        if not attack_simulator.running:
            attack_simulator.start()

    async def disconnect(self, close_code):
        # Leave the attack updates group
        await self.channel_layer.group_discard("attack_updates", self.channel_name)

    # Get message from WebSocket.
    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        attack_message = text_data_json.get("attack_message", {})

        # Send to group.
        await self.channel_layer.group_send(
            "attack_updates",
            {"attack_type": "attack_message", "attack_message": attack_message},
        )

    # Get/Recieve the message.
    async def specify_attack_message(self, event):
        attack_message = event["attack_message"]

        # Send attack_message to WebSocket.
        await self.send(text_data=json.dumps({"attack_message": attack_message}))
