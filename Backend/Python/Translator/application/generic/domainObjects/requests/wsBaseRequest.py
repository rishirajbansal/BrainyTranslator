

class WSBaseRequest:

    def __init__(self):
        self._request_method = None

    @property
    def request_method(self):
        return self._request_method

    @request_method.setter
    def request_method(self, request_method):
        self._request_method = request_method

    def save_data(self, validated_data):
        self.request_method = validated_data.get('request_method')

