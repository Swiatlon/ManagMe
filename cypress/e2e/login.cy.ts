describe('Login Page', () => {
  it('should login with correct credentials', () => {
    cy.login('wiercik', 'wiercik');
    cy.url().should('include', '/postAuth');
  });
});
