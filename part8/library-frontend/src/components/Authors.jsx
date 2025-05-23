import {gql, useQuery} from '@apollo/client'
import {ALL_AUTHORS} from "../queries.js";
import SetBirthYear from "./SetBirthYear.jsx";

const Authors = (props) => {

    const result = useQuery(ALL_AUTHORS);

    if (result.loading) return <div>loading...</div>;

    if (!props.show) {
        return null
    }

    const authors = result.data.allAuthors;

    return (
        <div>
            <h2>authors</h2>
            <table>
                <tbody>
                <tr>
                    <th>name</th>
                    <th>born</th>
                    <th>books</th>
                </tr>
                {authors.map((a) => (
                    <tr key={a.name}>
                        <td>{a.name}</td>
                        <td>{a.born}</td>
                        <td>{a.bookCount}</td>
                    </tr>
                ))}
                </tbody>
            </table>

            <SetBirthYear authors={authors.map(x => x.name)}/>
        </div>
    )
}

export default Authors
