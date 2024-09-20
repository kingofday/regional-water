const patterns = {
  nationalCode: /\d{10}/,
  email: /\S+@\S+\.\S+/,
  mobile: /09[0-9]{2}(-| )?[0-9]{3}(-| )?[0-9]{4}/,
  phone: /0\d{10}/,
  ip: /(?:[0-9]{1,3}\.){3}[0-9]{1,3}/,
  postalCode:/\d{10}/,
  url: /https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)/,
};
export default patterns;
