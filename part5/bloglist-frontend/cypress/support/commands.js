// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

Cypress.Commands.add('resetDb', () => {
    cy.request('POST', `${Cypress.env('BACKEND_URL')}/api/testing/reset`);
});

Cypress.Commands.add('login', ({ username, password }) => {
    cy.request('POST', `${Cypress.env('BACKEND_URL')}/api/login`, {
        username, password
    }).then(({ body }) => {
        localStorage.setItem('loggedInUser', JSON.stringify(body));
        cy.visit('');
    });
});

Cypress.Commands.add('createTestUser', (index = '') => {
    const user = {
        name: `Test User ${index}`,
        password: 'password',
        username: `testuser${index}`
    };

    cy.request('POST', `${Cypress.env('BACKEND_URL')}/api/users`, user);
});

Cypress.Commands.add('createBlog', (blog) => {
    cy.request({
        url: `${Cypress.env('BACKEND_URL')}/api/blogs`,
        method: 'POST',
        body: blog,
        headers: {
            Authorization: `bearer ${JSON.parse(localStorage.getItem('loggedInUser')).token}`
        }
    });

    cy.visit('');
});
