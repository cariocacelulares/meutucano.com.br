export default {
    authenticate (credentials) {
        console.log(credentials);
        return axios.post('/authenticate', credentials)
    }
}
