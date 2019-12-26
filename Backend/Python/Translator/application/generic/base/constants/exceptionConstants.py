from rest_framework import status


class ExceptionConstants:
    """
    Controller Exceptions
    """
    SERVICE_STATUS_SUCCESS = status.HTTP_200_OK

    SERVICE_STATUS_APPLICATION_EXCEPTION = status.HTTP_500_INTERNAL_SERVER_ERROR
    SERVICE_STATUS_BUSINESS_EXCEPTION = status.HTTP_400_BAD_REQUEST
    SERVICE_STATUS_EXCEPTION = status.HTTP_500_INTERNAL_SERVER_ERROR
    SERVICE_STATUS_THROWABLE = status.HTTP_500_INTERNAL_SERVER_ERROR
    SERVICE_STATUS_BAD_REQUEST_EXCEPTION = status.HTTP_400_BAD_REQUEST

    # Generic Exception / Throwable details
    CODE_EXCEPTION = "WS301"
    USERMESSAGE_EXCEPTION = "There was some problem in processing your request. Please try after some time."

    # Serialization validation exception details
    CODE_SERIALIZER_VALIDATION_EXCEPTION = "WS302"
    USERMESSAGE_SERIALIZER_VALIDATION_EXCEPTION = "Data Validation failed at server side. Missing Required Fields."

    # Bad Request Exception details
    CODE_BAD_REQUEST_EXCEPTION = "WS303"
    USERMESSAGE_BAD_REQUEST_1 = "Request is empty."
    USERMESSAGE_BAD_REQUEST_2 = "Request missing mandatory parameters."
    USERMESSAGE_BAD_REQUEST_3 = "Request found invalid."
    ERRORMESSAGE_BAD_REQUEST_1 = "Request object found null."
    ERRORMESSAGE_BAD_REQUEST_2 = "Request method not found in the request."

    """
    Business Exceptions 
    """

    # Generic Business Exception details #
    CODE_BUSINESS_EXCEPTION = "WS101"
    USERMESSAGE_BUSINESS_EXCEPTION = "There was some problem in processing your request. Please try after some time."

    # Generic Data Access Exception details #
    CODE_DATA_ACCESS_EXCEPTION = "WS102"
    USERMESSAGE_DATA_ACCESS_EXCEPTION = "There was some problem in processing your request. Please try after some time."

    # Mandatory Fields Validation Exception details #
    CODE_MANDATORY_FIELD_VALIDATION = "WS103"
    USERMESSAGE_MANDATORY_FIELD_VALIDATION = "Following fields are mandatory : "
    ERRORMESSAGE_MANDATORY_FIELD_VALIDATION = "Mandatory field validation check failed. Missing fields are : "
    USERMESSAGE_LOCATION_MANDATORY_FIELD_VALIDATION = "Please enter a valid location or switch on your location " \
                                                      "settings "

    # AWS Translate Service Exception details #
    CODE_AWS_TRANSLATE_SERVICE_EXCEPTION = "WS104"
    USERMESSAGE_AWS_TRANSLATE_SERVICE_EXCEPTION = "Some issue occurred during translation. This issue has been " \
                                                  "noticed and being worked upon."
