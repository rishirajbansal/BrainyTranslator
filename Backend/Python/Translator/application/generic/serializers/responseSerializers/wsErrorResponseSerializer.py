from application.generic.serializers.responseSerializers.wsBaseResponseSerializer import *
from application.generic.domainObjects.responses.wsErrorResponse import *


class WSErrorResponseSerializer(WSBaseResponseSerializer):
    code = serializers.CharField(required=True)
    user_message = serializers.CharField(required=True)
    error_message = serializers.CharField(required=False)

    def create(self, validated_data):
        super().create(validated_data)
        ws_errorResponse = WSErrorResponse()
        ws_errorResponse.code = validated_data.get('code')
        ws_errorResponse.user_message = validated_data.get('user_message')
        ws_errorResponse.error_message = validated_data.get('error_message')

        return ws_errorResponse

