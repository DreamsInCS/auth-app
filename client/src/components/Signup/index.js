import React, { useState } from 'react'
import axios from 'axios';
import { useDispatch } from 'redux-react-hook'
import { withRouter } from 'react-router-dom'
import * as actions from '../../constants/action_types'
import * as routes from '../../constants/routes'

function Signup(props) {
    const dispatch = useDispatch()

    const [email, setEmail] = useState("")
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)

    const handleChange = setter => e => {
        setter(e.target.value)
    }

    const submit = async (e) => {
        e.preventDefault()
        setLoading(true)

        try {
            const requestBody = {
                query: `
                    mutation {
                        createUser(userInput: {
                        email: "${email}"
                        username: "${username}"
                        password: "${password}"
                        }) {
                            _id
                            token
                            email
                        }
                    }
                `
            }

            
            // retrieve result from server
            const { data } = 
                await axios.post('https://johncagetribute.org:5000/graphql', requestBody)
                // await axios.post('http://localhost:5000/graphql', requestBody)

            if (data.errors) {
                setError(data.errors[0].message)
                setLoading(false)
            }
            else {
                setError(null)
                setLoading(false)

                const { _id, token } = await data.data.createUser

                dispatch({
                    type: actions.SET_AUTH_USER,
                    authUser: {
                        _id,
                        email
                    }
                })

                localStorage.setItem('token', token)
                props.history.push(routes.HOME)
            }
        }
        catch (e) {
            setError(e)
            setLoading(false)
        }
    }

    return (
        <>
            <h1>Sign Up</h1>
            <div className="auth-form">
                <form onSubmit={submit}>
                    <input className="form-input"
                        type="email"
                        placeholder="Email"
                        onChange={handleChange(setEmail)}
                    />
                    <input className="form-input"
                        type="text"
                        placeholder="Username"
                        onChange={handleChange(setUsername)}
                    />
                    <input className="form-input"
                        type="password"
                        placeholder="Password"
                        onChange={handleChange(setPassword)}
                    />
                    <div>
                        <span style={{ color: "red" }}>{error || ""}</span>
                    </div>
                    <input className="form-submit"
                        type="submit"
                        value={loading ? "Creating..." : "Sign up"}
                    />
                </form>
            </div>
        </>
    )
}

export default withRouter(Signup)