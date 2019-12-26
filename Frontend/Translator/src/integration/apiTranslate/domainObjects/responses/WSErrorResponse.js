/*
 * Licensed To: ThoughtExecution
 * Authored By: Rishi Raj Bansal
 * Developed in: December 2019
 *
*/

import domainObjectConstants from '../../constants/domainObjectConstants.js';
import FormBaseVO from '../../../../controller/formVOs/FormBaseVO';
import WSBaseResponse from './WSBaseResponse.js';


class WSErrorResponse extends WSBaseResponse{

    constructor(apiResponseObject) {
        super(apiResponseObject);
        this.code = apiResponseObject[domainObjectConstants.DO_RESPONSE_ERROR_CODE];
        this.error_message = apiResponseObject[domainObjectConstants.DO_RESPONSE_ERROR_MESSAGE];
        this.user_message = apiResponseObject[domainObjectConstants.DO_RESPONSE_USER_MESSAGE];
    }

    convertToFormVO(viewRequestObject){
        super.convertToFormVO(viewRequestObject);
        viewRequestObject[FormBaseVO.FORM_ATTR_SUBMIT_ERROR][FormBaseVO.PARAM_ERROR_FIELD_CODE] = this.code;
        viewRequestObject[FormBaseVO.FORM_ATTR_SUBMIT_ERROR][FormBaseVO.PARAM_ERROR_FIELD_ERROR_MESSAGE] = this.error_message;
        viewRequestObject[FormBaseVO.FORM_ATTR_SUBMIT_ERROR][FormBaseVO.PARAM_ERROR_FIELD_USER_MESSAGE] = this.user_message;

    }

}

export default WSErrorResponse;