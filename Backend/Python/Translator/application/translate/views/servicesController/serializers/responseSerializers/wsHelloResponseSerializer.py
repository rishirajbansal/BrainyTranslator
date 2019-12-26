from application.generic.serializers.responseSerializers.wsBaseResponseSerializer import *
from application.translate.views.servicesController.domainObjects.responses.wsHelloResponse import *


class WSHelloResponseSerializer(WSBaseResponseSerializer):
    value = serializers.CharField(required=True)

    def create(self, validated_data):
        ws_helloResponse = WSHelloResponse()
        ws_helloResponse.save_data(validated_data)

        return ws_helloResponse
