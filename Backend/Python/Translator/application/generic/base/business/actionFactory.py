from application.translate.business.helloAction import *
from application.translate.business.translateAction import *
from .actionDirectory import *


class ActionFactory:

    logger = logging.getLogger(__name__)

    actionDict = {}

    def __init__(self):
        ActionFactory.load_action_directory()

    @staticmethod
    def load_action_directory():
        ActionFactory.actionDict = {
            ActionDirectory.ACTION_TRANSLATE_HELLO: HelloAction(),
            ActionDirectory.ACTION_TRANSLATE_TRANSLATE: TranslateAction(),
        }

    @staticmethod
    def getActionInstance(action):
        return ActionFactory.actionDict[action]

