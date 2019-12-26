from rest_framework.response import Response
from django.http import HttpResponse


class ViewsHandler:

    @staticmethod
    def dispatch(serializer_response):
        return Response(serializer_response.data)

    @staticmethod
    def download(serializer_response, mime_type, file_path, file_name):

        content_type = mime_type[0]
        headers = {
            'Content-Disposition': 'attachment; filename=%s' % file_name,
            'X-Sendfile': file_path,
            'Content-Type': content_type
        }

        with open(file_path, 'rb') as fh:
            http_response = HttpResponse(fh.read(), content_type=content_type)
            http_response['Content-Disposition'] = 'attachment; filename=%s' % file_name
            # http_response['X-Sendfile'] = file_path
            fh.close()

        # Django Rest Framework Response will not be used in case of File Download as it deals with JSON
        # return Response(serializer_response.data, None, None, headers, content_type)

        return http_response


