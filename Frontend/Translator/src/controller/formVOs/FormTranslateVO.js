/*
 * Licensed To: ThoughtExecution
 * Authored By: Rishi Raj Bansal
 * Developed in: December 2019
 *
*/


import FormBaseVO from './FormBaseVO';



class FormTranslateVO extends FormBaseVO {

    static PARAM_TRANSLATE_FIELD_LANGUAGE_SRC							=	"srcLanguage";
    static PARAM_TRANSLATE_FIELD_LANGUAGE_TGT							=	"tgtLanguage";

    static PARAM_TRANSLATE_FIELD_MODE   							    =	"modeTranslate";
    static PARAM_TRANSLATE_FIELD_MODE_ID_FILE   						=	"modeTranslateIdFile";
    static PARAM_TRANSLATE_FIELD_MODE_ID_TEXT   						=	"modeTranslateIdText";
    static PARAM_TRANSLATE_FIELD_FILE_TO_TRANS                          =   "fileToTranslate";
    static PARAM_TRANSLATE_FIELD_TEXT_TO_TRANS                          =   "textToTranslate";
    static PARAM_TRANSLATE_FIELD_RESULTS_TEXT                           =   "resultsText";
    static PARAM_TRANSLATE_FIELD_RESULTS_FILE                           =   "resultsFile";
    
    static PARAM_TRANSLATE_FIELD_TOTAL_BYTES                            =   "totalBytes";
    static PARAM_TRANSLATE_FIELD_AMOUNT                                 =   "amount";
    static PARAM_TRANSLATE_FIELD_PROCESS_TIME                           =   "processTime";

    constructor() {
        super();

        this.formTranslateAttrs = {
            [FormTranslateVO.PARAM_TRANSLATE_FIELD_LANGUAGE_SRC] : '',
            [FormTranslateVO.PARAM_TRANSLATE_FIELD_LANGUAGE_TGT] : '',
            [FormTranslateVO.PARAM_TRANSLATE_FIELD_MODE] : '',
            [FormTranslateVO.PARAM_TRANSLATE_FIELD_MODE_ID_FILE] : '',
            [FormTranslateVO.PARAM_TRANSLATE_FIELD_MODE_ID_TEXT] : '',
            [FormTranslateVO.PARAM_TRANSLATE_FIELD_FILE_TO_TRANS] : null,
            [FormTranslateVO.PARAM_TRANSLATE_FIELD_TEXT_TO_TRANS] : '',
            [FormTranslateVO.PARAM_TRANSLATE_FIELD_RESULTS_TEXT] : '',
            [FormTranslateVO.PARAM_TRANSLATE_FIELD_RESULTS_FILE] : null,
            [FormTranslateVO.PARAM_TRANSLATE_FIELD_TOTAL_BYTES] : '',
            [FormTranslateVO.PARAM_TRANSLATE_FIELD_AMOUNT] : '',
            [FormTranslateVO.PARAM_TRANSLATE_FIELD_PROCESS_TIME] : '',
        };

    }

}


/* export default {
    FormTranslateVO,
    PARAM_TRANSLATE_FIELD_LANGUAGE_SRC,
    PARAM_TRANSLATE_FIELD_LANGUAGE_TGT,
    PARAM_TRANSLATE_FIELD_MODE,
    PARAM_TRANSLATE_FIELD_MODE_ID_FILE,
    PARAM_TRANSLATE_FIELD_MODE_ID_TEXT,
    PARAM_TRANSLATE_FIELD_FILE_TO_TRANS,
    PARAM_TRANSLATE_FIELD_TEXT_TO_TRANS,
    PARAM_TRANSLATE_FIELD_RESULTS_TEXT,
    PARAM_TRANSLATE_FIELD_TOTAL_BYTES,
    PARAM_TRANSLATE_FIELD_AMOUNT,
    PARAM_TRANSLATE_FIELD_PROCESS_TIME,

}; */

export default FormTranslateVO;