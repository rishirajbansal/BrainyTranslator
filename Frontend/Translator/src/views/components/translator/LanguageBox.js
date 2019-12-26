/*
 * Licensed To: ThoughtExecution
 * Authored By: Rishi Raj Bansal
 * Developed in: December 2019
 *
*/

import React, { Component } from 'react';
import configs from '../../../generic/common/configManager';
import utility from '../../../generic/utilities/utility';
import businessConstants from '../../../generic/constants/businessConstants';
import genericConstants from '../../../generic/constants/genericConstants';
import uiStrings from '../../../stringsBundle/translator/uiStrings';

import Form from 'react-bootstrap/Form'
import Col from 'react-bootstrap/Col'


const ControlValues = (props) => {
    let languages = null;
    if (utility.Utility.safeTrim(props.langType) == businessConstants.LANG_TYPE_SRC) {
        languages = configs.config_objs.languages.srcLanguages;
    }
    else if(utility.Utility.safeTrim(props.langType) == businessConstants.LANG_TYPE_TGT){
        languages = configs.config_objs.languages.tgtLanguages;
    }

    const options = languages.map((lang, index) => {
        return (
            <option key = {index}>{lang}</option>
        );
    });

    return <Form.Control as="select" onChange={props.handleAllChanges} onBlur={props.handleAllBlur} 
                value={props.inputValueLanguage} 
                className={props.errors[props.id] ? "input error" : ""} >
                {options}
            </Form.Control>;
}

class LanguageBox extends Component {


    render() {
        const {id, langType, handleAllChanges, handleAllBlur, inputValueLanguage, errors} = this.props;

        const language_label = utility.Utility.safeTrim(langType) == businessConstants.LANG_TYPE_SRC ? uiStrings.LABEL_LNG_TYPE_SRC : uiStrings.LABEL_LNG_TYPE_TGT;

        return (
            <Form.Group as={Col} controlId={id}>
                <Form.Label>{language_label}</Form.Label>
                <ControlValues langType = {langType} id={id} errors={errors} 
                                inputValueLanguage={inputValueLanguage} 
                                handleAllChanges={handleAllChanges} handleAllBlur={handleAllBlur} />
                
                {errors[id] && (
                    <div className="invalid-feedback" style={{display:'block'}}>{errors[id]}</div>
                )}
            </Form.Group>
        );

    }

}

export default LanguageBox;