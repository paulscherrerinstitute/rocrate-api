import { readFileSync } from 'fs';
import path from 'path';
import { API_KEY, BASE_URL } from './env';
import { zipResource } from './utils';

describe('Validate endpoint', () => {
  const endpoint = `${BASE_URL}/validate`;

  test('should return 200 with a valid PSI publication (ZIP)', async () => {
    const zipBody = await zipResource(
      path.join(__dirname, '../crates/one-publication.psi.json')
    );

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/zip',
        'api-key': API_KEY,
      },
      body: zipBody,
    });

    expect(response.status).toBe(200);
    expect(response.headers.get('content-type')).toMatch(/json/);
    const jsonResponse = await response.json();
    expect(jsonResponse.isValid).toBe(true);
    expect(jsonResponse.errors || []).toHaveLength(0);
    expect(jsonResponse.entities).toContain(
      'https://doi.org/10.16907/d910159a-d48a-45fb-acf2-74b27cd5a8e5'
    );
  });

  test('should return 200 with a valid PSI publication (JSON-LD)', async () => {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/ld+json',
        'api-key': API_KEY,
      },
      body: readFileSync(
        path.join(__dirname, '../crates/one-publication.psi.json')
      ),
    });

    expect(response.status).toBe(200);
    expect(response.headers.get('content-type')).toMatch(/json/);
    const jsonResponse = await response.json();
    expect(jsonResponse.isValid).toBe(true);
    expect(jsonResponse.errors || []).toHaveLength(0);
    expect(jsonResponse.entities).toContain(
      'https://doi.org/10.16907/d910159a-d48a-45fb-acf2-74b27cd5a8e5'
    );
  });

  test('should return 400 with a malformed payload (JSON-LD)', async () => {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/ld+json',
        'api-key': API_KEY,
      },
      body: '{',
    });

    expect(response.status).toBe(400);
    expect(response.headers.get('Content-type')).toMatch(/json/);
  });

  test('should return 400 with a malformed payload (ZIP)', async () => {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/ld+json',
        'api-key': API_KEY,
      },
      body: 'not a zip file',
    });

    expect(response.status).toBe(400);
    expect(response.headers.get('Content-type')).toMatch(/json/);
  });

  test('should return 400 with an empty payload (JSON-LD)', async () => {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/ld+json',
        'api-key': API_KEY,
      },
    });

    expect(response.status).toBe(400);
    expect(response.headers.get('Content-type')).toMatch(/json/);
  });

  test('should return 400 with an empty payload (ZIP)', async () => {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/ld+json',
        'api-key': API_KEY,
      },
    });

    expect(response.status).toBe(400);
    expect(response.headers.get('Content-type')).toMatch(/json/);
  });

  test('should return 400 without ro-crate-metadata.json file (ZIP)', async () => {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/ld+json',
        'api-key': API_KEY,
      },
    });

    expect(response.status).toBe(400);
    expect(response.headers.get('Content-type')).toMatch(/json/);
  });
});
