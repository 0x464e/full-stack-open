import {LOGIN} from "../queries.js";
import {gql, useMutation} from '@apollo/client'
import {useEffect, useState} from "react";

const LoginForm = ({setToken, setPage, show}) => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    const [login, result] = useMutation(LOGIN, {
        onError: (error) => {
            console.log(error)
        }
    })

    useEffect(() => {
        if (result.data?.login) {
            const token = result.data.login.value
            setToken(token)
            setPage('authors')
            localStorage.setItem('library-user-token', token)
        }
    }, [result.data, setToken, setPage]);

    if (!show) {
        return null
    }


    const submit = async (event) => {
        event.preventDefault()

        login({variables: {username, password}})


        setUsername('')
        setPassword('')
    }

    return (
        <form onSubmit={submit}>
            <div>
                username
                <input
                    value={username}
                    onChange={({target}) => setUsername(target.value)}
                />
            </div>
            <div>
                password
                <input
                    type='password'
                    value={password}
                    onChange={({target}) => setPassword(target.value)}
                />
            </div>
            <button type='submit'>login</button>
        </form>
    )
}

export default LoginForm;
