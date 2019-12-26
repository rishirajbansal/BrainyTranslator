/*
 * Licensed To: ThoughtExecution
 * Authored By: Rishi Raj Bansal
 * Developed in: December 2019
 *
*/

import WSBaseResponse from './WSBaseResponse.js';
import domainObjectConstants from '../../constants/domainObjectConstants.js';
import FormTranslateVO from '../../../../controller/formVOs/FormTranslateVO'


class WSTranslateResponse extends WSBaseResponse{

    constructor(apiResponseObject) {
        super(apiResponseObject);
        this.tgt_text = apiResponseObject[domainObjectConstants.DO_RESPONSE_TRANSLATE_TGT_TEXT];
        this.tgt_file = apiResponseObject[domainObjectConstants.DO_RESPONSE_TRANSLATE_TGT_FILE];
        this.total_bytes = apiResponseObject[domainObjectConstants.DO_RESPONSE_TRANSLATE_TOTAL_BYTES];
        this.amount = apiResponseObject[domainObjectConstants.DO_RESPONSE_TRANSLATE_AMOUNT];
        this.process_time = apiResponseObject[domainObjectConstants.DO_RESPONSE_TRANSLATE_PROCESS_TIME];
    }

    convertToFormVO(viewRequestObject){
        super.convertToFormVO(viewRequestObject);
        viewRequestObject[FormTranslateVO.PARAM_TRANSLATE_FIELD_RESULTS_TEXT] = this.tgt_text;
        viewRequestObject[FormTranslateVO.PARAM_TRANSLATE_FIELD_RESULTS_FILE] = this.tgt_file;
        viewRequestObject[FormTranslateVO.PARAM_TRANSLATE_FIELD_TOTAL_BYTES] = this.total_bytes;
        viewRequestObject[FormTranslateVO.PARAM_TRANSLATE_FIELD_AMOUNT] = this.amount;
        viewRequestObject[FormTranslateVO.PARAM_TRANSLATE_FIELD_PROCESS_TIME] = this.process_time;

    }

}

export default WSTranslateResponse;