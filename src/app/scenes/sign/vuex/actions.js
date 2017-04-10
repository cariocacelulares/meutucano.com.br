import * as types from './types'
import { Sign } from '../services'

export default {

    [types.ON_LOGIN] (context, request) {
        const credentials = {
            email: request.email,
            password: request.password
        }

        return Sign.authenticate(credentials).then(response => {
            context.commit(types.TOKEN, response.data.token)
            // context.dispatch(types.FETCH_USER)
        })
    }

}
