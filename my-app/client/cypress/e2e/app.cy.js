describe('ChatGPT Clone E2E Regression', () => {
  beforeEach(() => {
    cy.intercept('POST', 'http://localhost:5000/api/save_chat', (req) => {
      const { chat_id, role, parts } = req.body;
      const responseId = chat_id || 123;

      req.reply({
        statusCode: 200,
        body: {
          chat_id: responseId,
          history: [{ role, parts, timestamp: new Date().toISOString() }]
        }
      });
    }).as('saveChat');

    cy.intercept('GET', 'http://localhost:5000/api/history', {
      statusCode: 200,
      body: [{ chat_id: 123, parts: [{ text: 'Hello from Cypress' }], time: new Date().toISOString() }]
    }).as('historySummary');

    cy.intercept('GET', /http:\/\/localhost:5000\/api\/history\/\d+/, {
      statusCode: 200,
      body: [{ role: 'user', parts: [{ text: 'Hello from Cypress' }], timestamp: new Date().toISOString() }]
    }).as('historyDetail');

    cy.visit('/');
  });

  it('loads the app and shows the greeting', () => {
    cy.contains('How can I help you today?').should('be.visible');
  });

  it('composes and sends a prompt successfully', () => {
    const prompt = 'Hello from Cypress';

    cy.get('input[placeholder="Enter a prompt here"]').type(prompt);
    cy.get('img[alt="send"]').click();

    cy.wait('@saveChat');
    cy.wait('@historyDetail');

    cy.contains(`Mocked Gemini reply for: ${prompt}`, { timeout: 15000 }).should('be.visible');
  });
});