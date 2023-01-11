## 0.4

```mermaid
sequenceDiagram
    browser->>server: HTTP POST https://studies.cs.helsinki.fi/exampleapp/new_note
    note over browser: the posted data is<br>note=whatever_was_sent 
    server-->>browser: Status Code 302, redirected to https://studies.cs.helsinki.fi/exampleapp/notes
    browser->>server: HTTP GET https://studies.cs.helsinki.fi/exampleapp/notes
    server-->>browser: HTML-code
    browser->>server: HTTP GET https://studies.cs.helsinki.fi/exampleapp/main.css
    server-->>browser: main.css
    browser->>server: HTTP GET https://studies.cs.helsinki.fi/exampleapp/main.js
    server-->>browser: main.js

    note over browser: browser starts executing js-code<br>that requests JSON data from server 

    browser->>server: HTTP GET https://studies.cs.helsinki.fi/exampleapp/data.json
    server-->>browser: [{"content":"omnomnom","date":"2023-01-10
    browser->>server: HTTP GET https://studies.cs.helsinki.fi/favicon.ico
    server-->>browser: HTML-code
```

## 0.5

```mermaid
sequenceDiagram
    browser->>server: HTTP GET https://studies.cs.helsinki.fi/exampleapp/spa
    server-->>browser: HTML-code
    browser->>server: HTTP GET https://studies.cs.helsinki.fi/exampleapp/main.css
    server-->>browser: main.css
    browser->>server: HTTP GET https://studies.cs.helsinki.fi/exampleapp/spa.js
    server-->>browser: spa.js

    note over browser: browser starts executing js-code<br>that requests JSON data from server 

    browser->>server: HTTP GET https://studies.cs.helsinki.fi/exampleapp/data.json
    server-->>browser: [{"content":"omnomnom","date":"2023-01-10
    browser->>server: HTTP GET https://studies.cs.helsinki.fi/favicon.ico
    server-->>browser: HTML-code
```

## 0.6

```mermaid
sequenceDiagram
    note over browser: browser executes javascript code<br>and appends the created message<br>to the page
    browser->>server: HTTP POST https://studies.cs.helsinki.fi/exampleapp/new_note_spa
    note over browser: the posted data is<br>{"content":"test","date":"2023-01...
    server-->>browser: Status Code 201, {"message":"note created"}
```