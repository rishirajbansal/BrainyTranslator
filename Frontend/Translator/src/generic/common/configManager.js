/*
 * Licensed To: ThoughtExecution
 * Authored By: Rishi Raj Bansal
 * Developed in: November 2019
 *
*/

const path = require('path');

//const db_conf = require(path.join(__dirname, '../../configs/database.conf.json'));

const cmn_conf = require('../../appconfigs/common.conf.json');

//const msg_conf = require('../../configs/messages.conf.json');

//const config_objs = require('../../appconfigs/config-objs');

import config_objs from '../../appconfigs/config-objs';


export default {
    //db_conf,
    cmn_conf,
    //msg_conf,
    config_objs
}