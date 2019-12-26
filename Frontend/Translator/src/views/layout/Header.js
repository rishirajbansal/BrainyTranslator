/*
 * Licensed To: ThoughtExecution
 * Authored By: Rishi Raj Bansal
 * Developed in: November 2019
 *
*/

import React, { Component } from 'react';
import Navbar from 'react-bootstrap/Navbar'

class Header extends Component {

    render() {
        return (

            <Navbar bg="dark" variant="dark">
                <Navbar.Brand href="#home">
                    <img
                        alt="Brainy Translator"
                        src="../static/images/logo.png"
                        width="80"
                        height="30"
                        className="d-inline-block align-top"
                    />{' '}
                    Brainy Translator
                </Navbar.Brand>
            </Navbar>

        );
    }

}

export default Header;