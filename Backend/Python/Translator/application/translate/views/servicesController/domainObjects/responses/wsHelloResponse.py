from application.generic.domainObjects.responses.wsBaseResponse import *


class WSHelloResponse(WSBaseResponse):

    def __init__(self):
        super().__init__()
        self._value = None

    @property
    def value(self):
        return self._value

    @value.setter
    def value(self, value):
        self._value = value

    def save_data(self, validated_data):
        super().save_data(validated_data)
        self.value = validated_data.get('value')
