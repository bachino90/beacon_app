$(document).ready(function() {
  $('#signupForm').bootstrapValidator({
    fields: {
      email: {
        validators: {
          notEmpty: {
            message: 'The email is required and cannot be empty'
          },
          emailAddress: {
            message: 'The input is not a valid email address'
          }
        }
      },
      password: {
        validators: {
          notEmpty: {
            message: 'The password is required and cannot be empty'
          },
          stringLength: {
            min: 7,
            message: 'The password must be more than 7 characters long'
          }
        }
      }
    }
  });
});
