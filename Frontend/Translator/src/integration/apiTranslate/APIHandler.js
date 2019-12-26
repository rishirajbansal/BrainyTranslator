/*
 * Licensed To: ThoughtExecution
 * Authored By: Rishi Raj Bansal
 * Developed in: November 2019
 *
*/


import axios from 'axios';

const fileDownload = require('js-file-download');

import axiosInstance from './axiosIntializer';
import uriMapper from './constants/uriMapper';
import exceptionConstants from '../../generic/constants/exceptionConstants';
import configs from '../../generic/common/configManager';
import genericConstants from '../../generic/constants/genericConstants';
import errorMessages from '../../stringsBundle/translator/errorMessages';
import domainObjectConstants from './constants/domainObjectConstants.js';
import utility from '../../generic/utilities/utility';
import WSErrorResponse from './domainObjects/responses/WSErrorResponse';



class APIHandler {

    static AXIOS_RESPONSE_TYPE_DEFAULT          =    "json";
    static AXIOS_RESPONSE_TYPE_BLOB          =    "blob";

    static CONTENT_TYPE_MULTIPART           = "multipart/form-data";
    static CONTENT_TYPE_FORM_SUBMIT_REQUEST           = "application/x-www-form-urlencoded";
    static CONTENT_TYPE_JSON           = "application/json";



    constructor(requestedUri, viewRequestObject, downloadObj) {
        this.requestedUri = requestedUri;
        this.viewRequestObject = viewRequestObject;
        this.defaultHttpMethod = 'post';
        this.headers = '';
        this.downloadObj = downloadObj;
    }

    handleApiRequest = async (isFilePresent, responseType) => {
        const httpMethod = this.defaultHttpMethod;
        const uri = this.apiUriResolver(this.requestedUri);
        const doRequestObject = this.apiDORequestAdaptor(this.requestedUri, this.viewRequestObject);
        const formData = this.jsonToFormData(doRequestObject);
        if (isFilePresent){
            this.headers = { 'content-type': APIHandler.CONTENT_TYPE_MULTIPART };
        }
        else{
            this.headers = { 'content-type': APIHandler.CONTENT_TYPE_FORM_SUBMIT_REQUEST };
        }

        const apiResponse = await this.performRequest(httpMethod, uri, formData, this.headers, responseType);

        //Check if it is for download and check if the return resposne contains any error or not and then only allow to download
        if (this.downloadObj != null && this.downloadObj['isDownload'] && typeof apiResponse == "string" ){
            fileDownload(apiResponse, this.downloadObj['fileName']);
        }
        else{
            const doResponseObject = this.apiDOResponseAdaptor(this.requestedUri, apiResponse);

            this.doToFormVOConverter(doResponseObject, this.viewRequestObject);
        }

        return;

    }

    //Get URI based on the request
    apiUriResolver = (requestedUri) => {
        return uriMapper.uriDirectory[requestedUri];
    }
    
    //Convert View Request object to API Domain object
    apiDORequestAdaptor = (requestedUri, viewRequestObject) => {
        const doName = uriMapper.uriDORequestMapper[requestedUri];
        return new doName(viewRequestObject);
    }

    //Get data from API response into API Domain object 
    apiDOResponseAdaptor = (requestedUri, apiResponse) => {
        let doName = null;
        //Check if response contains error not
        if (apiResponse != null && apiResponse[domainObjectConstants.DO_RESPONSE_BASE_RESPONSE] != null && 
            utility.Utility.safeTrim(apiResponse[domainObjectConstants.DO_RESPONSE_BASE_RESPONSE]) == genericConstants.RESPONSE_RETURN_TYPE_ERROR ){
            doName = WSErrorResponse;
        }
        else{
            doName = uriMapper.uriDOResponseMapper[requestedUri];
        }
        
        return new doName(apiResponse);
    }

    //Convert Domain object into formdata that can be send to server
    jsonToFormData = (doObject) => {
        let formData = new FormData();

        Object.keys(doObject).forEach(key => {
            formData.append(key, doObject[key]);
        });

        return formData;
    }

    //Convert API Response Domain object to View object to directly display on UI
    doToFormVOConverter = (doResponseObject, viewRequestObject, ) => {
        doResponseObject.convertToFormVO(viewRequestObject);
    }

    //Performs API server call and gets the response
    performRequest = async (httpMethod, uri, formData, headers, responseType) => {

        let response = {};
        let errorData = {};

        try{
            response = await axiosInstance({
                url: uri,
                method: httpMethod,
                headers: headers,
                data: formData,
                //responseType: responseType,   //Not using responseType
            })
        }
        catch (error){
            if (error.response){
                //The request was made and the server responded with a status code
                //let errorMessage = "Response Data: " + error.response.data + " Error Message: " + error.message;
                let errorMessage = " Error Message: " + error.message;
                errorData = {
                    [domainObjectConstants.DO_RESPONSE_BASE_RESPONSE] : genericConstants.RESPONSE_RETURN_TYPE_ERROR,
                    [domainObjectConstants.DO_RESPONSE_BASE_STATUS] : error.response.status + "", //Making it string if the status code returned is number
                    [domainObjectConstants.DO_RESPONSE_ERROR_CODE] : exceptionConstants.CODE_API_HANDLER_RESPONSE_EXCEPTION,
                    [domainObjectConstants.DO_RESPONSE_USER_MESSAGE] : errorMessages.ERR_MSG_API_HANLDER_RESPONSE_ERROR,
                    [domainObjectConstants.DO_RESPONSE_ERROR_MESSAGE] : errorMessage,
                };
            }
            else if (error.request){
                //The request was made but no response was received
                //let errorMessage = "Request Data: " + error.request + " Error Message: " + error.message;
                let errorMessage = " Error Message: " + error.message;
                errorData = {
                    [domainObjectConstants.DO_RESPONSE_BASE_RESPONSE] : genericConstants.RESPONSE_RETURN_TYPE_ERROR,
                    [domainObjectConstants.DO_RESPONSE_BASE_STATUS] : genericConstants.STRING_NA,
                    [domainObjectConstants.DO_RESPONSE_ERROR_CODE] : exceptionConstants.CODE_API_HANDLER_REQUEST_EXCEPTION,
                    [domainObjectConstants.DO_RESPONSE_USER_MESSAGE] : errorMessages.ERR_MSG_API_HANLDER_REQUEST_ERROR,
                    [domainObjectConstants.DO_RESPONSE_ERROR_MESSAGE] : errorMessage,
                };
            }
            else{
                //Something happened in setting up the request that triggered an Error
                let errorMessage = "Error Message: " + error.message;
                errorData = {
                    [domainObjectConstants.DO_RESPONSE_BASE_RESPONSE] : genericConstants.RESPONSE_RETURN_TYPE_ERROR,
                    [domainObjectConstants.DO_RESPONSE_BASE_STATUS] : genericConstants.STRING_NA,
                    [domainObjectConstants.DO_RESPONSE_ERROR_CODE] : exceptionConstants.CODE_API_HANDLER_ERROR_EXCEPTION,
                    [domainObjectConstants.DO_RESPONSE_USER_MESSAGE] : errorMessages.ERR_MSG_API_HANLDER_ERROR,
                    [domainObjectConstants.DO_RESPONSE_ERROR_MESSAGE] : errorMessage,
                };
            }
            response = {
                data: errorData,
            };
        }
        finally {
            //Do Nothing
        }

        return response.data;
    }

}


export default APIHandler;