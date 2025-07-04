describe('Create Project, Story, and Task (Split Flow)', () => {
  const projectName = `project`;
  const projectDesc = 'E2E project description';

  const storyName = 'story';
  const storyDesc = 'Story created via Cypress E2E test';

  const taskName = 'task';
  const taskDesc = 'Task created via Cypress test';

  beforeEach(() => {
    cy.login('wiercik', 'wiercik');
  });

  it('should create a new project and store its name', () => {
    cy.contains('Add Project').click();
    cy.get('[data-cy=name]').type(projectName);
    cy.get('[data-cy=description]').type(projectDesc);
    cy.contains('Create Project').click();
    cy.contains(projectName).should('be.visible');

  });

  it('should create a story in the previously created project', function () {

    cy.get('[data-cy=stories]').click();
    cy.get('[data-cy=project-filter]').click();
    cy.contains('li', projectName).click();

    cy.contains('Add Story').click();
    cy.get('[data-cy=story-name]').type(storyName);
    cy.get('[data-cy=story-description]').type(storyDesc);
    cy.get('[data-cy=story-priority]').click();
    cy.contains('li', 'Medium Priority').click();
    cy.get('[data-cy=story-status-form]').first().click();
    cy.contains('li', 'Todo').click();
    cy.get('[data-cy=story-project]').click();
    cy.contains('li', projectName).click();
    cy.get('[data-cy=create-story]').click();
    cy.contains(storyName).should('be.visible');

  });

it.only('should create a task inside the previously created story', function () {
  cy.get('[data-cy=tasks]').click();
  cy.contains('Add Task').click();

  cy.get('[data-cy=task-name]').type(taskName);
  cy.get('[data-cy=task-description]').type(taskDesc);

  cy.get('[data-cy=task-priority]').click();
  cy.contains('li', 'Medium').click();

  cy.get('[data-cy=task-story]').click();
  cy.get(`[data-cy=${storyName}]`).first().click();

  cy.get('[data-cy=task-estimated-hours]').clear().type('5');

  cy.get('[data-cy=task-assigned-user]').click();
  cy.get('[data-cy=task-assigned-user-item]').first().click();

  cy.get('[data-cy=task-status]').click();
  cy.contains('li', 'To Do').click();

  cy.get('[data-cy=create-task]').click();

  cy.contains(taskName).should('be.visible');
});
});
