/*
 * Licensed To: ThoughtExecution
 * Authored By: Rishi Raj Bansal
 * Developed in: November 2019
 *
*/

const path = require('path');

import axios from 'axios';

//import configs from '../../generic/common/configManager';
import genConsts from '../../generic/constants/genericConstants';


//As this is constant, so axios instance will be created once only
const axiosInstance = axios.create(
    
    {
        baseURL: process.env.API_URL,
        timeout: process.env.AXIOS_TIMEOUT,
        //headers: {'X-Requested-With': 'XMLHttpRequest'},
    }

);

export default axiosInstance;