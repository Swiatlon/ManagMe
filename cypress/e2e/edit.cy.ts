describe('Edit Project Flow', () => {
  const originalProjectName = 'project';

  const updatedProjectName = 'project - updated';
  const updatedProjectDesc = 'Updated via Cypress';

  beforeEach(() => {
    cy.login('wiercik', 'wiercik');
  });

  it('should edit an existing project from the list', () => {
    cy.contains('[data-field="name"]', originalProjectName)
      .parents('[role="row"]')
      .within(() => {
        cy.get('[data-cy=edit-project]').click();
      });
    cy.wait(100)
    cy.get('[data-cy=name]').click().clear().type(updatedProjectName);
    // cy.get('[data-cy=name').type(updatedProjectName);
    // cy.get('[data-cy=description]').clear();

    // cy.contains('Update Project').click();

    // cy.contains(updatedProjectName).should('be.visible');
    // cy.contains(updatedProjectDesc).should('be.visible');
  });
});
