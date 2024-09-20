const config = {
  apiUrl: process.env.REACT_APP_BASE_API_URL,
  token: process.env.REACT_APP_TOKEN,
  requestTimeout: 120000,
  salt: "kingofday",
  siteKey: "6Ld235ElAAAAALNW9-mwq5FygW9I8CV5XvMMDkcp",
  //secretKey: "6Ld235ElAAAAANOniJMe3z9WCmfsWP6NQpBBLZcj",
  breakpoints: {
    xs: 576,
    md: 768,
    lg: 992,
    xl:1200,
    xxl:1366
  },
  reportEndPoints: [{
    type: "discord",
    url: "https://discord.com/api/webhooks/1052568631646621817/WlQNNb6cf348BOQwH4DJ48IMsOiTV3rtAqUiYtzt30Ad4tWRj3t1__klbDC4g0hsslOg",
  }
  ],
};
export default config;
