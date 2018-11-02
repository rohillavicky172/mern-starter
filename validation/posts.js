const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validatePostInput(data) {
    console.log(data)
    let errors = {};

 
    data.text = !isEmpty(data.text) ? data.text : '';
 

    if(!Validator.isLength(data.text,{min:10,max:300})){
        errors.text ='Post must be at least 10 and not more 3000';
    }

    if (Validator.isEmpty(data.text)) {
        errors.text = 'Text feild is Required';
    }


  




    return {
        errors,
        isValid: isEmpty(errors)
    }
}