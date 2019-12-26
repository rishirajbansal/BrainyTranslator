/*
 * Licensed To: ThoughtExecution
 * Authored By: Rishi Raj Bansal
 * Developed in: December 2019
 *
*/

import React, { Component } from 'react';
import utility from '../../generic/utilities/utility';
import businessConstants from '../../generic/constants/businessConstants';
import genericConstants from '../../generic/constants/genericConstants';
import uiStrings from '../../stringsBundle/translator/uiStrings';

import Table from 'react-bootstrap/Table'
import Alert from 'react-bootstrap/Alert'

import FormBaseVO from '../../controller/formVOs/FormBaseVO'


const ResponseSuccess = (props) => {

    return (
        <Alert variant="success">
            <h5 style={{color: '#1886AA', textAlign: 'left'}}>{props.successMsg[FormBaseVO.PARAM_MESSAGE_FIELD_SUCCESS_MESSAGE]}</h5>
        </Alert>
    );
        
};

const ResponseError = (props) => {

    return (
        <Alert variant="danger">
            <h5 style={{color: '#FF0000', textAlign: 'left', fontWeight: 'normal', wordWrap: 'break-word', margin: '0px'}}>{props.errorMsg[FormBaseVO.PARAM_MESSAGE_FIELD_ERROR_MESSAGE]}</h5>
        </Alert>
    );
        
};

const ResponseException = (props) => {

    return (
        <div>

            <h5 style={{color: '#FF0000'}}>Error Occurred !</h5><br/>
            <Table bordered hover size="sm">
                <tbody>
                    <tr>
						<td style={{background: '#f7f7f7', width: '22%'}}>{uiStrings.STRING_STATUS}</td>
                        <td style={{background: '#ffffff'}}>{props.status}</td>
					</tr>
                    <tr>
						<td style={{background: '#f7f7f7'}}>{uiStrings.STRING_CODE}</td>
                        <td style={{background: '#ffffff'}}>{props.exceptionDetails[FormBaseVO.PARAM_ERROR_FIELD_CODE]}</td>
					</tr>
                    <tr>
						<td style={{background: '#f7f7f7'}}>{uiStrings.STRING_USER_MESSAGE}</td>
                        <td style={{background: '#ffffff'}}>{props.exceptionDetails[FormBaseVO.PARAM_ERROR_FIELD_USER_MESSAGE]}</td>
					</tr>
                    <tr>
						<td style={{background: '#f7f7f7'}}>{uiStrings.STRING_ERROR_MESSAGE}</td>
                        <td style={{background: '#ffffff'}}>{props.exceptionDetails[FormBaseVO.PARAM_ERROR_FIELD_ERROR_MESSAGE]}</td>
					</tr>
                    
                </tbody>
            </Table>
            <br/>

        </div>
        
    );

};

const DisplayResponse = (props) => {

    if (utility.Utility.safeTrim(props.responseType) == utility.Utility.safeTrim(genericConstants.RESPONSE_RETURN_TYPE_SUCCESS) &&
        (utility.Utility.safeTrim(props.successMsg[FormBaseVO.PARAM_MESSAGE_FIELD_SUCCESS_MESSAGE]) != genericConstants.EMPTY_STRING) ){
        return <ResponseSuccess successMsg={props.successMsg} />;
    }
    else if (utility.Utility.safeTrim(props.responseType) == utility.Utility.safeTrim(genericConstants.RESPONSE_RETURN_TYPE_FALSE)){
        return <ResponseError errorMsg={props.errorMsg} />;
    }
    else if (utility.Utility.safeTrim(props.responseType) == utility.Utility.safeTrim(genericConstants.RESPONSE_RETURN_TYPE_ERROR)){
        return <ResponseException status={props.status} exceptionDetails={props.exceptionDetails} />;
    }
    else {
        //If no condition is met then null is required to return else this element will not work
        return null;
    }

};

class MessageHandler extends Component {

    constructor(props) {
        super(props);

    }


    render () {

        const {responseType, status, successMsg, errorMsg, exceptionDetails} = this.props;


        return (
           <DisplayResponse responseType={responseType} status={status} successMsg={successMsg} errorMsg={errorMsg} exceptionDetails={exceptionDetails} />
        );

    };

}

export default MessageHandler;