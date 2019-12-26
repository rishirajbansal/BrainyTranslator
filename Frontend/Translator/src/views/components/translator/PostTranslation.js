/*
 * Licensed To: ThoughtExecution
 * Authored By: Rishi Raj Bansal
 * Developed in: December 2019
 *
*/

import React, { Component } from 'react';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ButtonToolBar from 'react-bootstrap/ButtonToolbar';
import Button from 'react-bootstrap/Button';

import MessageHandler from '../../commonComps/MessageHandler';
import requestMethodsMapper from '../../../integration/apiTranslate/constants/requestMethodsMapper';
import APIHander from '../../../integration/apiTranslate/APIHandler';
import uriDirectory from '../../../integration/apiTranslate/constants/uriMapper';
import utility from '../../../generic/utilities/utility';

import uiStrings from '../../../stringsBundle/translator/uiStrings';
import businessConstants from '../../../generic/constants/businessConstants';
//import viewConstants from '../../../controller/viewsHandler/viewsConstants';

import FormBaseVO from '../../../controller/formVOs/FormBaseVO';
import FormTranslateVO from '../../../controller/formVOs/FormTranslateVO';


class PostTranslation extends Component {
    
    handleDownload = async (event, translateForm) => {

        //Call REST layer to send request to server via Axios
        translateForm[FormBaseVO.PARAM_BASE_FIELD_REQUEST_METHOD] = requestMethodsMapper.TRANSLATE_TRANSLATE_DOWNLOAD;
        translateForm[FormTranslateVO.PARAM_TRANSLATE_FIELD_MODE] = businessConstants.MODE_TRANSLATE_DOWNLOAD;
        let requestData = translateForm;
        const downloadObj = {
            'isDownload' : true,
            'fileName' : translateForm[FormTranslateVO.PARAM_TRANSLATE_FIELD_RESULTS_FILE],
        };

        let apiHandler = new APIHander(uriDirectory.API_URI_TRANSLATE, requestData, downloadObj);
       
        await apiHandler.handleApiRequest(false, APIHander.AXIOS_RESPONSE_TYPE_DEFAULT);

        //Check the response and redirect accordingly
        let responseStatus = requestData[FormBaseVO.PARAM_BASE_FIELD_STATUS];  
        if (utility.Utility.safeTrim(responseStatus) == "200"){
            //Do Nothing

        }
        else{
            this.setState(requestData);
            return;
        }

    };


