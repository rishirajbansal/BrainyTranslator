/*
 * Licensed To: ThoughtExecution
 * Authored By: Rishi Raj Bansal
 * Developed in: December 2019
 *
*/

import React, { Component } from 'react';
import Form from 'react-bootstrap/Form'
import bsCustomFileInput from '../../../../static/js/bs-custom-file-input.js';
import ButtonToolBar from 'react-bootstrap/ButtonToolbar';
import Button from 'react-bootstrap/Button';
import * as Yup from 'yup';
import ReactLoading from 'react-loading';
import Alert from 'react-bootstrap/Alert';
import Spinner from 'react-bootstrap/Spinner';

import businessConstants from '../../../generic/constants/businessConstants';
//import viewConstants from '../../../controller/viewsHandler/viewsConstants';
import utility from '../../../generic/utilities/utility';
import genericConstants from '../../../generic/constants/genericConstants';
import uiStrings from '../../../stringsBundle/translator/uiStrings';
import errorMessages from '../../../stringsBundle/translator/errorMessages';
import APIHander from '../../../integration/apiTranslate/APIHandler';
import uriDirectory from '../../../integration/apiTranslate/constants/uriMapper';
import requestMethodsMapper from '../../../integration/apiTranslate/constants/requestMethodsMapper';

import FormBaseVO from '../../../controller/formVOs/FormBaseVO';
import FormTranslateVO from '../../../controller/formVOs/FormTranslateVO';

import LanguageBox from './LanguageBox';
import ModeTranslate from './ModeTranslate';
import MessageHandler from '../../commonComps/MessageHandler';


//Declare all Form variables that will be used in i) Yup validator ii) State
const srcLanguageSelecte_param = FormTranslateVO.PARAM_TRANSLATE_FIELD_LANGUAGE_SRC;
const tgtLanguageSelecte_param = FormTranslateVO.PARAM_TRANSLATE_FIELD_LANGUAGE_TGT;
const mode_param = FormTranslateVO.PARAM_TRANSLATE_FIELD_MODE;
const srcText_param = FormTranslateVO.PARAM_TRANSLATE_FIELD_TEXT_TO_TRANS;
const tgtText_param = FormTranslateVO.PARAM_TRANSLATE_FIELD_RESULTS_TEXT;
const srcFile_param = FormTranslateVO.PARAM_TRANSLATE_FIELD_FILE_TO_TRANS;

const validationsSchema = Yup.object().shape({
    [srcLanguageSelecte_param]: Yup.string().required(errorMessages.ERR_MSG_TRANSLATE_SRC_LNG_REQUIRED).matches(/^((?!Select).)*$/, {message: errorMessages.ERR_MSG_TRANSLATE_TGT_LNG_SELECT}),
    [tgtLanguageSelecte_param]: Yup.string().required(errorMessages.ERR_MSG_TRANSLATE_TGT_LNG_REQUIRED).matches(/^((?!Select).)*$/, {message: errorMessages.ERR_MSG_TRANSLATE_TGT_LNG_SELECT}),
    [srcText_param]: Yup.string().required(errorMessages.ERR_MSG_TRANSLATE_SRC_TEXT),
    [mode_param]: Yup.string().required(errorMessages.ERR_MSG_TRANSLATE_SELECT_MODE),
    [srcFile_param]: Yup.string().required(errorMessages.ERR_MSG_TRANSLATE_SRC_FILE).nullable(),
    
});


class TranslatorForm extends Component {

