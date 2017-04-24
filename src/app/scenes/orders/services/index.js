export default {
  test () {
    var promise = new Promise(resolve => {
      setTimeout(() => {
        resolve({
          data: {
          }
        });
      }, 1000);
    });

    return promise;
  }
}
