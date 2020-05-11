import { useEffect } from 'react'
import { useDispatch } from 'redux-react-hook'
import axios from 'axios'
import * as actions from '../../constants/action_types'

function useWithAuthenticate() {
    const dispatch = useDispatch()

    useEffect(() => {
        authenticate(dispatch)
    }, [authenticate])
}

async function authenticate(dispatch) {
    const token = localStorage.getItem('token')

    if (!!token) {
        try {
            const requestBody = {
                query: `
                    query {
                        verifyToken(token: "${token}") {
                            _id,
                            email
                        }
                    }
                `
            }

            const { data } = 
                await axios.post('https://johncagetribute.org:5000/graphql', requestBody)

            const user = await data.data.verifyToken

            if (user) {
                dispatch({
                    type: actions.SET_AUTH_USER,
                    authUser: {
                        _id: user._id,
                        email: user.email
                    }
                })
            }
            else {
                dispatch({ type: actions.SET_AUTH_USER, authUser: null })
                localStorage.removeItem('token')
            }
        }
        catch (e) {
            dispatch({ type: actions.SET_AUTH_USER, authUser: null })
        }
    }
    else {
        
        dispatch({ type: actions.SET_AUTH_USER, authUser: null })
    }
}

export default useWithAuthenticate