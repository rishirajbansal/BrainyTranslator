import logging
from application.generic.base.exception.businessExceptions import *


class TranslateDAO:
    logger = logging.getLogger(__name__)

    def save_translate_details(self, translate_details, formatted_timestamp):
        flag = False

        try:
            translate_details.save(formatted_timestamp)
            flag = True

        except Exception as ex:
            self.logger.error("save_translate_details", "Exception occurred in DAO layer : {}".format(ex))
            raise DataAccessException("save_translate_details() -> Exception occurred in DAO layer : {}".format(ex))

        return flag
