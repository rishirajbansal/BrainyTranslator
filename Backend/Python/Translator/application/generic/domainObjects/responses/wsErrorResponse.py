from application.generic.domainObjects.responses.wsBaseResponse import *


class WSErrorResponse(WSBaseResponse):

    def __init__(self):
        super().__init__()
        self._code = None
        self._error_message = None
        self._user_message = None

    @property
    def code(self):
        return self._code

    @code.setter
    def code(self, code):
        self._code = code

    @property
    def error_message(self):
        return self._error_message

    @error_message.setter
    def error_message(self, error_message):
        self._error_message = error_message

    @property
    def user_message(self):
        return self._user_message

    @user_message.setter
    def user_message(self, user_message):
        self._user_message = user_message

    def save_data(self, validated_data):
        super().save_data(validated_data)
        self.code = validated_data.get('code')
        self.error_message = validated_data.get('error_message')
        self.user_message = validated_data.get('user_message')