import {gql, useQuery} from '@apollo/client'
import {ALL_BOOKS, ME} from "../queries.js";
import {useEffect, useState} from "react";

const Recommended = (props) => {
    const booksResult = useQuery(ALL_BOOKS)
    const meResult = useQuery(ME, {skip: !props.show})

    if (!props.show) {
        return null
    }

    const books = booksResult.data.allBooks;
    const favoriteGenre = meResult.data.me.favoriteGenre;

    return (
        <div>
            <div>books in your favorite genre: {favoriteGenre}</div>

            <table>
                <tbody>
                <tr>
                    <th>title</th>
                    <th>author</th>
                    <th>published</th>
                </tr>
                {books.filter(x => x.genres.includes(favoriteGenre)).map((a) => (
                    <tr key={a.title}>
                        <td>{a.title}</td>
                        <td>{a.author.name}</td>
                        <td>{a.published}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    )
}

export default Recommended
