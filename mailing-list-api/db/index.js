module.exports = (() => {
  let _database = {
    staff: ["talea@techtonica.org", "michelle@techtonica.org"],
    "cohort-h1-2020": [
      "ali@techtonica.org",
      "humail@techtonica.org",
      "khadar@techtonica.org",
    ],
  };
  return {
    fetchLists: () => {
      return Object.keys(_database);
    },
    update: (newData) => {
      _database = newData;
    },
    updateList: (name, newList) => {
      _database[name] = newList;
    },
    fetchList: (name) => {
      return _database[name];
    },
    deleteList: (name) => {
      delete _database[name];
    },
  };
})();
