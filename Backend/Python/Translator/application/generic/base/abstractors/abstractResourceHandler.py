from abc import abstractmethod

from rest_framework.parsers import FormParser
from rest_framework.views import APIView
import logging

from application.generic.base.constants.exceptionConstants import ExceptionConstants
from application.generic.base.exception.businessExceptions import *
from application.generic.base.exception.exceptionUtility import ExceptionUtility
from application.generic.base.exception.genericExceptions import *
from application.generic.base.exception.serviceExceptions import *
from application.generic.serializers.responseSerializers.wsErrorResponseSerializer import WSErrorResponseSerializer
from application.translate.views.servicesController.utilities.serviceUtilities import ServiceUtility


class AbstractResourceHandler(APIView):
    logger = logging.getLogger(__name__)

    @abstractmethod
    def get(self, request, format=None):
        pass

    @abstractmethod
    def post(self, request, format=None):
        pass

    def services_exceptions_handler(self, request, outbound_response, service_name, exception):

        if isinstance(exception, BusinessException):
            exception.get_exception_detail().status = ExceptionConstants.SERVICE_STATUS_BUSINESS_EXCEPTION
            self.logger.debug("|~| {} Service |~| Business Exception occurred during the service execution : {}".format(service_name, exception.message))
        elif isinstance(exception, BadRequestException):
            exception.get_exception_detail().status = ExceptionConstants.SERVICE_STATUS_BAD_REQUEST_EXCEPTION
            self.logger.debug("|~| {} |Service ~| Bad Request Exception occurred during the service execution : {}".format(service_name, exception.message))
        elif isinstance(exception, SerializerValidationException):
            exception.get_exception_detail().status = ExceptionConstants.SERVICE_STATUS_BAD_REQUEST_EXCEPTION
            self.logger.debug("|~| {} Service |~| Serializer Validation Exception occurred during the service execution : {}".format(service_name, exception.message))
        elif isinstance(exception, ApplicationException):
            exception.get_exception_detail().status = ExceptionConstants.SERVICE_STATUS_APPLICATION_EXCEPTION
            self.logger.debug("|~| {} Service |~| ApplicationException occurred during the service execution : {}".format(service_name, exception.message))
        else:
            exception = ExceptionUtility.create_exception_detail(ExceptionConstants.CODE_EXCEPTION,
                                                                 ExceptionConstants.USERMESSAGE_EXCEPTION, exception,
                                                                 ApplicationException.__name__)
            exception.get_exception_detail().status = ExceptionConstants.SERVICE_STATUS_EXCEPTION
            self.logger.debug("|~| {} Service |~| Exception occurred during the service execution : {}".format(service_name, exception.message))


        self.logger.debug("An error response object will be sent to the client with error details. ExceptionDetail : {}".format(exception.get_exception_detail()))
        serializer_response = WSErrorResponseSerializer(ServiceUtility.generateErrorResponse(exception.get_exception_detail()))

        return serializer_response
