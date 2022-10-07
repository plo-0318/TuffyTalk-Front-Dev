export const usernameValidateArr = [
  {
    validate: (username) => username.trim().length >= 3,
    msg: 'Username should contain at least 3 characters',
  },
  {
    validate: (username) => username.trim().length <= 20,
    msg: 'Username cannot exceed 20 characters',
  },
];

// /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
export const emailValidateArr = [
  {
    validate: (email) =>
      email
        .toLowerCase()
        .match(
          /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i
        ),
    msg: 'Invalid email format',
  },
];
export const passwordValidateArr = [
  {
    validate: (password) => password.trim().length >= 8,
    msg: 'Password should contain at least 8 characters',
  },
  {
    validate: (password) => password.trim().length <= 128,
    msg: 'Password cannot exceed 128 characters',
  },
  {
    validate: (password) => {
      const containsChar = /[a-zA-Z]/.test(password);
      const containsNum = /\d/.test(password);

      return containsChar && containsNum;
    },
    msg: 'Password needs to contain at least 1 character and at least 1 number',
  },
];