    constructor(props) {
        super(props);
         
        const formTranslateVO = new FormTranslateVO();
        const formBaseAttrs = formTranslateVO.formBaseAttrs;
        const formTranslateAttrs = formTranslateVO.formTranslateAttrs;

        const stateObj = {};

        Object.keys(formBaseAttrs).forEach(key => {
            stateObj[key] = formBaseAttrs[key];
        });
        Object.keys(formTranslateAttrs).forEach(key => {
            stateObj[key] = formTranslateAttrs[key];
        });
        
        stateObj[FormBaseVO.FORM_ATTR_SUBMIT_ERROR] = formTranslateVO.submitErrorAttrs;
        stateObj[FormBaseVO.FORM_ATTR_SUBMIT_SUCCESS_MESSAGE] = formTranslateVO.submitSuccessMessageAttrs;
        stateObj[FormBaseVO.FORM_ATTR_SUBMIT_ERROR_MESSAGE] = formTranslateVO.submitErrorMessageAttrs;

        this.initialState = stateObj;
        this.initialState['fileOptionControlStyleDisplay'] = false;
        this.initialState['textOptionControlStyleDisplay'] = false;

        this.initialState['errors'] = {};
        this.initialState['loading'] = false;

        this.state = this.initialState;
    }

    //Handle the translation mode - remove error that is not based on the selected mode
    toggleModeError = (currentErrors) => {
        if (this.state.hasOwnProperty(mode_param)){
            if (this.state[mode_param] == businessConstants.MODE_TRANSLATE_FILE){
                if (currentErrors.hasOwnProperty(srcText_param)) {
                    delete currentErrors[srcText_param];
                }
            }
            else if (this.state[mode_param] == businessConstants.MODE_TRANSLATE_TEXT){
                if (currentErrors.hasOwnProperty(srcFile_param)) {
                    delete currentErrors[srcFile_param];
                }
            }
            this.setState({
                errors : currentErrors
            });
        }
    }

    //Handling toggling of translation Mode radio buttons
    handleTranslateOptionsChange = (event, mode) => {
        if (mode == businessConstants.MODE_TRANSLATE_FILE){
            this.setState({
                fileOptionControlStyleDisplay: true,
                textOptionControlStyleDisplay: false
            });
        }
        else{
            this.setState({
                fileOptionControlStyleDisplay: false,
                textOptionControlStyleDisplay: true
            });
        }
        this.handleAllChanges(event);
    }

    handleAllBlur = (event) => {

        const { id, value } = event.target;
        let errorOccurred = false;

        validationsSchema.validate(this.state, {abortEarly: false}).catch(validationErrors => {
            errorOccurred = true;
            if (validationErrors.inner != null){
                let clearError = true;
                let errorsUpdated = this.state.errors;
                for (let i in validationErrors.inner){
                    if (validationErrors.inner[i].path == id){
                        errorsUpdated[validationErrors.inner[i].path] = validationErrors.inner[i].errors[0];
                        clearError = false;
                    }
                }
                if (clearError){
                    delete errorsUpdated[id];
                }
                this.setState({
                    errors : errorsUpdated
                });
            }
        });

        //Allow Yup to validate the schema else it will directly come here
        setTimeout(() => {
            if (!errorOccurred){
                let errorsUpdated = this.state.errors;
                errorsUpdated[id] = '';
                
                //This is the case when there is no error has left and last validation is removed and thats why it will not into Yup validation
                delete errorsUpdated[id];
                this.setState({
                    errors : errorsUpdated
                });
            }
        }, 200);

    }

    handleAllChanges = (event) => {
        const { id, value, files } = event.target;
        let inputValue;

        inputValue = files && files[0] ? files[0] : value;

        this.setState({
            [id] : inputValue
        });

        /* id field is read-only and cannot be changed */
        //Mode Field Id Handling
        if ((utility.Utility.safeTrim(id) == FormTranslateVO.PARAM_TRANSLATE_FIELD_MODE_ID_FILE) ||
            (utility.Utility.safeTrim(id) == FormTranslateVO.PARAM_TRANSLATE_FIELD_MODE_ID_TEXT) ){
            this.setState({
                [FormTranslateVO.PARAM_TRANSLATE_FIELD_MODE] : value
            });
            //Handle errors
            let errorsUpdated = this.state.errors;
            if (errorsUpdated[FormTranslateVO.PARAM_TRANSLATE_FIELD_MODE] != null){
                delete errorsUpdated[FormTranslateVO.PARAM_TRANSLATE_FIELD_MODE];
                this.setState({
                    errors : errorsUpdated
                });
            }
            //Handle the translation mode - remove error that is not based on the selected mode
            let currentErrors = this.state.errors;
            this.toggleModeError(currentErrors);
        }
        
    }    

