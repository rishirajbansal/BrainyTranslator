from application.generic.base.business.abstractAction import *
from application.generic.base.business.requestMethods import *
from application.generic.base.constants.exceptionConstants import *
from application.generic.base.exception.exceptionUtility import *
from application.translate.views.servicesController.domainObjects.responses.wsHelloResponse import *


class HelloAction(AbstractAction):
    logger = logging.getLogger(__name__)

    def __init__(self):
        pass

    def execute(self, request, request_method):

        outbound_response = WSHelloResponse()

        try:
            if request_method == RequestMethods.TRANSLATE_HELLO_HELLO.value:
                self.hello(request, outbound_response, request_method)
            else:
                raise (BusinessException("Unsupported request type."))

        except DataAccessException as daEx:
            self.logger.error("DataAccessException occurred for Translate Action request : {}".format(daEx.message))
            raise ExceptionUtility.create_exception_detail(ExceptionConstants.CODE_DATA_ACCESS_EXCEPTION,
                                                           ExceptionConstants.USERMESSAGE_DATA_ACCESS_EXCEPTION,
                                                           daEx.message,
                                                           DataAccessException.__name__)
        except BusinessException as bEx:
            self.logger.error("BusinessException occurred for Translate Action request : {}".format(bEx.message))
            raise ExceptionUtility.create_exception_detail(ExceptionConstants.CODE_BUSINESS_EXCEPTION,
                                                           ExceptionConstants.USERMESSAGE_BUSINESS_EXCEPTION,
                                                           bEx.message,
                                                           BusinessException.__name__)
        except Exception as ex:
            self.logger.error("Exception occurred for Hello Action request : {}".format(ex))
            raise ExceptionUtility.create_exception_detail(ExceptionConstants.CODE_BUSINESS_EXCEPTION,
                                                           ExceptionConstants.USERMESSAGE_SERIALIZER_VALIDATION_EXCEPTION,
                                                           str(ex),
                                                           ApplicationException.__name__)

        return outbound_response

    def hello(self, request, outbound_response, request_method):
        self.logger.debug("Value : {}".format(request.value))

        outbound_response.value = "Hello World !"

        self.generateSuccessResponse(outbound_response)

        return
