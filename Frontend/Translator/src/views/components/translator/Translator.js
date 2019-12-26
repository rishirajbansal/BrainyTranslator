/*
 * Licensed To: ThoughtExecution
 * Authored By: Rishi Raj Bansal
 * Developed in: November 2019
 *
*/

import React, { Component } from 'react';
import Container from 'react-bootstrap/Container';
import bsCustomFileInput from '../../../../static/js/bs-custom-file-input.js';

import axiosManager from '../../../integration/apiTranslate/APIHandler';
//import viewConstants from '../../../controller/viewsHandler/viewsConstants';
import businessConstants from '../../../generic/constants/businessConstants';
import utility from '../../../generic/utilities/utility';

import FormTranslateVO from '../../../controller/formVOs/FormTranslateVO';

import TranslatorForm from './TranslatorForm';
import PostTransalation from './PostTranslation';

class Translator extends Component {

    constructor(props) {
        super(props);       

        this.initialState = {
            translateForm: {},
            transInputControlStyleDisplay: true,
            transOutputControlStyleDisplay: false,
            translationResultStyleDisplay: false,
            fileResultControlStyleDisplay: false,
            textResultControlStyleDisplay: false,
            reRenderKey: Date.now(),
        }

        this.state = this.initialState;
    }

    handleNewTranslation = (event) => {
        //This key logic is required as to re-render the TranslationForm as to initialize the form so that 'bs-custom-input-file' can reloaded
        this.initialState['reRenderKey'] = Date.now();
        this.state = this.initialState;
        this.setState(this.state);
    }

    handleSubmit = (formValues) => {

        this.setState({
            transInputControlStyleDisplay: false,
            transOutputControlStyleDisplay: true,
            translateForm: formValues
        });
        
        if (utility.Utility.safeTrim(formValues[FormTranslateVO.PARAM_TRANSLATE_FIELD_MODE]) == businessConstants.MODE_TRANSLATE_FILE){
            this.setState({
                translationResultStyleDisplay: true,
                fileResultControlStyleDisplay: true,
                textResultControlStyleDisplay: false
            });
        }
        else  if (utility.Utility.safeTrim(formValues[FormTranslateVO.PARAM_TRANSLATE_FIELD_MODE]) == businessConstants.MODE_TRANSLATE_TEXT){
            this.setState({
                translationResultStyleDisplay: true,
                fileResultControlStyleDisplay: false,
                textResultControlStyleDisplay: true
            });
        }

        //Destroy the 'bs input file input' data as it was showing the file name in file box
        bsCustomFileInput.destroy();
    }

    render() {

        const {transInputControlStyleDisplay, transOutputControlStyleDisplay} = this.state;
        const {translationResultStyleDisplay, fileResultControlStyleDisplay, textResultControlStyleDisplay} = this.state; 
        const {translateForm, reRenderKey} = this.state;

        return (
            <Container>
                <TranslatorForm handleChangeEvents={this.handleChangeEvents} 
                                transInputControlStyleDisplay={transInputControlStyleDisplay} transOutputControlStyleDisplay={transOutputControlStyleDisplay} 
                                translationResultStyleDisplay={translationResultStyleDisplay} fileResultControlStyleDisplay={fileResultControlStyleDisplay} textResultControlStyleDisplay={textResultControlStyleDisplay} 
                                translateForm={translateForm} 
                                handleSubmit={this.handleSubmit}
                                handleNewTranslation={this.handleNewTranslation}
                                key={reRenderKey}  />
                
                <PostTransalation translationResultStyleDisplay={translationResultStyleDisplay} fileResultControlStyleDisplay={fileResultControlStyleDisplay} 
                                    textResultControlStyleDisplay={textResultControlStyleDisplay} 
                                    translateForm={translateForm} handleNewTranslation={this.handleNewTranslation} />
            </Container>
        );

    }

}

export default Translator;