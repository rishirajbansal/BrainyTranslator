/*
 * Licensed To: ThoughtExecution
 * Authored By: Rishi Raj Bansal
 * Developed in: November 2019
 *
*/

const path = require('path');

class Utility {

    static safeTrim(str) {
		
		if (typeof str == 'undefined' || !str || str.length === 0 || str === "" || !/[^\s]/.test(str) || /^\s*$/.test(str) || str.replace(/\s/g,"") === ""){
			return "";
		}
		else{
			return str.trim();
		}
	}

}

export default {
    Utility
}