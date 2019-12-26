/*
 * Licensed To: ThoughtExecution
 * Authored By: Rishi Raj Bansal
 * Developed in: November 2019
 *
*/

import React, { Component } from 'react';
import Header from '../layout/Header';
import Footer from '../layout/Footer';
import Translator from '../components/translator/Translator';

import Container from 'react-bootstrap/Container';

class App extends Component {

    render(){
        return (

            <div >

                <Header />

                <main className="app">
                    <Translator />
                </main>

                <Footer />

            </div>
    
        );
    }

}

export default App;
