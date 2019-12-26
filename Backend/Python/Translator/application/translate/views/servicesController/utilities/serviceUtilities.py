from application.generic.base.constants.businessConstants import *
from application.generic.domainObjects.responses.wsErrorResponse import *


class ServiceUtility:

    @staticmethod
    def generateErrorResponse(exDetail):
        errorResponse = WSErrorResponse()

        errorResponse.response = BusinessConstants.RESPONSE_ERROR
        errorResponse.status = exDetail.status
        errorResponse.code = exDetail.code
        errorResponse.error_message = exDetail.error_message
        errorResponse.user_message = exDetail.user_message

        return errorResponse
