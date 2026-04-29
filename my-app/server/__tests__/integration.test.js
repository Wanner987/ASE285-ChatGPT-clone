const fs = require('fs');
const path = require('path');

// Set test DB path before requiring server
process.env.DB_PATH = path.join(__dirname, '../data/chat_history.integration.db');

const request = require('supertest');
const { app, db } = require('../server');

const testDbPath = process.env.DB_PATH;

describe('Integration Tests - Full Chat Workflow', () => {
  beforeAll((done) => {
    // Wait for DB to be ready
    setTimeout(done, 100);
  });

  beforeEach((done) => {
    // Clear the database for each test
    db.run('DELETE FROM messages', (err) => {
      if (err) return done(err);
      done();
    });
  });

  afterAll((done) => {
    db.close((err) => {
      if (err) return done(err);
      if (fs.existsSync(testDbPath)) {
        fs.unlinkSync(testDbPath);
      }
      done();
    });
  });

  test('complete chat workflow: create, save, retrieve, delete', async () => {
    // 1. Save first message
    const save1 = await request(app)
      .post('/api/save_chat')
      .send({ chat_id: 100, role: 'user', parts: [{ text: 'Hello' }] })
      .expect(200);

    expect(save1.body.chat_id).toBe(100);
    expect(save1.body.history).toHaveLength(1);
    expect(save1.body.history[0].parts[0].text).toBe('Hello');

    // 2. Save second message in same chat
    const save2 = await request(app)
      .post('/api/save_chat')
      .send({ chat_id: 100, role: 'model', parts: [{ text: 'Hi there!' }] })
      .expect(200);

    expect(save2.body.chat_id).toBe(100);
    expect(save2.body.history).toHaveLength(2);
    expect(save2.body.history[0].role).toBe('user');
    expect(save2.body.history[1].role).toBe('model');

    // 3. Check history summary
    const history = await request(app).get('/api/history').expect(200);
    expect(history.body.length).toBeGreaterThanOrEqual(1);
    const chat = history.body.find(c => c.chat_id === 100);
    expect(chat).toBeDefined();
    expect(chat.parts[0].text).toBe('Hello');

    // 4. Retrieve full chat history
    const fullHistory = await request(app).get('/api/history/100').expect(200);
    // The API returns messages in chronological order, filtered to start with 'user' role
    expect(fullHistory.body.length).toBeGreaterThanOrEqual(1);
    expect(fullHistory.body[0].role).toBe('user');

    // 5. Delete the chat
    await request(app).delete('/api/history/100').expect(200);

    // 6. Verify deletion
    const historyAfterDelete = await request(app).get('/api/history').expect(200);
    const deletedChat = historyAfterDelete.body.find(c => c.chat_id === 100);
    expect(deletedChat).toBeUndefined();
  });

  test('handles multiple chats independently', async () => {
    // Create two separate chats
    await request(app)
      .post('/api/save_chat')
      .send({ chat_id: 200, role: 'user', parts: [{ text: 'Chat 1' }] });

    await request(app)
      .post('/api/save_chat')
      .send({ chat_id: 201, role: 'user', parts: [{ text: 'Chat 2' }] });

    const history = await request(app).get('/api/history').expect(200);
    expect(history.body.length).toBeGreaterThanOrEqual(2);

    // Retrieve each chat separately
    const chat200 = await request(app).get('/api/history/200').expect(200);
    expect(chat200.body[0].parts[0].text).toBe('Chat 1');

    const chat201 = await request(app).get('/api/history/201').expect(200);
    expect(chat201.body[0].parts[0].text).toBe('Chat 2');
  });

  test('error handling for invalid chat_id', async () => {
    const response = await request(app).get('/api/history/99999').expect(200);
    // Should return empty array for non-existent chat
    expect(response.body).toEqual([]);
  });
});