const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateProfileInput(data) {
    console.log(data)
    let errors = {};


    data.handle = !isEmpty(data.handle) ? data.handle : '';
    data.status = !isEmpty(data.status) ? data.status : '';
    data.skills = !isEmpty(data.skills) ? data.skills : '';



    if (!Validator.isLength(data.handle, {
            min: 2,
            max: 40
        })) {
        errors.handle = 'Handle needs to between 2 and 4 characters';
    }


    if (Validator.isEmpty(data.handle)) {
        errors.handle = 'Handle Required';
    }


    if (Validator.isEmpty(data.status)) {
        errors.status = 'Status Required';
    }

    if (Validator.isEmpty(data.skills)) {
        errors.skills = 'Skills Required';
    }


    if(!isEmpty(data.website)){
        if(!Validator.isURL(data.website)){
            errors.website = 'Website Url is Not Valid';
        }
    }

    if(!isEmpty(data.youtube)){
        if(!Validator.isURL(data.youtube)){
            errors.youtube = 'Youtube Url is Not Valid';
        }
    }
    if(!isEmpty(data.twitter)){
        if(!Validator.isURL(data.twitter)){
            errors.twitter = 'Twitter Url is Not Valid';
        }
    }
    if(!isEmpty(data.linkedin)){
        if(!Validator.isURL(data.linkedin)){
            errors.linkedin = 'Linkedin Url is Not Valid';
        }
    }
    if(!isEmpty(data.facebook)){
        if(!Validator.isURL(data.facebook)){
            errors.facebook = 'Facebook Url is Not Valid';
        }
    }
    if(!isEmpty(data.instagram)){
        if(!Validator.isURL(data.instagram)){
            errors.instagram = 'Instagram Url is Not Valid';
        }
    }

    return {
        errors,
        isValid: isEmpty(errors)
    }
}