export default {

    authenticate (credentials) {
        return axios.post('/authenticate', credentials)
    }

}
