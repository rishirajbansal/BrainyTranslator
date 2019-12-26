/*
 * Licensed To: ThoughtExecution
 * Authored By: Rishi Raj Bansal
 * Developed in: December 2019
 *
*/

import WSBaseRequest from '../domainObjects/requests/WSBaseRequest.js'
import WSTranslateRequest from '../domainObjects/requests/WSTranslateRequest';
import WSTranslateResponse from '../domainObjects/responses/WSTranslateResponse';


const API_URI_TRANSLATE             = "translate";


const uriDirectory = {
    [API_URI_TRANSLATE]: 'translate/'
};

//Format => uri: Domain Object Class Name
const uriDORequestMapper = {
    [API_URI_TRANSLATE]: WSTranslateRequest,
}

//Format => uri: Domain Object Class Name
const uriDOResponseMapper = {
    [API_URI_TRANSLATE]: WSTranslateResponse,
}

export default {
    API_URI_TRANSLATE,
    uriDORequestMapper,
    uriDOResponseMapper,
    uriDirectory
};