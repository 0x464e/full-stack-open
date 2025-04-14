import {useState} from "react";
import {useMutation, gql} from "@apollo/client";
import {ALL_AUTHORS, EDIT_AUTHOR} from "../queries.js";


const SetBirthYear = ({authors}) => {

    const [name, setName] = useState('')
    const [born, setBorn] = useState('')

    const [editAuthor] = useMutation(EDIT_AUTHOR);


    const submit = async (event) => {
        event.preventDefault()

        console.log('update author...')

        await editAuthor({
            variables: {name, setBornTo: Number(born)},
            refetchQueries: [{query: ALL_AUTHORS}]
        })

        setName('')
        setBorn('')
    }

    return <>
        <h2>Set birthyear</h2>
        <form onSubmit={submit}>
            <div>
                name
                <select
                    value={name}
                    onChange={({target}) => setName(target.value)}
                >
                    <option value="" disabled>Select author</option>
                    {authors.map((author) => (
                        <option key={author} value={author}>
                            {author}
                        </option>
                    ))}
                </select>
            </div>
            <div>
                born
                <input
                    value={born}
                    onChange={({target}) => setBorn(target.value)}
                />
            </div>
            <button type="submit">update author</button>
        </form>
    </>

}

export default SetBirthYear;
