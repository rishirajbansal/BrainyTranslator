import boto3
import boto3.session
import botocore.exceptions
import os
import logging
from application.generic.base.exception.businessExceptions import *


# Because resources contain shared data when loaded and calling actions, accessing properties,
# or manually loading or reloading the resource can modify this data, everytime for each request new Session is created

class AWSManager:
    logger = logging.getLogger(__name__)

    def __init__(self):
        self._aws_session = None
        self.initialize()
        self.create_session()

    def initialize(self):
        boto3.set_stream_logger('boto3', logging.DEBUG)

    def create_session(self):
        ACCESS_KEY = os.getenv("ACCESS_KEY") if os.getenv("ACCESS_KEY") is None else os.environ.get('ACCESS_KEY')
        SECRET_KEY = os.getenv("SECRET_KEY") if os.getenv("SECRET_KEY") is None else os.environ.get('SECRET_KEY')

        self._aws_session = boto3.session.Session(
            aws_access_key_id=ACCESS_KEY,
            aws_secret_access_key=SECRET_KEY,
            region_name=os.getenv("REGION")
        )

    def get_translate_service(self):
        translate_service = self.aws_session.client('translate')
        return translate_service

    def translate(self, translate_service, text, src_lmg_code, tgt_lng_code):

        try:
            translate_response = translate_service.translate_text(
                Text=text,
                SourceLanguageCode=src_lmg_code,
                TargetLanguageCode=tgt_lng_code
            )
        except translate_service.exceptions.AccessDeniedException as adEx:
            self.logger.error("translate", "AccessDeniedException occurred during AWS Translate "
                                           "Service : {}".format(adEx))
            raise AWSTranslateServiceException("translate() -> AccessDeniedException occurred during AWS Translate "
                                               "Service : {}".format(adEx))
        except translate_service.exceptions.InternalServerException as isEx:
            self.logger.error("translate", "InternalServerException occurred during AWS Translate "
                                           "Service : {}".format(isEx))
            raise AWSTranslateServiceException("translate() -> InternalServerException occurred during AWS Translate "
                                               "Service : {}".format(isEx))
        except translate_service.exceptions.InvalidRequestException as irEx:
            self.logger.error("translate", "InvalidRequestException occurred during AWS Translate "
                                           "Service : {}".format(irEx))
            raise AWSTranslateServiceException("translate() -> InvalidRequestException occurred during AWS Translate "
                                               "Service : {}".format(irEx))
        except translate_service.exceptions.TextSizeLimitExceededException as tslEx:
            self.logger.error("translate", "TextSizeLimitExceededException occurred during AWS Translate "
                                           "Service : {}".format(tslEx))
            raise AWSTranslateServiceException("translate() -> TextSizeLimitExceededException occurred during AWS "
                                               "Translate Service : {}".format(tslEx))
        except translate_service.exceptions.TooManyRequestsException as tmrEx:
            self.logger.error("translate", "TooManyRequestsException occurred during AWS Translate "
                                           "Service : {}".format(tmrEx))
            raise AWSTranslateServiceException("translate() -> InvalidRequestException occurred during AWS Translate "
                                               "Service : {}".format(tmrEx))
        except translate_service.exceptions.UnsupportedLanguagePairException as ulpEx:
            self.logger.error("translate", "UnsupportedLanguagePairException occurred during AWS Translate "
                                           "Service : {}".format(ulpEx))
            raise AWSTranslateServiceException("translate() -> UnsupportedLanguagePairException occurred during AWS "
                                               "Translate Service : {}".format(ulpEx))
        except botocore.exceptions.ClientError as err:
            self.logger.error("translate", "Boto ClientError occurred during AWS Translate Service : {}".format(err))
            raise AWSTranslateServiceException("translate() -> Boto ClientError occurred during AWS "
                                               "Translate Service : {}".format(err))

        return translate_response

    @property
    def aws_session(self):
        return self._aws_session

    @aws_session.setter
    def aws_session(self, aws_session):
        self._aws_session = aws_session
