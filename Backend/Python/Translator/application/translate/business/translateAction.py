import os
import mimetypes

from chardet import detect
from application.generic.base.business.abstractAction import *
from application.generic.base.business.requestMethods import *
from application.generic.base.constants.genericConstants import *
from application.generic.base.constants.exceptionConstants import *
from application.generic.base.exception.exceptionUtility import *
from application.generic.utilities.utility import Utility
from application.translate.views.servicesController.domainObjects.responses.wsTranslateResponse import *
from application.translate.models.translateDetailsData import *
from application.translate.dao.translateDAO import *
from django.conf import settings
from django.core.files.storage import default_storage
from config.awsConf import *
from config.commonConf import *
from stringsBundle.messageStrings import *
from application.generic.integration.aws.awsManager import *

from datetime import datetime


class TranslateAction(AbstractAction):
    logger = logging.getLogger(__name__)

    def __init__(self):
        pass

    def execute(self, request, request_method):

        outbound_response = WSTranslateResponse()

        return_data = {
            'outbound_response': outbound_response,
            'isDownload': False
        }

        try:
            if request_method == RequestMethods.TRANSLATE_TRANSLATE_TRANSLATE_DUMMY.value:
                self.translate_dummy(request, return_data, request_method)
            elif request_method == RequestMethods.TRANSLATE_TRANSLATE_DOTRANSLATE.value:
                self.translate(request, return_data, request_method)
            elif request_method == RequestMethods.TRANSLATE_TRANSLATE_FILEDOWNLOAD.value:
                self.translated_file_download(request, return_data, request_method)
            else:
                raise (BusinessException("Unsupported request type."))

        except DataAccessException as daEx:
            self.logger.error("DataAccessException occurred for Translate Action request : {}".format(daEx.message))
            raise ExceptionUtility.create_exception_detail(ExceptionConstants.CODE_DATA_ACCESS_EXCEPTION,
                                                           ExceptionConstants.USERMESSAGE_DATA_ACCESS_EXCEPTION,
                                                           daEx.message,
                                                           DataAccessException.__name__)
        except AWSTranslateServiceException as atsEx:
            self.logger.error("AWSTranslateServiceException occurred for Translate Action request : {}".format(atsEx.message))
            raise ExceptionUtility.create_exception_detail(ExceptionConstants.CODE_AWS_TRANSLATE_SERVICE_EXCEPTION,
                                                           ExceptionConstants.USERMESSAGE_AWS_TRANSLATE_SERVICE_EXCEPTION,
                                                           atsEx.message,
                                                           AWSTranslateServiceException.__name__)
        except BusinessException as bEx:
            self.logger.error("BusinessException occurred for Translate Action request : {}".format(bEx.message))
            raise ExceptionUtility.create_exception_detail(ExceptionConstants.CODE_BUSINESS_EXCEPTION,
                                                           ExceptionConstants.USERMESSAGE_BUSINESS_EXCEPTION,
                                                           bEx.message,
                                                           BusinessException.__name__)
        except Exception as ex:
            self.logger.error("Exception occurred for Translate Action request : {}".format(ex))
            raise ExceptionUtility.create_exception_detail(ExceptionConstants.CODE_BUSINESS_EXCEPTION,
                                                           ExceptionConstants.USERMESSAGE_BUSINESS_EXCEPTION,
                                                           str(ex),
                                                           ApplicationException.__name__)

        return return_data

    def translate_dummy(self, request, return_data, request_method):
        self.logger.debug("Inside Translate Action -> translate_dummy...")

        self.logger.debug("------------------------Translation process Started ----------------------------")

        outbound_response = return_data['outbound_response']
        src_text = ''
        dest_file_path = ''
        src_lng_code = ''
        tgt_lng_code = ''
        total_bytes = 0
        file_encoding = ''

        dateTimeObj = datetime.now()
        start_time = dateTimeObj.strftime("%d-%b-%Y %H:%M:%S.%f")
        self.logger.debug("Translation process Started at: {}".format(start_time))

        start_time_in_millis = Utility.current_time_in_milli()

        self.logger.debug("Source Language : {}".format(request.src_language))
        self.logger.debug("Target Language : {}".format(request.tgt_language))
        self.logger.debug("Mode : {}".format(request.mode))

        if Utility.safe_trim(request.mode) == BusinessConstants.TRANSLATE_TRANSLATION_MODE_FILE:
            uploaded_file = request.file
            file_name = uploaded_file.name
            file_size = uploaded_file.size
            mime_type = uploaded_file.content_type

            self.logger.debug("Upload File info : [Uploaded Filename : {}] [File size : {}] [Mime Type : {}]".
                              format(file_name, file_size, mime_type))

            # 1. File Size Check
            maxFileSize = TRANSLATE_FILE_UPLOAD[GenericConstants.FILE_UPLOAD_MAX_FILE_SIZE]
            maxFileSize = maxFileSize * 1024 * 1024 # in MB
            if file_size > maxFileSize:
                self.logger.debug("File size validation failed.")
                self.logger.debug("Allowable File Size : {}".format(maxFileSize))
                self.logger.debug("Uploaded File Size : {}".format(file_size))
                self.generateFalseResponse(outbound_response, TRANSLATE_MESSAGE_STRINGS['E_FILE_MAX_SIZE'])
                return

            # 2. File Type check
            allowable_file_types = TRANSLATE_FILE_UPLOAD[GenericConstants.FILE_UPLOAD_FILE_TYPES]
            ext_index = file_name.rfind(".")
            file_ext = "" if ext_index == -1 else file_name[file_name.rfind(".")+1:len(file_name)]
            if ext_index == -1 or file_ext not in allowable_file_types:
                self.logger.debug("File type validation failed.")
                self.logger.debug("Configured File Extensions : {}".format(allowable_file_types))
                self.logger.debug("Uploaded fileExtension : {}".format(file_ext))
                self.generateFalseResponse(outbound_response, TRANSLATE_MESSAGE_STRINGS['E_FILE_INVALID_TYPE'])
                return

            # Upload file
            new_file_name_orig = file_name[0:file_name.rfind(".")] + dateTimeObj.strftime("-%H_%M_%S") + \
                                 "-orig" + file_name[file_name.rfind("."):len(file_name)]
            orig_file_path = os.path.join(os.getenv("UPLOADS_PATH"), new_file_name_orig)
            saved_path = default_storage.save(orig_file_path, uploaded_file)

            self.logger.debug("Uploaded File successfully saved at : {}".format(saved_path))

            new_file_name_dest = file_name[0:file_name.rfind(".")] + dateTimeObj.strftime("-%H_%M_%S") + \
                                 "-dest" + file_name[file_name.rfind("."):len(file_name)]
            dest_file_path = os.path.join(os.getenv("UPLOADS_PATH"), new_file_name_dest)

            # Get the File encoding
            file_encoding = self.get_encoding_type(orig_file_path)
            self.logger.debug("File Encoding Type : {}".format(file_encoding))

            # Convert File to string
            src_text = self.file_to_string(orig_file_path, file_encoding)

            # Calculate the size of origin text
            total_bytes = file_size

            # Set the File download path
            outbound_response.tgt_file = new_file_name_dest

        else:
            src_text = request.src_text

            # Calculate the size of origin text - len() does not include '\n' character in counting,adding it separately
            total_bytes = len(src_text) + src_text.count("\n")

        chunked_data_list = self.split_text_to_chunks(src_text)
        self.logger.debug("Chunked data size : {}".format(len(chunked_data_list)))
        # self.logger.debug("Chunked data : {}".format(chunked_data_list))

        src_lng_code = LNG_CODES[request.src_language]
        tgt_lng_code = LNG_CODES[request.tgt_language]
        self.logger.debug("Soruce Language Code : {}".format(src_lng_code))
        self.logger.debug("Target Language Code : {}".format(tgt_lng_code))

        translated_text = ''
        for text in chunked_data_list:
            translated_text = translated_text + text

        if Utility.safe_trim(request.mode) == BusinessConstants.TRANSLATE_TRANSLATION_MODE_FILE:
            # Set the translated text in file

            with open(dest_file_path, 'w', encoding=file_encoding) as outfile:
                outfile.write(translated_text)
                outfile.close()

            self.logger.debug("Translated File successfully saved at : {}".format(dest_file_path))
        else:
            # Set the translated text
            outbound_response.tgt_text = translated_text

        # set Total Bytes
        outbound_response.total_bytes = total_bytes
        self.logger.debug("Total Bytes Translated : {}".format(total_bytes))

        # Calculate the amount
        calculated_amount = self.calculate_amount(total_bytes)
        calculated_amount = round(calculated_amount, 2)
        # Set minimum amount to pay
        if calculated_amount < AWS_MIN_COST_PAY:
            calculated_amount = AWS_MIN_COST_PAY
        outbound_response.amount = calculated_amount
        self.logger.debug("Amount Calculated : {}".format(outbound_response.amount))

        # Calculate Processing time
        end_time_in_millis = Utility.current_time_in_milli()
        outbound_response.process_time = (end_time_in_millis - start_time_in_millis)/1000

        # Current Translation time
        formatted_timestamp = str(datetime.now())
        index = formatted_timestamp.rfind(".")
        formatted_timestamp = formatted_timestamp[0:index]

        # Save in Database
        translate_details = TranslateDetails(src_language=request.src_language,
                                             tgt_language=request.tgt_language,
                                             total_bytes=outbound_response.total_bytes,
                                             mode=request.mode,
                                             amount=outbound_response.amount,
                                             process_time=outbound_response.process_time
                                             )

        is_saved = TranslateDAO().save_translate_details(translate_details, formatted_timestamp)
        if is_saved:
            self.logger.debug("Translate Details saved successfully in database.")
            self.generateSuccessResponse(outbound_response)
        else:
            self.logger.error("Translate Details FAILED to save in database.")
            raise BusinessException("Translate Details FAILED to save in database.")

        dateTimeObj = datetime.now()
        end_time = dateTimeObj.strftime("%d-%b-%Y %H:%M:%S.%f")
        self.logger.debug("Translation process Finished at: {}".format(end_time))

        self.logger.debug("------------------------Translation process Finished ----------------------------")

        return

    def translate(self, request, return_data, request_method):

        self.logger.debug("Inside Translate Action -> translate...")

        self.logger.debug("------------------------Translation process Started ----------------------------")

        outbound_response = return_data['outbound_response']
        src_text = ''
        dest_file_path = ''
        src_lng_code = ''
        tgt_lng_code = ''
        total_bytes = 0
        file_encoding = ''

        dateTimeObj = datetime.now()
        start_time = dateTimeObj.strftime("%d-%b-%Y %H:%M:%S.%f")
        self.logger.debug("Translation process Started at: {}".format(start_time))

        start_time_in_millis = Utility.current_time_in_milli()

        self.logger.debug("Source Language : {}".format(request.src_language))
        self.logger.debug("Target Language : {}".format(request.tgt_language))
        self.logger.debug("Mode : {}".format(request.mode))

        if Utility.safe_trim(request.mode) == BusinessConstants.TRANSLATE_TRANSLATION_MODE_FILE:
            uploaded_file = request.file
            file_name = uploaded_file.name
            file_size = uploaded_file.size
            mime_type = uploaded_file.content_type

            self.logger.debug("Upload File info : [Uploaded Filename : {}] [File size : {}] [Mime Type : {}]".
                              format(file_name, file_size, mime_type))

            # 1. File Size Check
            maxFileSize = TRANSLATE_FILE_UPLOAD[GenericConstants.FILE_UPLOAD_MAX_FILE_SIZE]
            maxFileSize = maxFileSize * 1024 * 1024  # in MB
            if file_size > maxFileSize:
                self.logger.debug("File size validation failed.")
                self.logger.debug("Allowable File Size : {}".format(maxFileSize))
                self.logger.debug("Uploaded File Size : {}".format(file_size))
                self.generateFalseResponse(outbound_response, TRANSLATE_MESSAGE_STRINGS['E_FILE_MAX_SIZE'])
                return

            # 2. File Type check
            allowable_file_types = TRANSLATE_FILE_UPLOAD[GenericConstants.FILE_UPLOAD_FILE_TYPES]
            ext_index = file_name.rfind(".")
            file_ext = "" if ext_index == -1 else file_name[file_name.rfind(".") + 1:len(file_name)]
            if ext_index == -1 or file_ext not in allowable_file_types:
                self.logger.debug("File type validation failed.")
                self.logger.debug("Configured File Extensions : {}".format(allowable_file_types))
                self.logger.debug("Uploaded fileExtension : {}".format(file_ext))
                self.generateFalseResponse(outbound_response, TRANSLATE_MESSAGE_STRINGS['E_FILE_INVALID_TYPE'])
                return

            # Upload file
            new_file_name_orig = file_name[0:file_name.rfind(".")] + dateTimeObj.strftime("-%H_%M_%S") + \
                                 "-orig" + file_name[file_name.rfind("."):len(file_name)]
            orig_file_path = os.path.join(os.getenv("UPLOADS_PATH"), new_file_name_orig)
            saved_path = default_storage.save(orig_file_path, uploaded_file)

            self.logger.debug("Uploaded File successfully saved at : {}".format(saved_path))

            new_file_name_dest = file_name[0:file_name.rfind(".")] + dateTimeObj.strftime("-%H_%M_%S") + \
                                 "-dest" + file_name[file_name.rfind("."):len(file_name)]
            dest_file_path = os.path.join(os.getenv("UPLOADS_PATH"), new_file_name_dest)

            # Get the File encoding
            file_encoding = self.get_encoding_type(orig_file_path)
            self.logger.debug("File Encoding Type : {}".format(file_encoding))

            # Convert File to string
            src_text = self.file_to_string(orig_file_path, file_encoding)

            # Calculate the size of origin text
            total_bytes = file_size

            # Set the File download path
            outbound_response.tgt_file = new_file_name_dest

        else:
            src_text = request.src_text

            # Calculate the size of origin text
            total_bytes = len(request.src_text)

        chunked_data_list = self.split_text_to_chunks(src_text)
        self.logger.debug("Chunked data size : {}".format(len(chunked_data_list)))
        # self.logger.debug("Chunked data : {}".format(chunked_data_list))

        # Call AWS Translate Service
        self.logger.debug("Calling AWS Translate Service for translation...")
        translated_text = ''
        src_lng_code = LNG_CODES[request.src_language]
        tgt_lng_code = LNG_CODES[request.tgt_language]
        self.logger.debug("Source Language Code : {}".format(src_lng_code))
        self.logger.debug("Target Language Code : {}".format(tgt_lng_code))

        aws_manager = AWSManager()
        translate_service = aws_manager.get_translate_service()
        self.logger.debug("AWS Translated service will be called '{}' times".format(len(chunked_data_list)))

        for text in chunked_data_list:
            translate_response = aws_manager.translate(translate_service, text, src_lng_code, tgt_lng_code)
            response_translated_text = translate_response.get(BusinessConstants.TRANSLATE_SERVICE_RESPONSE_TRANSLATED_TEXT)
            translated_text = translated_text + response_translated_text

        self.logger.debug("Calling AWS Translate Service for translation is done.")

        if Utility.safe_trim(request.mode) == BusinessConstants.TRANSLATE_TRANSLATION_MODE_FILE:
            # Set the translated text in file
            with open(dest_file_path, 'w', encoding=file_encoding) as outfile:
                outfile.write(translated_text)
                outfile.close()

            self.logger.debug("Translated File successfully saved at : {}".format(dest_file_path))
        else:
            # Set the translated text
            outbound_response.tgt_text = translated_text

        # set Total Bytes
        outbound_response.total_bytes = total_bytes
        self.logger.debug("Total Bytes Translated : {}".format(total_bytes))

        # Calculate the amount
        calculated_amount = self.calculate_amount(total_bytes)
        calculated_amount = round(calculated_amount, 2)
        # Set minimum amount to pay
        if calculated_amount < AWS_MIN_COST_PAY:
            calculated_amount = AWS_MIN_COST_PAY
        outbound_response.amount = calculated_amount
        self.logger.debug("Amount Calculated : {}".format(outbound_response.amount))

        # Calculate Processing time
        end_time_in_millis = Utility.current_time_in_milli()
        outbound_response.process_time = (end_time_in_millis - start_time_in_millis) / 1000

        # Current Translation time
        formatted_timestamp = str(datetime.now())
        index = formatted_timestamp.rfind(".")
        formatted_timestamp = formatted_timestamp[0:index]

        # Save in Database
        translate_details = TranslateDetails(src_language=request.src_language,
                                             tgt_language=request.tgt_language,
                                             total_bytes=outbound_response.total_bytes,
                                             mode=request.mode,
                                             amount=outbound_response.amount,
                                             process_time=outbound_response.process_time
                                             )

        is_saved = TranslateDAO().save_translate_details(translate_details, formatted_timestamp)
        if is_saved:
            self.logger.debug("Translate Details saved successfully in database.")
            self.generateSuccessResponse(outbound_response)
        else:
            self.logger.error("Translate Details FAILED to save in database.")
            raise BusinessException("Translate Details FAILED to save in database.")

        dateTimeObj = datetime.now()
        end_time = dateTimeObj.strftime("%d-%b-%Y %H:%M:%S.%f")
        self.logger.debug("Translation process Finished at: {}".format(end_time))

        self.logger.debug("------------------------Translation process Finished ----------------------------")

        return

    def translated_file_download(self, request, return_data, request_method):
        self.logger.debug("Inside Translate Action -> translated_file_download...")

        download_file_path = os.path.join(os.getenv("UPLOADS_PATH"), request.tgt_file_downloadpath)

        self.logger.debug("Translated File Requested : {}".format(download_file_path))

        outbound_response = return_data['outbound_response']

        # download_file = open(download_file_path, "r")
        mime_type = mimetypes.MimeTypes().guess_type(download_file_path)
        self.logger.debug("Mime Type of the download file : {}".format(mime_type))

        outbound_response.tgt_file = download_file_path
        outbound_response.mime_type = mime_type
        outbound_response.tgt_file_name = request.tgt_file_downloadpath

        return_data['isDownload'] = True

        return

    def file_to_string(self, src_file, file_encoding):
        src_text = ''

        with open(src_file, 'r', encoding=file_encoding) as infile:
            for line in infile:
                src_text = src_text + line
            infile.close()

        return src_text

    def split_text_to_chunks(self, src_text):
        self.logger.debug("Splitting source text to chunks of source size : {}".format(len(src_text)))

        chunked_data_list = []

        split_list = src_text.split('\n')
        split_list_length = len(split_list)

        chunk_size_count = 0
        consolidated_chunk_data = ''
        ctr = 0
        for chunk in split_list:
            if len(chunk) + chunk_size_count <= MAX_TRANSLATE_CHUNK_SIZE - CHUNK_FOR_EXTRA_SPACE:
                consolidated_chunk_data = consolidated_chunk_data + chunk
                chunk_size_count = chunk_size_count + len(chunk)
                ctr = ctr + 1
                if ctr < split_list_length:
                    consolidated_chunk_data = consolidated_chunk_data + "\n"
                    chunk_size_count = chunk_size_count + len("\n")
                    continue

            chunked_data_list.append(consolidated_chunk_data)

            if ctr < split_list_length:
                chunk_size_count = 0
                consolidated_chunk_data = ''
                consolidated_chunk_data = consolidated_chunk_data + chunk + "\n"
                chunk_size_count = chunk_size_count + len(chunk + "\n")
                ctr = ctr + 1

        return chunked_data_list

    def calculate_amount(self, total_bytes):
        aws_orig_cost_per_byte = AWS_TRANSLATE_PER_BYTE_ORIG_COST
        margin_perct = AWS_TRANSLATE_PER_BYTE_MARGIN_PECT

        base_amount = aws_orig_cost_per_byte + (aws_orig_cost_per_byte*margin_perct/100)
        calculated_amount = base_amount * total_bytes

        return calculated_amount

    def get_encoding_type(self, file):
        with open(file, 'rb') as f:
            rawdata = f.read()

        return detect(rawdata)['encoding']