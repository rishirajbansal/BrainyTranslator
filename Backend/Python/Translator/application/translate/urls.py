from django.urls import path
from application.translate.views.servicesController.resourceHandlers.helloService import HelloService
from application.translate.views.servicesController.resourceHandlers.translateService import TranslateService
from application.generic.base.constants.URIConstants import URIConstants

urlpatterns = [
    path('', HelloService.as_view()),
    path(URIConstants.URI_TRANSLATE_HELLO, HelloService.as_view()),
    path(URIConstants.URI_TRANSLATE_TRANSLATE, TranslateService.as_view()),
]