    componentDidMount() {
        //Initialize 'bs-input-file-input' to load the required classes otherwise file control will not display filename
        bsCustomFileInput.init();
    }

    onFormReset = () => {
        
        this.setState(this.initialState);
    }

    onFormSubmit = async (event) => {
        event.preventDefault();

        this.setState({
            loading : true,
        });

        //Allow Yup to validate the schema else it will directly come here - await is used for this purpose
        await validationsSchema.validate(this.state, {abortEarly: false}).catch(validationErrors => {
            if (validationErrors){
                if (validationErrors.inner != null){
                    let validationErrorsCol = {};
                    for (let i in validationErrors.inner){
                        validationErrorsCol[validationErrors.inner[i].path] = validationErrors.inner[i].errors[0];
                    }
                    this.setState({
                        errors : validationErrorsCol
                    });
                }

                //Handle the translation mode - remove error that is not based on the selected mode
                let currentErrors = this.state.errors;
                this.toggleModeError(currentErrors);
            }
        });


        if (this.state.errors != null && Object.keys(this.state.errors).length > 0 ){
            this.setState({
                loading : false,
            });
            //this is needed to re-init customfileinput when the validation error occur on submit button
            bsCustomFileInput.init();
            return;
        }


        //Code for testing loader
        /* setTimeout( (event) => {
           
            sleep = (milliseconds) => {
                return new Promise((resolve) => setTimeout(resolve, 20000));
              };
        }, 100000); */


        //Call REST layer to send request to server via Axios
        this.state[FormBaseVO.PARAM_BASE_FIELD_REQUEST_METHOD] = requestMethodsMapper.TRANSLATE_TRANSLATE;
        let requestData = this.state;
        //console.log(requestData);
        let apiHandler = new APIHander(uriDirectory.API_URI_TRANSLATE, requestData, null);
        let isFilePresent = false;
        if (this.state[mode_param] == businessConstants.MODE_TRANSLATE_FILE){
            isFilePresent = true;
        }
        await apiHandler.handleApiRequest(isFilePresent, APIHander.AXIOS_RESPONSE_TYPE_DEFAULT);
        //console.log(requestData);

        //Check the response and redirect accordingly
        let responseStatus = requestData[FormBaseVO.PARAM_BASE_FIELD_STATUS];
        let responseType = requestData[FormBaseVO.PARAM_FIELD_RESPONSE_TYPE]
        if (utility.Utility.safeTrim(responseStatus) == "200" && utility.Utility.safeTrim(responseType) == genericConstants.RESPONSE_RETURN_TYPE_SUCCESS){
            this.props.handleSubmit(this.state);
            this.setState(this.initialState);
        }
        else{
            this.setState(requestData);
            this.setState({
                loading : false,
            });
            //this is needed to re-init customfileinput when the validation error occur on submit button
            bsCustomFileInput.init();
            return;
        }
        
        //Allow Yup to validate the schema else it will directly come here
        /* setTimeout( async (event) => {
            if (this.state.errors != null && Object.keys(this.state.errors).length > 0 ){
                return;
            }
          
        }, 400); */
        
    }

