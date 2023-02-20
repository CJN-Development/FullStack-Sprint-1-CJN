/**
 * Sprint One Full Stack Development 
 * 
 * Group: Cameron, Jordan, Nathan 
 * 
 * Semester: Winter 2023 
 * 
 */

// Installed Modules 
const{ format } = require ('date-fns');

const {v4: uuid} = require ('uuid');

// Node Common Core Stuff 

const fs = require('fs');
const fsPromises = require('fs').promises;
const path = require ('path');


//  Defining the log event
const logEvents = async (event, level,message) =>{
    const dateTime = `${format(new Date(), 'yyyyMMdd\tHH:mm:ss')}`;
const logItem = `${dateTime}\t${level}\t${event}\t${message}\t${uuid()}`;
if(DEBUG) console.log(logItem);

try{
    if(!fs.existsSync(path.join(__dirname, 'logs'))){
        await fsPromises.mkdir(path.join(__dirname, 'logs'));
    }

    const fileName = `${format(new Date(), 'yyyyMMdd')}` + '_events.log';

    await fsPromises.appendFile(path.join(__dirname, 'logs', fileName), logItem + '\n');

} catch(err){
    console.log(err)
}

}

module.exports = logEvents;

