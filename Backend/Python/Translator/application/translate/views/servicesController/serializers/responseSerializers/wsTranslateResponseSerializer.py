from application.generic.serializers.responseSerializers.wsBaseResponseSerializer import *
from application.translate.views.servicesController.domainObjects.responses.wsTranslateResponse import *


class WSTranslateResponseSerializer(WSBaseResponseSerializer):
    tgt_text = serializers.CharField(required=False)
    total_bytes = serializers.IntegerField(required=False)
    amount = serializers.FloatField(required=False)
    process_time = serializers.FloatField(required=False)
    tgt_file = serializers.CharField(required=False)

    def create(self, validated_data):
        ws_translate_response = WSTranslateResponse()
        ws_translate_response.save_data(validated_data)

        return ws_translate_response


