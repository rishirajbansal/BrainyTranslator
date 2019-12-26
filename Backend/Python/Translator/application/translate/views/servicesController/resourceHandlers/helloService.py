from rest_framework.response import Response
from rest_framework.views import APIView

from application.generic.base.abstractors.abstractResourceHandler import AbstractResourceHandler
from application.generic.base.business.actionFactory import *
from application.generic.base.business.requestMethods import *
from application.generic.base.business.resourceHandlersDirectory import ResourceHandlerDirectory
from application.generic.base.constants.genericConstants import *
from application.generic.serializers.responseSerializers.wsErrorResponseSerializer import *
from application.generic.utilities.utility import *
from application.translate.views.servicesController.serializers.requestSerializers.wsHelloRequestSerializer import *
from application.translate.views.servicesController.serializers.responseSerializers.wsHelloResponseSerializer import *
from application.translate.views.servicesController.utilities.serviceUtilities import *


class HelloService(AbstractResourceHandler):
    logger = logging.getLogger(__name__)

    def get(self, request, format=None):

        self.logger.debug("Hello Web Service is Called.")

        serializer_response = None
        outbound_response = None

        try:

            if request.data is not None and len(request.data) > 0:

                dataReceive = request.data

                self.logger.debug("Data received: {}".format(dataReceive))

                serializer_request = WSHelloRequestSerializer(data=dataReceive)

                if serializer_request.is_valid():
                    request_object = serializer_request.save()
                    request_method = request_object.request_method

                    if Utility.safe_trim(request_method) != GenericConstants.EMPTY_STRING:

                        # Check if request method value is valid
                        if request_method not in RequestMethods.__members__:
                            self.logger.error("Request Method in request is invalid : {}".format(request_method))
                            raise ExceptionUtility.create_exception_detail(
                                ExceptionConstants.CODE_BAD_REQUEST_EXCEPTION,
                                ExceptionConstants.USERMESSAGE_BAD_REQUEST_3,
                                "Request Method in request is invalid : {}".format(request_method),
                                BadRequestException.__name__)

                        # Call Business action to process the request
                        self.logger.debug("Request Method : {}".format(request_method))
                        action = ActionFactory.getActionInstance(ActionDirectory.ACTION_TRANSLATE_HELLO)
                        outbound_response = action.execute(request_object, RequestMethods[request_method].value)

                        if outbound_response is not None:
                            outbound_response.status = ExceptionConstants.SERVICE_STATUS_SUCCESS
                            serializer_response = WSHelloResponseSerializer(outbound_response)
                        else:
                            self.logger.error("Response object returned by Action found null")
                            raise ApplicationException("Response returned by Business layer found null.")

                    else:
                        self.logger.debug("Request Method name found empty in request")
                        raise ExceptionUtility.create_exception_detail(ExceptionConstants.CODE_BAD_REQUEST_EXCEPTION,
                                                                       ExceptionConstants.USERMESSAGE_BAD_REQUEST_2,
                                                                       ExceptionConstants.ERRORMESSAGE_BAD_REQUEST_2,
                                                                       BadRequestException.__name__)
                else:
                    serialization_errors = serializer_request.errors
                    self.logger.error("Serializer validation failed : {}".format(serialization_errors))
                    raise ExceptionUtility.create_exception_detail(
                        ExceptionConstants.CODE_SERIALIZER_VALIDATION_EXCEPTION,
                        ExceptionConstants.USERMESSAGE_SERIALIZER_VALIDATION_EXCEPTION,
                        serialization_errors,
                        SerializerValidationException.__name__)

            else:
                self.logger.error("Data found empty in request")
                raise ExceptionUtility.create_exception_detail(ExceptionConstants.CODE_BAD_REQUEST_EXCEPTION,
                                                               ExceptionConstants.USERMESSAGE_BAD_REQUEST_1,
                                                               ExceptionConstants.ERRORMESSAGE_BAD_REQUEST_1,
                                                               BadRequestException.__name__)
        except Exception as ex:
            serializer_response = self.services_exceptions_handler(request, outbound_response, ResourceHandlerDirectory.RESOURCE_HANDLER_HELLO, ex)

        return Response(serializer_response.data)

    def post(self, request, format=None):
        return self.get(request, format=None)
