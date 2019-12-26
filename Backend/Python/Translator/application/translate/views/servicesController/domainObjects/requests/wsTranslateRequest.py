from application.generic.domainObjects.requests.wsBaseRequest import *


class WSTranslateRequest(WSBaseRequest):

    def __init__(self):
        super().__init__()
        self._src_language = None
        self._tgt_language = None
        self._src_text = None
        self._tgt_file_downloadpath = None
        self._mode = None
        self._file = None

    @property
    def src_language(self):
        return self._src_language

    @src_language.setter
    def src_language(self, src_language):
        self._src_language = src_language

    @property
    def tgt_language(self):
        return self._tgt_language

    @tgt_language.setter
    def tgt_language(self, tgt_language):
        self._tgt_language = tgt_language

    @property
    def src_text(self):
        return self._src_text

    @src_text.setter
    def src_text(self, src_text):
        self._src_text = src_text

    @property
    def mode(self):
        return self._mode

    @mode.setter
    def mode(self, mode):
        self._mode = mode

    @property
    def file(self):
        return self._file

    @file.setter
    def file(self, file):
        self._file = file

    @property
    def tgt_file_downloadpath(self):
        return self._tgt_file_downloadpath

    @tgt_file_downloadpath.setter
    def tgt_file_downloadpath(self, tgt_file_downloadpath):
        self._tgt_file_downloadpath = tgt_file_downloadpath

    def save_data(self, validated_data):
        super().save_data(validated_data)
        self.src_language = validated_data.get('src_language')
        self.tgt_language = validated_data.get('tgt_language')
        self.src_text = validated_data.get('src_text')
        self.mode = validated_data.get('mode')
        self.file = validated_data.get('file')
        self.tgt_file_downloadpath = validated_data.get('tgt_file_downloadpath')
