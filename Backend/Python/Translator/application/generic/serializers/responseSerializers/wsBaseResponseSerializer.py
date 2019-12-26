from rest_framework import serializers
from collections import OrderedDict
from application.generic.domainObjects.responses.wsBaseResponse import *


class WSBaseResponseSerializer(serializers.Serializer):
    status = serializers.CharField(required=True)
    response = serializers.CharField(required=True)
    success_message = serializers.CharField(required=False)
    error_message = serializers.CharField(required=False)

    def create(self, validated_data):
        ws_baseResponse = WSBaseResponse()
        ws_baseResponse.status = validated_data.get('status')
        ws_baseResponse.response = validated_data.get('response')
        ws_baseResponse.success_message = validated_data.get('success_message')
        ws_baseResponse.error_message = validated_data.get('error_message')

        return ws_baseResponse

    # this function is overridden from Django rest framework to avoid sending Null fields in response
    def to_representation(self, instance):
        result = super().to_representation(instance)
        return OrderedDict([(key, result[key]) for key in result if result[key] is not None])