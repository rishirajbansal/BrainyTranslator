/*
 * Licensed To: ThoughtExecution
 * Authored By: Rishi Raj Bansal
 * Developed in: December 2019
 *
*/

import FormBaseVO from '../../../../controller/formVOs/FormBaseVO';


class WSBaseRequest {

    constructor(viewRequestObject) {
        this.request_method = viewRequestObject[FormBaseVO.PARAM_BASE_FIELD_REQUEST_METHOD];
    }


}

export default WSBaseRequest;