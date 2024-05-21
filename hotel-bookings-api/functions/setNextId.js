const setNextId = (newElm, arr) => {
  newElm.id = arr.reduce((acc, elm) => (elm.id > acc ? elm.id : acc), 0) + 1;
};

export default setNextId;
