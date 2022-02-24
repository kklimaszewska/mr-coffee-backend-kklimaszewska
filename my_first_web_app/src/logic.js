const Joi = require('joi');

function userExist (id, length, res) {
    if (!(id<length)) {
        res.status(404).json({"error": `There is no user with this id number: ${id}.`})
        return;
    }
}


//input validation with joi
function validateInput (input, schema) {
    
    const result = schema.validate(input);

    if (!(result.error == null)) {
        throw result.error;
    }
    return result.value;
}
//schema for users
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
//schema for schedules
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

//send an error message with status
function inputErrorMessage (err, res) {;
    if (err) {
        res.status(422).json({ error: err.details.map(i => i.message).join(',') }) 
    }
}

module.exports = {  userExist: userExist,
                    validateInput: validateInput,
                    inputErrorMessage: inputErrorMessage,
                    schemaUsers: schemaUsers,
                    schemaSchedules:schemaSchedules};
