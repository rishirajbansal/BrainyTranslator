/*
 * Licensed To: ThoughtExecution
 * Authored By: Rishi Raj Bansal
 * Developed in: December 2019
 *
*/

import domainObjectConstants from '../../constants/domainObjectConstants.js';
import FormBaseVO from '../../../../controller/formVOs/FormBaseVO';

class WSBaseResponse {

    constructor(apiResponseObject) {
        this.status = apiResponseObject[domainObjectConstants.DO_RESPONSE_BASE_STATUS];
        this.response = apiResponseObject[domainObjectConstants.DO_RESPONSE_BASE_RESPONSE];
        this.successMessage = apiResponseObject[domainObjectConstants.DO_RESPONSE_BASE_SUCCESS_MESSAGE];
        this.errorMessage = apiResponseObject[domainObjectConstants.DO_RESPONSE_BASE_ERROR_MESSAGE];
    }

    convertToFormVO(viewRequestObject){
        viewRequestObject[FormBaseVO.PARAM_BASE_FIELD_STATUS] = this.status;
        viewRequestObject[FormBaseVO.PARAM_FIELD_RESPONSE_TYPE] = this.response;
        viewRequestObject[FormBaseVO.FORM_ATTR_SUBMIT_SUCCESS_MESSAGE][FormBaseVO.PARAM_MESSAGE_FIELD_SUCCESS_MESSAGE] = this.successMessage;
        viewRequestObject[FormBaseVO.FORM_ATTR_SUBMIT_ERROR_MESSAGE][FormBaseVO.PARAM_MESSAGE_FIELD_ERROR_MESSAGE] = this.errorMessage;

    }

}


export default WSBaseResponse;
