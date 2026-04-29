const fs = require('fs');
const path = require('path');

process.env.DB_PATH = path.join(__dirname, '../data/chat_history.regression.db');

const request = require('supertest');
const { app, db, ready } = require('../server');

const testDbPath = process.env.DB_PATH;

describe('Server Regression Tests', () => {
  beforeAll(async () => {
    await ready;
  });

  beforeEach((done) => {
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

  test('saves chat messages and returns chat history', async () => {
    const saveResponse = await request(app)
      .post('/api/save_chat')
      .send({ chat_id: 500, role: 'user', parts: [{ text: 'Regression test' }] })
      .expect(200);

    expect(saveResponse.body.chat_id).toBe(500);
    expect(saveResponse.body.history).toHaveLength(1);
    expect(saveResponse.body.history[0].parts[0].text).toBe('Regression test');
  });

  test('returns history summary and chat detail', async () => {
    await request(app)
      .post('/api/save_chat')
      .send({ chat_id: 501, role: 'user', parts: [{ text: 'First message' }] });

    const summaryResponse = await request(app).get('/api/history').expect(200);
    expect(summaryResponse.body.find(c => c.chat_id === 501)).toBeDefined();

    const detailResponse = await request(app).get('/api/history/501').expect(200);
    expect(detailResponse.body[0].role).toBe('user');
    expect(detailResponse.body[0].parts[0].text).toBe('First message');
  });

  test('deletes a chat and clears history', async () => {
    await request(app)
      .post('/api/save_chat')
      .send({ chat_id: 502, role: 'user', parts: [{ text: 'Delete me' }] });

    await request(app).delete('/api/history/502').expect(200);

    const response = await request(app).get('/api/history').expect(200);
    expect(response.body.find(c => c.chat_id === 502)).toBeUndefined();
  });
});
