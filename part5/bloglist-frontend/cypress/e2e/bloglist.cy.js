describe('Blog app', function () {
    beforeEach(function () {
        cy.resetDb();
        cy.createTestUser();
        cy.visit('');
    });

    it('Login form is shown', function () {
        cy.contains('log in to application');
        cy.contains('username');
        cy.contains('password');
        cy.contains('login');
    });

    describe('Login', function () {
        it('succeeds with correct credentials', function () {
            cy.get('#username').type('testuser');
            cy.get('#password').type('password');
            cy.get('#login').click();
            cy.contains('Test User logged in');
        });

        it('fails with wrong credentials', function () {
            cy.get('#username').type('testuser');
            cy.get('#password').type('wrong');
            cy.get('#login').click();
            cy.contains('Wrong username or password');
        });
    });

    describe('When logged in', function () {
        beforeEach(function () {
            cy.login({ username: 'testuser', password: 'password' });
        });

        it('A blog can be created', function () {
            cy.contains('new blog').click();
            cy.get('#title').type('Test Blog');
            cy.get('#author').type('Test Author');
            cy.get('#url').type('test.com');
            cy.get('#submit').click();
            cy.contains('Test Blog');
        });

        describe('and a blog exists', function () {
            beforeEach(function () {
                cy.createBlog({
                    title: 'Test Blog',
                    author: 'Test Author',
                    url: 'test.com'
                });
            });

            it('it can be liked', function () {
                cy.contains('view').click();
                cy.contains('0 likes');
                cy.contains('like').click();
                cy.contains('1 likes');
            });

            it('it can be deleted', function () {
                cy.contains('view').click();
                cy.contains('remove').click();
                cy.get('html').should('not.contain', 'Test Blog');
            });
        });
    });

    describe('When multiple blogs exist', function () {
        beforeEach(function () {
            cy.createTestUser(2);
            cy.login({ username: 'testuser', password: 'password' });
            cy.createBlog({
                title: 'Test Blog',
                author: 'Test Author',
                url: 'test.com',
                likes: 5
            });
            cy.createBlog({
                title: 'Test Blog 2',
                author: 'Test Author 2',
                url: 'test2.com',
                likes: 16
            });
            cy.login({ username: 'testuser2', password: 'password' });
            cy.createBlog({
                title: 'Test Blog 3',
                author: 'Test Author 3',
                url: 'test3.com',
                likes: 15
            });
        });

        it('and one isn\'t created by the logged in user, it can\'t be deleted', function () {
            cy.contains('Test Blog 3').parent().as('foreignBlog');
            cy.get('@foreignBlog').contains('view').click();
            cy.get('@foreignBlog').should('not.contain', 'remove');
        });

        it('they are ordered by likes', function () {
            cy.get('.blog').then(blogs => {
                cy.wrap(blogs[0]).contains('Test Blog 2');
                cy.wrap(blogs[1]).contains('Test Blog 3');
                cy.wrap(blogs[2]).contains('Test Blog');
            });
        });
    });
});