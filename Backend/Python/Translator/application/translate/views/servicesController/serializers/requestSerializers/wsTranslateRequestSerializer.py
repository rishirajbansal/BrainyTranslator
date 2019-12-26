from application.generic.base.constants.genericConstants import GenericConstants
from application.generic.serializers.requestSerializers.wsBaseRequestSerializer import *
from application.generic.utilities.utility import Utility
from application.translate.views.servicesController.domainObjects.requests.wsTranslateRequest import *
from application.generic.base.constants.businessConstants import *


class WSTranslateRequestSerializer(WSBaseRequestSerializer):
    src_language = serializers.CharField(required=True)
    tgt_language = serializers.CharField(required=True)
    src_text = serializers.CharField(required=False)
    mode = serializers.CharField(required=True, max_length=2)
    file = serializers.FileField(required=False)
    tgt_file_downloadpath = serializers.CharField(required=False)

    def create(self, validated_data):
        ws_translate_request = WSTranslateRequest()
        ws_translate_request.save_data(validated_data)

        return ws_translate_request

    # TODO: work on strings bundle to put all strings in one file

    def validate(self, data):
        # Check if text/file is provided based on the mode value
        if data['mode'] == BusinessConstants.TRANSLATE_TRANSLATION_MODE_TEXT:
            if 'src_text' not in data or data['src_text'] is None or Utility.safe_trim(data['src_text']) == GenericConstants.EMPTY_STRING:
                raise serializers.ValidationError("Source Text Data is missing")
        elif data['mode'] == BusinessConstants.TRANSLATE_TRANSLATION_MODE_FILE:
            if 'file' not in data or data['file'] is None:
                raise serializers.ValidationError("File is missing")
        elif data['mode'] == BusinessConstants.TRANSLATE_TRANSLATION_MODE_DOWNLOAD:
            if 'tgt_file_downloadpath' not in data or data['tgt_file_downloadpath'] is None:
                raise serializers.ValidationError("File Download Path is missing")

        return data
