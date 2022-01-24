module.exports.getDate = function () {
  let today = new Date();
  const currentDay = today.getDay();

  let option = {
    weekday: "long",
    day: "numeric",
    month: "long",
  };

  let day = today.toLocaleDateString("en-US", option);

  return day;
};

module.exports.getDay = function () {
  let today = new Date();
  const currentDay = today.getDay();

  let option = {
    weekday: "long",
  };

  let day = today.toLocaleDateString("en-US", option);

  return day;
};
