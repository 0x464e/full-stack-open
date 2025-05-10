import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";

import {
    ApolloClient,
    ApolloProvider,
    createHttpLink,
    InMemoryCache,
    split
} from '@apollo/client'
import {setContext} from "@apollo/client/link/context";

import {getMainDefinition} from '@apollo/client/utilities'
import {GraphQLWsLink} from '@apollo/client/link/subscriptions'
import {createClient} from 'graphql-ws'


const authLink = setContext((_, {headers}) => {
    const token = localStorage.getItem('library-user-token');
    return {
        headers: {
            ...headers,
            authorization: token ? `Bearer ${token}` : null,
        }
    }
})

const client = new ApolloClient({
    uri: 'http://localhost:4000',
    cache: new InMemoryCache(),
    link: split(
        ({query}) => {
            const definition = getMainDefinition(query)
            return (
                definition.kind === 'OperationDefinition' &&
                definition.operation === 'subscription'
            )
        },
        new GraphQLWsLink(
            createClient({url: 'ws://localhost:4000'})
        ),
        authLink.concat(createHttpLink({
            uri: 'http://localhost:4000',
        }))
    )
})


ReactDOM.createRoot(document.getElementById("root")).render(
    <ApolloProvider client={client}>
        <React.StrictMode>
            <App/>
        </React.StrictMode>
    </ApolloProvider>
)
;
