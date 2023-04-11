const { update } = require("./index.js");

const resetDB = () => {
  update({
    staff: ["talea@techtonica.org", "michelle@techtonica.org"],
    "cohort-h1-2020": [
      "ali@techtonica.org",
      "humail@techtonica.org",
      "khadar@techtonica.org",
    ],
  });
};

module.exports = { resetDB };