    render() {

        const {transInputControlStyleDisplay, transOutputControlStyleDisplay} = this.props;

        const languageSrcId = FormTranslateVO.PARAM_TRANSLATE_FIELD_LANGUAGE_SRC;
        const languageTgtId = FormTranslateVO.PARAM_TRANSLATE_FIELD_LANGUAGE_TGT;

        const transInputControlStyle = transInputControlStyleDisplay ? {display: 'block'} : {display: 'none'};
        //const transOutputControlStyle = transOutputControlStyleDisplay ? {display: 'block'} : {display: 'none'};

        const errors = this.state.errors;
        
        const successMsg = this.state[FormBaseVO.FORM_ATTR_SUBMIT_SUCCESS_MESSAGE];
        const errorMsg = this.state[FormBaseVO.FORM_ATTR_SUBMIT_ERROR_MESSAGE];
        const exceptionDetails = this.state[FormBaseVO.FORM_ATTR_SUBMIT_ERROR];
        
        // Conditional Rendering if the loading is true
        if (this.state['loading']){
            return (
                <div style={{marginTop: '100px'}}>
                    <Alert variant="info">
                        <br/><br/>
                        <h5 style={{color: '#dc3545', textAlign: 'center'}}>
                            {uiStrings.MESSAGE_LOADING}
                        </h5>
                        <br/><br/>
                        <div className="text-center" >
                            <Spinner animation="border" variant="danger" style={{width: '3rem', height: '3rem'}}/>
                        </div>
                        <br/><br/><br/><br/>
                    </Alert>

                    {/* Commenting js react loading lib and using react bootstrap spinner */}
                    {/* <ReactLoading type={'balls'} color={'#007bff'} height={'20%'} width={'20%'} delay={0} /> */}
                    
                </div>
                
            );
        }
        else{

            return (

                <Form onSubmit={this.onFormSubmit} onReset={this.onFormReset} noValidate>
    
                    {/* Handle errors and messages */}
                    <MessageHandler responseType={this.state[FormTranslateVO.PARAM_FIELD_RESPONSE_TYPE]} status={this.state[FormTranslateVO.PARAM_BASE_FIELD_STATUS]} 
                                    successMsg={successMsg} errorMsg={errorMsg} exceptionDetails={exceptionDetails} />
    
                    <div id="transInput" style={transInputControlStyle}>
                        <Form.Row>
                            <LanguageBox langType={businessConstants.LANG_TYPE_SRC} id={languageSrcId} 
                                            inputValueLanguage={this.state[FormTranslateVO.PARAM_TRANSLATE_FIELD_LANGUAGE_SRC]} 
                                            handleAllChanges={this.handleAllChanges} handleAllBlur={this.handleAllBlur} 
                                            errors= {errors} />
                            <LanguageBox langType={businessConstants.LANG_TYPE_TGT} id={languageTgtId} 
                                            inputValueLanguage={this.state[FormTranslateVO.PARAM_TRANSLATE_FIELD_LANGUAGE_TGT]} 
                                            handleAllChanges={this.handleAllChanges} handleAllBlur={this.handleAllBlur} 
                                            errors= {errors} />
                        </Form.Row>
    
                        <ModeTranslate handleChangeEvents={this.props.handleChangeEvents} handleAllChanges={this.handleAllChanges} handleAllBlur={this.handleAllBlur} 
                                       inputValueTranslateText={this.state[FormTranslateVO.PARAM_TRANSLATE_FIELD_TEXT_TO_TRANS]} 
                                       handleTranslateOptionsChange={this.handleTranslateOptionsChange} 
                                       fileOptionControlStyleDisplay={this.state.fileOptionControlStyleDisplay} textOptionControlStyleDisplay={this.state.textOptionControlStyleDisplay} 
                                       errors= {errors} />
                        
                        <ButtonToolBar style={{marginTop:'20px', float: 'right'}}>
                            <p>
                                <Button variant="secondary" type="reset" style={{marginRight:'10px'}}>Reset</Button>
                                <Button variant="primary" type="submit">Submit</Button>
                            </p>
                        </ButtonToolBar>
                   
                    </div>
    
                    {/* <div id="transOutput" style={transOutputControlStyle}>
                        <PostTransalation translationResultStyleDisplay={translationResultStyleDisplay} fileResultControlStyleDisplay={fileResultControlStyleDisplay} 
                                            textResultControlStyleDisplay={textResultControlStyleDisplay} 
                                            translateForm={translateForm} handleNewTranslation={handleNewTranslation} />
                    </div> */}
    
                </Form>
    
            );
        }

        
    }

}

export default TranslatorForm;