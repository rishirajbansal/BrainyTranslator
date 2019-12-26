from application.generic.serializers.requestSerializers.wsBaseRequestSerializer import *
from application.translate.views.servicesController.domainObjects.requests.wsHelloRequest import *


class WSHelloRequestSerializer(WSBaseRequestSerializer):
    value = serializers.CharField(required=True)

    def create(self, validated_data):
        ws_helloRequest = WSHelloRequest()
        ws_helloRequest.save_data(validated_data)

        return ws_helloRequest
