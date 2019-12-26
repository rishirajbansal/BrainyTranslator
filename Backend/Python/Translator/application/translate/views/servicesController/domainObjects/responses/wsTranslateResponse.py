from application.generic.domainObjects.responses.wsBaseResponse import *


class WSTranslateResponse(WSBaseResponse):

    def __init__(self):
        super().__init__()
        self._tgt_text = None
        self._tgt_file = None
        self._total_bytes = None
        self._amount = None
        self._process_time = None

        # These attributes don't require serialization
        self._mime_type = None
        self._tgt_file_name = None

    @property
    def tgt_text(self):
        return self._tgt_text

    @tgt_text.setter
    def tgt_text(self, tgt_text):
        self._tgt_text = tgt_text

    @property
    def tgt_file(self):
        return self._tgt_file

    @tgt_file.setter
    def tgt_file(self, tgt_file):
        self._tgt_file = tgt_file

    @property
    def total_bytes(self):
        return self._total_bytes

    @total_bytes.setter
    def total_bytes(self, total_bytes):
        self._total_bytes = total_bytes

    @property
    def amount(self):
        return self._amount

    @amount.setter
    def amount(self, amount):
        self._amount = amount

    @property
    def process_time(self):
        return self._process_time

    @process_time.setter
    def process_time(self, process_time):
        self._process_time = process_time

    @property
    def mime_type(self):
        return self._mime_type

    @mime_type.setter
    def mime_type(self, mime_type):
        self._mime_type = mime_type

    @property
    def tgt_file_name(self):
        return self._tgt_file_name

    @tgt_file_name.setter
    def tgt_file_name(self, tgt_file_name):
        self._tgt_file_name = tgt_file_name

    def save_data(self, validated_data):
        super().save_data(validated_data)

        self.tgt_text = validated_data.get('tgt_text')
        self.tgt_file = validated_data.get('tgt_file')
        self.total_bytes = validated_data.get('total_bytes')
        self.amount = validated_data.get('amount')
        self.process_time = validated_data.get('process_time')
