import { test, expect } from '@playwright/test';
import { newPost } from '../test-data/posts';

test.describe('API Testing', () => {

  test('GET post returns correct data', async ({ request }) => {

    const response = await request.get('/posts/1');

    expect(response.status()).toBe(200);

    const body = await response.json();

    expect(body.id).toBe(1);
    expect(body.userId).toBe(1);
    expect(body.title).toBeTruthy();

  });


  test('POST creates a new post', async ({ request }) => {

    const response = await request.post('/posts', {
      data: newPost
    });

    expect(response.status()).toBe(201);

    const body = await response.json();

    expect(body.title).toBe(newPost.title);
    expect(body.body).toBe(newPost.body);
    expect(body.userId).toBe(newPost.userId);

  });


  test('GET sends custom header', async ({ request }) => {

    const response = await request.get(
      'https://httpbin.org/headers',
      {
        headers: {
          'X-Test-User': 'Noe'
        }
      }
    );

    expect(response.status()).toBe(200);

    const body = await response.json();

    expect(body.headers['X-Test-User']).toBe('Noe');

  });


  test('Bearer authentication returns 200', async ({ request }) => {

    const apiToken = process.env.API_TOKEN;

    if (!apiToken) {
      throw new Error('API_TOKEN environment variable is required');
    }

    const response = await request.get(
      'https://httpbin.org/bearer',
      {
        headers: {
          Authorization: `Bearer ${apiToken}`
        }
      }
    );

    expect(response.status()).toBe(200);

    const body = await response.json();

    expect(body.authenticated).toBe(true);
    expect(body.token).toBe(apiToken);

  });


  test('Bearer authentication without token returns 401', async ({ request }) => {

    const response = await request.get(
      'https://httpbin.org/bearer'
    );

    expect(response.status()).toBe(401);

  });

});