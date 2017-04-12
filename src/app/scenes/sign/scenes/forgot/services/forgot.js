export default {
  forgotPassword (email) {
    var promise = new Promise(resolve => {
      setTimeout(() => {
        resolve({
          data: {
          }
        });
      }, 1000);
    });

    // return axios.post('/authenticate', credentials)
    return promise;
  }
}
