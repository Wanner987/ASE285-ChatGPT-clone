const fs = require('fs');
const path = require('path');

process.env.DB_PATH = path.join(__dirname, '../data/chat_history.test.db');

const request = require('supertest');
const { app, db } = require('../server');

const testDbPath = process.env.DB_PATH;

describe('Server API', () => {
  afterAll((done) => {
    db.close((err) => {
      if (err) return done(err);
      if (fs.existsSync(testDbPath)) {
        fs.unlinkSync(testDbPath);
      }
      done();
    });
  });

  test('saves chat history and returns it', async () => {
    const response = await request(app)
      .post('/api/save_chat')
      .send({ chat_id: 1, role: 'user', parts: [{ text: 'Hello world' }] })
      .expect(200);

    expect(response.body.chat_id).toBe(1);
    expect(response.body.history).toHaveLength(1);
    expect(response.body.history[0].parts[0].text).toBe('Hello world');
  });

  test('retrieves chat history summary', async () => {
    const response = await request(app).get('/api/history').expect(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body[0].chat_id).toBe(1);
  });

  test('retrieves full chat history by ID', async () => {
    const response = await request(app).get('/api/history/1').expect(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body[0].parts[0].text).toBe('Hello world');
  });

  test('deletes a specific chat by ID', async () => {
    const response = await request(app).delete('/api/history/1').expect(200);
    expect(response.body.deletedCount).toBeGreaterThanOrEqual(1);
  });
});
