import chalk from 'chalk'
import moment from 'moment'

const err_symb = (() => process.platform === "win32" ? 'X' : '✘')();

module.exports = {

    date: (lDate, _format = "     {kk:mm:ss|DD/MM/YY}") => {
        if (lDate == '\0')
            console.log(`${moment().format(_format)}\n`);
        if (lDate instanceof Date)
            console.log(`${moment(lDate).format(_format)}\n`);
    },

    success: () => {

    },

    error: (err_object, err_details) => {
        /** @param {String} msg */
        let printErrorMessage = msg =>
            console.log(`${chalk.redBright('   ✘ Error ')} ${chalk.blue(msg)}`);

        /** @param {[String]} objArray */
        let printObject = objArray => {
            let outStr = "";
            for (let i = 0; i < objArray.length; i++) {
                let sep = '│';
                if (i == 0) sep = '┌'
                if (i == (objArray.length - 1)) sep = '└'
                outStr += `   ${chalk.yellow(sep)} ${objArray[i].trim()}\n`;
            }
            console.log(outStr);
        }
        /** @param {Error} errObj */
        let printErrorObject = errObj => {
            printErrorMessage(errObj.message)
            let objArray = errObj.stack.split('\n');
            objArray.shift();
            printObject(objArray);
        }

        if (typeof err_object == "string") {
            printErrorMessage(err_object);
            if (err_details instanceof Object) {
                let pObj = JSON.stringify(err_details, null, 2).split('\n');
                pObj.shift(); pObj.pop();
                printObject(pObj);
            } else if (typeof err_details == "string")
                printObject(err_details.split('\n'));
        }

        else if (err_object instanceof Error)
            printErrorObject(err_object)

        else if (err_object instanceof Array && typeof err_object[0] == "string") {
            printErrorMessage(err_object[0]);
            if (typeof err_object[1] == "string")
                printObject(err_object[1].split('\n'))
            if (err_object[1] instanceof Error)
                printErrorObject(err_object[1])
            else if (err_object[1] instanceof Array)
                printObject(err_object[1]);
            else if (err_object[1] instanceof Object) {
                let pObj = JSON.stringify(err_object[1], null, 2);
                pObj.shift(); pObj.pop();
                printObject(pObj);
            }
        }
    }
}