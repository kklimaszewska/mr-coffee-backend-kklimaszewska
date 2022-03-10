const Joi = require('joi');

function userExist (id, length, res) {
    if (!(id<length)) {
        res.status(404).render('error', {"Request": `users/${id}...`, "idNumber": `${id}`})
        return false;
    }
    return true;
}

function timeFormat(str) {
    const num = parseInt(str);
    if (num > 12) {
        return (num-12) + 'PM';
    }
return num + 'AM'
}

function displayDay(number) {
    if (number === 1) {
        return "monday";
    } else if (number === 2) {
        return "tuesday";
    } else if (number === 3) {
        return "wendsday";
    } else if (number === 4) {
        return "thursday";
    } else if (number === 5) {
        return "friday";
    } else if (number === 6) {
        return "saturday";
    } else {
        return "sunday";
    }
}

//input validation with joi (not use in 3B project)
function validateInput (input, schema) {
    
    const result = schema.validate(input);

    if (!(result.error == null)) {
        throw result.error;
    }
    return result.value;
}
//schema for users (not use in 3B project)
const schemaUsers = Joi.object().keys({
    firstname: Joi.string()
        .alphanum()
        .min(2)
        .max(30)
        .required(),

    lastname: Joi.string()
        .alphanum()
        .min(3)
        .max(30)
        .required(),

    email: Joi.string()
        .email()
        .required(),

    password: Joi.string()
        .min(8)
        .required(),
})
//schema for schedules (not use in 3B project)
const schemaSchedules = Joi.object().keys({
    user_id: Joi.number()
        .integer()
        .positive()
        .required(),

    day: Joi.number()
        .integer()
        .positive()
        .min(1)
        .max(7)
        .required(),

    start_at: Joi.string()
        .pattern(/^[1-9][A,P]M|1[0-2][A,P]M$/)
        .required(),

    end_at: Joi.string()
        .pattern(/^[1-9][A,P]M|1[0-2][A,P]M$/)
        .required(),
})

//send an error message with status (not use in 3B project)
function inputErrorMessage (err, res) {;
    if (err) {
        res.status(422).json({ error: err.details.map(i => i.message).join(',') }) 
    }
}

module.exports = {
    userExist: userExist,
    timeFormat: timeFormat,
    displayDay: displayDay,
    validateInput: validateInput,
    inputErrorMessage: inputErrorMessage,
    schemaUsers: schemaUsers,
    schemaSchedules:schemaSchedules};
