import {gql, useQuery} from '@apollo/client'
import {ALL_BOOKS} from "../queries.js";
import {useState} from "react";

const Books = (props) => {
    const result = useQuery(ALL_BOOKS)
    const [selectedGenre, setSelectedGenre] = useState("ALL_GENRES");

    if (!props.show) {
        return null
    }

    const books = result.data.allBooks;
    const genres = [...new Set(books.map(x => x.genres).flat()), "ALL_GENRES"];

    return (
        <div>
            <h2>books</h2>

            <table>
                <tbody>
                <tr>
                    <th>title</th>
                    <th>author</th>
                    <th>published</th>
                </tr>
                {books.filter(x => selectedGenre === "ALL_GENRES" || x.genres.includes(selectedGenre)).map((a) => (
                    <tr key={a.title}>
                        <td>{a.title}</td>
                        <td>{a.author.name}</td>
                        <td>{a.published}</td>
                    </tr>
                ))}
                </tbody>
            </table>

            {genres.map(x => (
                <button
                    key={x}
                    onClick={() => {
                        setSelectedGenre(x);
                    }}
                >
                    {x}
                </button>))}
        </div>
    )
}

export default Books
