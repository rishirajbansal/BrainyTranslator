/*
 * Licensed To: ThoughtExecution
 * Authored By: Rishi Raj Bansal
 * Developed in: December 2019
 *
*/

import FormTranslateVO from '../../../../controller/formVOs/FormTranslateVO';
import businessConstants from '../../../../generic/constants/businessConstants';
import utility from '../../../../generic/utilities/utility';

import WSBaseRequest from './WSBaseRequest.js';

class WSTranslateRequest extends WSBaseRequest {
    

    constructor(viewRequestObject) {
        super(viewRequestObject);
        this.src_language = viewRequestObject[FormTranslateVO.PARAM_TRANSLATE_FIELD_LANGUAGE_SRC];
        this.tgt_language = viewRequestObject[FormTranslateVO.PARAM_TRANSLATE_FIELD_LANGUAGE_TGT];
        this.mode = viewRequestObject[FormTranslateVO.PARAM_TRANSLATE_FIELD_MODE];
        if (utility.Utility.safeTrim(this.mode) == businessConstants.MODE_TRANSLATE_FILE){
            this.file = viewRequestObject[FormTranslateVO.PARAM_TRANSLATE_FIELD_FILE_TO_TRANS];
        }
        else if (utility.Utility.safeTrim(this.mode) == businessConstants.MODE_TRANSLATE_TEXT){
            this.src_text = viewRequestObject[FormTranslateVO.PARAM_TRANSLATE_FIELD_TEXT_TO_TRANS];
        }
        else if (utility.Utility.safeTrim(this.mode) == businessConstants.MODE_TRANSLATE_DOWNLOAD){
            this.tgt_file_downloadpath = viewRequestObject[FormTranslateVO.PARAM_TRANSLATE_FIELD_RESULTS_FILE];
        }
    }

}


export default WSTranslateRequest;