/*
 * Licensed To: ThoughtExecution
 * Authored By: Rishi Raj Bansal
 * Developed in: December 2019
 *
*/

/* const PARAM_BASE_FIELD_REQUEST_METHOD                   = "requestMethod";
const PARAM_BASE_FIELD_STATUS                           = "status";

const PARAM_ERROR_FIELD_CODE							=	"code";
const PARAM_ERROR_FIELD_ERROR_MESSAGE					=	"errorMessage";
const PARAM_ERROR_FIELD_USER_MESSAGE					=	"userMessage";

const PARAM_MESSAGE_FIELD_SUCCESS_MESSAGE				=	"successMessage";
const PARAM_MESSAGE_FIELD_ERROR_MESSAGE					=	"errorMessage";

const PARAM_FIELD_RESPONSE_TYPE     					=	"responseType"; */


class FormBaseVO {

    static PARAM_BASE_FIELD_REQUEST_METHOD                   = "requestMethod";
    static PARAM_BASE_FIELD_STATUS                           = "status";

    static PARAM_FIELD_RESPONSE_TYPE     					=	"responseType";

    static PARAM_ERROR_FIELD_CODE							=	"code";
    static PARAM_ERROR_FIELD_ERROR_MESSAGE					=	"errorMessage";
    static PARAM_ERROR_FIELD_USER_MESSAGE					=	"userMessage";

    static PARAM_MESSAGE_FIELD_SUCCESS_MESSAGE				=	"successMessage";
    static PARAM_MESSAGE_FIELD_ERROR_MESSAGE					=	"errorMessage";

    static FORM_ATTR_SUBMIT_ERROR                              = "submitErrorAttrs";
    static FORM_ATTR_SUBMIT_SUCCESS_MESSAGE                     = "submitSuccessMessageAttrs";
    static FORM_ATTR_SUBMIT_ERROR_MESSAGE                       = "submitErrorMessageAttrs";

    constructor() {

        this.formBaseAttrs = {
            [FormBaseVO.PARAM_BASE_FIELD_REQUEST_METHOD] : '',
            [FormBaseVO.PARAM_FIELD_RESPONSE_TYPE] : '',
            [FormBaseVO.PARAM_BASE_FIELD_STATUS] : '',
        };

        this.submitErrorAttrs = {
            [FormBaseVO.PARAM_ERROR_FIELD_CODE] : '',
            [FormBaseVO.PARAM_ERROR_FIELD_ERROR_MESSAGE] : '',
            [FormBaseVO.PARAM_ERROR_FIELD_USER_MESSAGE] : '',
            
        };

        this.submitSuccessMessageAttrs = {
            [FormBaseVO.PARAM_MESSAGE_FIELD_SUCCESS_MESSAGE] : '',
        };
        
        this.submitErrorMessageAttrs = {
            [FormBaseVO.PARAM_MESSAGE_FIELD_ERROR_MESSAGE] : ''
        };

    }

}

/* export default {
    FormBaseVO,
    PARAM_BASE_FIELD_REQUEST_METHOD,
    PARAM_BASE_FIELD_STATUS,
    PARAM_ERROR_FIELD_CODE,
    PARAM_ERROR_FIELD_ERROR_MESSAGE,
    PARAM_ERROR_FIELD_USER_MESSAGE,
    PARAM_MESSAGE_FIELD_SUCCESS_MESSAGE,
    PARAM_MESSAGE_FIELD_ERROR_MESSAGE,
    PARAM_FIELD_RESPONSE_TYPE,

}; */

export default FormBaseVO;