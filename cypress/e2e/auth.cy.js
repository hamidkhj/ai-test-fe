const { v4: uuidv4 } = require('uuid');

describe('User Registration', () => {
  let user;

  before(() => {
    const uuid = uuidv4().replace(/-/g, '');
    user = {
      name: 'Cypress Doe',
      email: `Cypress${uuid}@example.com`,
      password: 'StrongPass123!',
    };
  });

  function login(email, password) {
    cy.visit('/login');
    cy.get('input[name="email"]').type(email);
    cy.get('input[name="password"]').type(password);
    cy.get('button[type="submit"]').click();
  }

  function confirmSuccesfulLogin() {
    cy.contains('span', 'Welcome')
      .should('contain.text', user.name);
  }

  it('should register a new user', () => {
    cy.visit('/register');

    cy.get('input[name="name"]').type(user.name);
    cy.get('input[name="email"]').type(user.email);
    cy.get('input[name="password"]').type(user.password);
    cy.get('button[type="submit"]').click();

    confirmSuccesfulLogin
  });

  //this currently times out when running headlessly from commandline - would investigate
  it('should login with the registered user', () => {
    login(user.email, user.password)
    confirmSuccesfulLogin();
  });

  //this currently times out when running headlessly from commandline - would investigate
  it('should logout', () => {
    login(user.email, user.password)
    confirmSuccesfulLogin();
    cy.contains('button', 'Logout').click();

    cy.contains('h2', 'Shift Manager Login')
      .should('be.visible');
  });

  it('Attempt login with incorrect account', () => {
    login('incorrect@example.com', 'incorrect');

    cy.contains('div.text-center', 'User does not exist')
      .should('be.visible');
  });

  it('Attempt login with invalid email', () => {
    login('incorrect', 'incorrect');

    //This checks the login button is still there - Not quite sure how to check the content of the popup that comes up. This is where I would ask questions and pick dev brain about it - What kind of element is this? Where does it live? To understand better where to look given collaboration
    cy.get('button[type="submit"]')
      .should('be.visible');
  });

});