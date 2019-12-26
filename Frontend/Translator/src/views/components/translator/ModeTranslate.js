/*
 * Licensed To: ThoughtExecution
 * Authored By: Rishi Raj Bansal
 * Developed in: December 2019
 *
*/

import React, { Component } from 'react';
import Form from 'react-bootstrap/Form'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

import businessConstants from '../../../generic/constants/businessConstants';
import uiStrings from '../../../stringsBundle/translator/uiStrings';
//import viewConstants from '../../../controller/viewsHandler/viewsConstants';
import viewsConstants from '../../../controller/viewsHandler/viewsConstants';

import FormTranslateVO from '../../../controller/formVOs/FormTranslateVO';


class ModeTranslate extends Component {

    constructor(props) {
        super(props);

    }

    render() {

        const fileOptionControlStyle = this.props.fileOptionControlStyleDisplay ? {display: 'block'} : {display: 'none'};
        const textOptionControlStyle = this.props.textOptionControlStyleDisplay ? {display: 'block'} : {display: 'none'}

        const {errors} = this.props;

        return (
            <fieldset className={errors[FormTranslateVO.PARAM_TRANSLATE_FIELD_MODE] ? "error-border" : ""} >
                <Form.Row>
                    <Form.Group as={Col}>
                        <Form.Check custom type="radio" label={uiStrings.LABEL_TRANSLATE_MODE_TRANS_FILE} name={viewsConstants.PARAM_TRANSLATE_FIELD_MODE} 
                                    id={viewsConstants.PARAM_TRANSLATE_FIELD_MODE_ID_FILE} value={businessConstants.MODE_TRANSLATE_FILE} 
                                    onChange={(event) => this.props.handleTranslateOptionsChange(event, businessConstants.MODE_TRANSLATE_FILE)} 
                                    onClick={(event) => this.props.handleTranslateOptionsChange(event, businessConstants.MODE_TRANSLATE_FILE)} 
                                    checked={this.props.fileOptionControlStyleDisplay} 
                                    className={errors[FormTranslateVO.PARAM_TRANSLATE_FIELD_MODE] ? "input error" : ""} />
                    </Form.Group>
                </Form.Row>
                <Form.Row style={fileOptionControlStyle}>
                    <Form.Group as={Col}>
                        <div className="custom-file">
                            <Form.Control type="file" className="custom-file-input" 
                                        id={viewsConstants.PARAM_TRANSLATE_FIELD_FILE_TO_TRANS} 
                                        onChange={this.props.handleAllChanges} onBlur={this.props.handleAllBlur}  />
                            <Form.Label className={errors[FormTranslateVO.PARAM_TRANSLATE_FIELD_FILE_TO_TRANS] ? "input error custom-file-label" : "custom-file-label"}>
                                {uiStrings.LABEL_TRANSLATE_FILE_CHOOSE}
                            </Form.Label>
                        </div>
                        {errors[FormTranslateVO.PARAM_TRANSLATE_FIELD_FILE_TO_TRANS] && (
                            <div className="invalid-feedback" style={{display:'block'}}>{errors[FormTranslateVO.PARAM_TRANSLATE_FIELD_FILE_TO_TRANS]}</div>
                        )}
                    </Form.Group>
                </Form.Row>
                <Form.Row>
                    <Form.Group as={Col}>
                        <Form.Check custom type="radio" label={uiStrings.LABEL_TRANSLATE_MODE_TRANS_TEXT} name={viewsConstants.PARAM_TRANSLATE_FIELD_MODE} 
                                    id={viewsConstants.PARAM_TRANSLATE_FIELD_MODE_ID_TEXT} value={businessConstants.MODE_TRANSLATE_TEXT} 
                                    onChange={(event) => this.props.handleTranslateOptionsChange(event, businessConstants.MODE_TRANSLATE_TEXT)} 
                                    onClick={(event) => this.props.handleTranslateOptionsChange(event, businessConstants.MODE_TRANSLATE_TEXT)} 
                                    checked={this.props.textOptionControlStyleDisplay} 
                                    className={errors[FormTranslateVO.PARAM_TRANSLATE_FIELD_MODE] ? "input error" : ""} />
                            {errors[FormTranslateVO.PARAM_TRANSLATE_FIELD_MODE] && (
                                <div className="invalid-feedback" style={{display:'block'}}>{errors[FormTranslateVO.PARAM_TRANSLATE_FIELD_MODE]}</div>
                            )}
                    </Form.Group>
                </Form.Row>
                <Form.Row style={textOptionControlStyle}>
                    <Form.Group as={Col}>
                        <Form.Control as="textarea" rows="10" id={FormTranslateVO.PARAM_TRANSLATE_FIELD_TEXT_TO_TRANS}
                                    value={this.props.inputValueTranslateText} 
                                    onChange={this.props.handleAllChanges} onBlur={this.props.handleAllBlur} 
                                    className={errors[FormTranslateVO.PARAM_TRANSLATE_FIELD_TEXT_TO_TRANS] ? "input error" : ""}
                                    placeholder={uiStrings.LABEL_TRANSLATE_TEXT_ENTER} >
                        </Form.Control>
                        {errors[FormTranslateVO.PARAM_TRANSLATE_FIELD_TEXT_TO_TRANS] && (
                                <div className="invalid-feedback" style={{display:'block'}}>{errors[FormTranslateVO.PARAM_TRANSLATE_FIELD_TEXT_TO_TRANS]}</div>
                            )}
                    </Form.Group>
                </Form.Row>
            </fieldset>

        );

    }

}

export default ModeTranslate;