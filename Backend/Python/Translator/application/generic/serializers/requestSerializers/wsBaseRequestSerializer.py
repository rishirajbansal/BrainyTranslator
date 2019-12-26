from rest_framework import serializers
from application.generic.domainObjects.requests.wsBaseRequest import *


class WSBaseRequestSerializer(serializers.Serializer):
    request_method = serializers.CharField(required=True)

    def create(self, validated_data):
        # ws_baseRequest = WSBaseRequest()
        self.request_method = validated_data.get('request_method')

        return self
