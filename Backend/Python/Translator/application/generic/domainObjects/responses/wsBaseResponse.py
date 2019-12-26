

class WSBaseResponse:

    def __init__(self):
        self._status = None
        self._response = None
        self._success_message = None
        self._error_message = None

    @property
    def status(self):
        return self._status

    @status.setter
    def status(self, status):
        self._status = status

    @property
    def response(self):
        return self._response

    @response.setter
    def response(self, response):
        self._response = response

    @property
    def success_message(self):
        return self._success_message

    @success_message.setter
    def success_message(self, success_message):
        self._success_message = success_message

    @property
    def error_message(self):
        return self._error_message

    @error_message.setter
    def error_message(self, error_message):
        self._error_message = error_message

    def save_data(self, validated_data):
        self.status = validated_data.get('status')
        self.response = validated_data.get('response')
        self.success_message = validated_data.get('success_message')
        self.error_message = validated_data.get('error_message')