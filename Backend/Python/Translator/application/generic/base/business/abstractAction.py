from abc import abstractmethod

from application.generic.base.constants.businessConstants import BusinessConstants


class AbstractAction:

    @abstractmethod
    def execute(self, request, requestMethod):
        pass

    def generateSuccessResponse(self, responseObj, message=None):
        responseObj.response = BusinessConstants.RESPONSE_SUCCESS
        responseObj.success_message = message

    def generateFalseResponse(self, responseObj, message=None):
        responseObj.response = BusinessConstants.RESPONSE_FALSE
        responseObj.error_message = message
