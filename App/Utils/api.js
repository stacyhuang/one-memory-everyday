var api = {
  getMemories() {
    var url = `https://one-memory-everyday.firebaseio.com/.json`;
    return fetch(url).then((res) => res.json());
  },

  addMemory(memory) {
    var url = `https://one-memory-everyday.firebaseio.com/.json`;
    return fetch(url, {
      method: 'post',
      body: JSON.stringify(memory)
    }).then((res) => res.json());
  }
};

module.exports = api;
