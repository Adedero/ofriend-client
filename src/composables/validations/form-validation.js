
export function validatePersonalUser(user) {
  let errors = [];
  let fields = ['name', 'birthday', 'gender', 'country', 'region', 'email', 'password', 'passwordRepeat', 'hasAgreedToTerms' ];

  fields.forEach(field => {
    if (!user[field]) {
      errors.push({
        field: field,
        message: `${field} is required`
      });
      return errors;
    }

    if (user.password !== user.passwordRepeat) {
      errors.push({
        field: 'password',
        message: 'Passwords do not match'
      });
      return errors;
    }
  })

  return errors;
}