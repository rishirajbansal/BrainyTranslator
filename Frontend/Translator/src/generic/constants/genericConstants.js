/*
 * Licensed To: ThoughtExecution
 * Authored By: Rishi Raj Bansal
 * Developed in: November 2019
 *
*/

const path = require('path');

const EMPTY_STRING							= "";
const STRING_TRUE							= "true";
const STRING_FALSE							= "false";
const STRING_YES							= "Y";	
const STRING_NO								= "N";
const STRING_NA								= "NA";

const FILE_TYPES_SEPARATOR 					= "|";


const RESPONSE_RETURN_TYPE_SUCCESS			= "success";
const RESPONSE_RETURN_TYPE_FALSE			= "false";
const RESPONSE_RETURN_TYPE_ERROR			= "error";


/*
 * Common configuration constants
 */
const API_URL								= "api_url";
const AXIOS_TIMEOUT                         = "axios_timeout";


export default {
    EMPTY_STRING,
	STRING_TRUE,
	STRING_FALSE,
	STRING_YES,
	STRING_NO,
	STRING_NA,
	FILE_TYPES_SEPARATOR,
	API_URL,
	AXIOS_TIMEOUT,
	RESPONSE_RETURN_TYPE_SUCCESS,
	RESPONSE_RETURN_TYPE_FALSE,
	RESPONSE_RETURN_TYPE_ERROR
    
}