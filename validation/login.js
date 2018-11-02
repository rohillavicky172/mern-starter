const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateLoginInput(data) {
    console.log(data)
    let errors = {};

 
    data.email = !isEmpty(data.email) ? data.email : '';
    data.password = !isEmpty(data.password) ? data.password : '';
   

 
  
    if (!Validator.isEmail(data.email)) {
        errors.Email = 'Email is inValid';
    }

    if (Validator.isEmpty(data.email)) {
        errors.Email = 'Email  is Required';
    }


    if (Validator.isEmpty(data.password)) {
        errors.password = 'Password is Required';
    }

  




    return {
        errors,
        isValid: isEmpty(errors)
    }
}