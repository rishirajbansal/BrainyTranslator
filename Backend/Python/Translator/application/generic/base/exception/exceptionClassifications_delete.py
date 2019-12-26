from application.generic.base.exception.exceptionDetail import *


class ApplicationException(Exception):
    exception_detail = ExceptionDetail()
    message = ''

    def __int__(self, message):
        self.message = message

    def __str__(self):
        return self.message

    def set_exception_detail(self, exception_detail):
        self.exception_detail = exception_detail
        self.message = exception_detail.error_message


class InitException(ApplicationException):

    def __init__(self, exception_detail):
        self.exception_detail = exception_detail
        self.error = exception_detail.error_message


class SessionAuthenticationException(ApplicationException):
    exception_detail = ExceptionDetail()
    message = ''

    def __int__(self, message):
        self.message = message

    def __str__(self):
        return self.message

    def set_exception_detail(self, exception_detail):
        self.exception_detail = exception_detail
        self.message = exception_detail.error_message


class BusinessException(ApplicationException):
    exception_detail = ExceptionDetail()
    message = ''

    def __int__(self, message):
        self.message = message

    def __str__(self):
        return self.message

    def set_exception_detail(self, exception_detail):
        self.exception_detail = exception_detail
        self.message = exception_detail.error_message


class BusinessValidationException(ApplicationException):
    exception_detail = ExceptionDetail()
    message = ''

    def __int__(self, message):
        self.message = message

    def __str__(self):
        return self.message

    def set_exception_detail(self, exception_detail):
        self.exception_detail = exception_detail
        self.message = exception_detail.error_message


class DataAccessException(ApplicationException):
    exception_detail = ExceptionDetail()
    message = ''

    def __int__(self, message):
        self.message = message

    def __str__(self):
        return self.message

    def set_exception_detail(self, exception_detail):
        self.exception_detail = exception_detail
        self.message = exception_detail.error_message
