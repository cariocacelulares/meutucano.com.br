export default {
  authenticate (credentials) {
    var promise = new Promise(resolve => {
      setTimeout(() => {
        resolve({
          data: {
            token: 'dasdasd32d32c23c343'
          }
        });
      }, 1000);
    });

    // return axios.post('/authenticate', credentials)
    return promise;
  }
}
