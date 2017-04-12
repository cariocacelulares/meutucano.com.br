export default {
  get () {
    var promise = new Promise(resolve => {
      setTimeout(() => {
        resolve({
          data: {
            user: {
              email: 'cleiton@souza.com',
              name: 'cleiton'
            }
          }
        });
      }, 1000);
    });

    return promise;
    // return axios.post('/authenticate', credentials)
  }
}