    render () {

        const {translationResultStyleDisplay, fileResultControlStyleDisplay, textResultControlStyleDisplay} = this.props;
        const {translateForm} = this.props;
        const {handleNewTranslation} = this.props;

        const successMsg = translateForm[FormBaseVO.FORM_ATTR_SUBMIT_SUCCESS_MESSAGE];
        const errorMsg = translateForm[FormBaseVO.FORM_ATTR_SUBMIT_ERROR_MESSAGE];
        const exceptionDetails = translateForm[FormBaseVO.FORM_ATTR_SUBMIT_ERROR];

        let processingTime = translateForm[FormTranslateVO.PARAM_TRANSLATE_FIELD_PROCESS_TIME];
        //Normal concatenation using + is not working in JSX, so using workaround to append string
        if (processingTime){
            processingTime = processingTime + uiStrings.STRING_MILLISECOND;
        }

        let amount = translateForm[FormTranslateVO.PARAM_TRANSLATE_FIELD_AMOUNT];
        if (amount){
            amount = uiStrings.STRING_USD + amount;
        }

        const translationResultControlStyle = translationResultStyleDisplay ? {display: 'block'} : {display: 'none'};
        const fileResultControlStyle = fileResultControlStyleDisplay ? {display: 'block'} : {display: 'none'};
        const textResultControlStyle = textResultControlStyleDisplay ? {display: 'block'} : {display: 'none'};

        return (
            <fieldset>
                                
                <div className="" style={translationResultControlStyle}>

                    {/* Handle errors and messages */}
                    <MessageHandler responseType={translateForm[FormTranslateVO.PARAM_FIELD_RESPONSE_TYPE]} status={translateForm[FormTranslateVO.PARAM_BASE_FIELD_STATUS]} 
                                successMsg={successMsg} errorMsg={errorMsg} exceptionDetails={exceptionDetails} />

                    <ButtonToolBar style={{marginTop:'10px', marginBottom:'10px', float: 'right'}}>
                        <Button variant="primary" type="button" onClick={handleNewTranslation}>New Translation</Button>
                    </ButtonToolBar>

                    <br/><br/>

                    <Form.Group as={Row} style={{marginTop:'10px'}}>
                        <Form.Label column sm={3}><h6>{uiStrings.LABEL_LNG_TYPE_SRC}:</h6></Form.Label>
                        <Col sm={7}>
                            <Form.Control plaintext readOnly defaultValue={translateForm[FormTranslateVO.PARAM_TRANSLATE_FIELD_LANGUAGE_SRC]} />
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row}>
                        <Form.Label column sm={3}><h6>{uiStrings.LABEL_LNG_TYPE_TGT}:</h6></Form.Label>
                        <Col sm={7}>
                            <Form.Control plaintext readOnly defaultValue={translateForm[FormTranslateVO.PARAM_TRANSLATE_FIELD_LANGUAGE_TGT]} />
                        </Col>
                    </Form.Group>

                    <Form.Group as={Row}>
                        <Form.Label column sm={3}><h6>{uiStrings.LABEL_TRANSLATE_RESULT_AMOUNT}:</h6></Form.Label>
                        <Col sm={7}>
                            <Form.Control plaintext readOnly defaultValue={amount} />
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row}>
                        <Form.Label column sm={3}><h6>{uiStrings.LABEL_TRANSLATE_RESULT_PROCESS_TIME}:</h6></Form.Label>
                        <Col sm={7}>
                            <Form.Control plaintext readOnly defaultValue={processingTime} />
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row}>
                        <Form.Label column sm={3}><h6>{uiStrings.LABEL_TRANSLATE_RESULT_TOTAL_BYTES}:</h6></Form.Label>
                        <Col sm={7}>
                            <Form.Control plaintext readOnly defaultValue={translateForm[FormTranslateVO.PARAM_TRANSLATE_FIELD_TOTAL_BYTES]} />
                        </Col>
                    </Form.Group>

                    {/* File Control */}
                    <Form.Row style={fileResultControlStyle}>
                        <Form.Group as={Col}>
                            <Button variant="primary" type="button" block 
                                    onClick={(event) => this.handleDownload(event, translateForm)}>
                                {uiStrings.LABEL_TRANSLATE_RESULT_FILE}
                            </Button>
                        </Form.Group>
                    </Form.Row>

                    {/* Text Control */}
                    <div style={textResultControlStyle}>
                        <Form.Row>
                            <Form.Group as={Col}>
                                <Form.Label><h6>{uiStrings.LABEL_TRANSLATE_RESULT_SRC_TEXT}</h6></Form.Label>
                                <Form.Control as="textarea" rows="10" placeholder="" readOnly value={translateForm[FormTranslateVO.PARAM_TRANSLATE_FIELD_TEXT_TO_TRANS]} />
                            </Form.Group>
                        </Form.Row>
                        <Form.Row>
                            <Form.Group as={Col}>
                                <Form.Label><h6>{uiStrings.LABEL_TRANSLATE_RESULT_TEXT}</h6></Form.Label>
                                <Form.Control className="border border-primary rounded" as="textarea" rows="10" placeholder="" readOnly value={translateForm[FormTranslateVO.PARAM_TRANSLATE_FIELD_RESULTS_TEXT]} />
                            </Form.Group>
                        </Form.Row>
                    </div>

                </div>
            </fieldset>

        );
    }

}


export default PostTranslation;