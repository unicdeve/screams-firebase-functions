const isEmpty = string => {
  if (string.trim() === '') return true;
  return false;
};

const isEmail = email => {
  const regEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (email.match(regEx)) return true;
  return false;
};

exports.validateSignupData = data => {
  let errors = {};

  if (isEmpty(data.email)) {
    errors.email = 'Email field can not be empty';
  } else if (!isEmail(data.email)) {
    errors.email = 'Please provide a valid email';
  }

  if (isEmpty(data.password)) errors.password = 'Password can not be empty';

  if (isEmpty(data.handle)) errors.handle = 'Handle field can not be empty';

  if (data.password != data.confirmPassword)
    errors.confirmPassword = 'Password and confirm password must match!';

  return {
    errors,
    valid: Object.keys(errors).length === 0 ? true : false
  };
};

exports.validateLoginData = data => {
  let errors = {};

  if (isEmpty(data.email)) errors.email = 'Please enter your email address.';
  if (isEmpty(data.password)) errors.password = 'Please enter your password.';

  return {
    errors,
    valid: Object.keys(errors).length === 0 ? true : false
  };
};
