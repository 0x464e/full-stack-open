import {useState} from "react";
import Authors from "./components/Authors";
import Books from "./components/Books";
import NewBook from "./components/NewBook";
import LoginForm from "./components/LoginForm.jsx";
import {useApolloClient, useSubscription} from "@apollo/client";
import Recommended from "./components/Recommended.jsx";
import {BOOK_ADDED} from "./queries.js";

const App = () => {
    const [page, setPage] = useState("authors");
    const [token, setToken] = useState(null);
    const client = useApolloClient();

    useSubscription(BOOK_ADDED, {
        onData: ({data}) => {
            const bookAdded = data.data.bookAdded;
            window.alert(`A new book was added!\nTitle: ${bookAdded.title}\nAuthor: ${bookAdded.author.name}`);
        }
    })

    const logout = () => {
        setPage("authors");
        setToken(null);
        localStorage.removeItem("library-user-token");
        client.resetStore();
    }

    return (
        <div>
            <div>
                <button onClick={() => setPage("authors")}>authors</button>
                <button onClick={() => setPage("books")}>books</button>
                {token ? <button onClick={() => setPage("add")}>add book</button> :
                    <button onClick={() => setPage("login")}>login</button>}
                {token && <button onClick={() => setPage("recommendations")}>recommendations</button>}
                {token && <button onClick={logout}>logout</button>}

            </div>

            <Authors show={page === "authors"}/>

            <Books show={page === "books"}/>

            <NewBook show={page === "add"}/>

            <Recommended show={page === "recommendations"}/>

            <LoginForm show={page === "login"} setToken={setToken} setPage={setPage}/>
        </div>
    );
};

export default App;
