import { API_KEY, BASE_URL, TestingEnv } from './env';
import { pollJob } from './utils';

describe('Export endpoint', () => {
  const jestConsole = console;
  beforeEach(async () => {
    global.console = await import('console');
  });

  afterEach(() => {
    global.console = jestConsole;
  });

  const endpoint = `${BASE_URL}/export`;
  const exportFormats = ['application/ld+json', 'application/zip'];

  const genHeaders = (exportFormat: string): HeadersInit => {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'api-key': API_KEY,
      export: exportFormat,
    };

    if (BASE_URL === TestingEnv.OPENBIS) {
      headers['openbis.with-levels-above'] = 'true';
      headers['openbis.with-levels-below'] = 'true';
      headers['openbis.import-compatible'] = 'true';
      headers['openbis.with-objects-and-dataSets-parents'] = 'true';
      headers['openbis.with-objects-and-dataSets-other-spaces'] = 'true';
    }

    return headers;
  };

  test.each(exportFormats)(
    'should fail with non-existing identifier (%s)',
    async (exportFormat) => {
      const response = await fetch(endpoint, {
        method: 'POST',
        body: JSON.stringify(['invalid-identifier']),
        headers: genHeaders(exportFormat),
      });

      if (response.status === 202) {
        const body = await response.json();
        expect(body.jobId).toBeDefined();
        const asyncResponse = await pollJob(body.jobId);
        const jobBody = await asyncResponse.json();
        expect(jobBody.status).toBe('FAILED');
        expect(jobBody.errors).toHaveLength(1);
      } else {
        expect(response.status).toBe(404);
      }
    }
  );

  test.each(exportFormats)(
    'should succeed with a valid identifier (%s)',
    async (exportFormat) => {
      const response = await fetch(endpoint, {
        method: 'POST',
        body: JSON.stringify(getSystemIdentifiers(1)),
        headers: genHeaders(exportFormat),
      });

      if (response.status === 202) {
        const body = await response.json();
        expect(body.jobId).toBeDefined();
        const asyncResponse = await pollJob(body.jobId);
        const jobBody = await asyncResponse.json();
        expect(jobBody.status).toBe('COMPLETED');
        expect(jobBody.jobId).toEqual(body.jobId);
        expect(typeof jobBody.downloadUrl).toBe('string');
      } else {
        expect(response.status).toBe(200);
        const body = await response.json();
      }
    }
  );

  // test.each(exportFormats)('should succeed with multiple valid identifiers (%s)', async (exportFormat) => {
  //   const response = await fetch(endpoint, {
  //     method: 'POST',
  //     body: JSON.stringify(getSystemIdentifiers(2)),
  //     headers: genHeaders(exportFormat)
  //   });

  //   if (response.status === 202) {
  //     const body = await response.json();
  //     expect(body.jobId).toBeDefined();
  //     const asyncResponse = await pollJob(body.jobId);
  //     const jobBody = await asyncResponse.json();
  //     expect(jobBody.status).toBe("COMPLETED");
  //   } else {
  //     expect(response.status).toBe(200);
  //   }
  // });
});

function getSystemIdentifiers(size: number) {
  const identifiers: string[] = knownIdentifiers.get(BASE_URL)!;
  if (size > identifiers.length) {
    throw new Error('invalid number of identifers');
  }

  return identifiers.slice(0, size);
}

const knownIdentifiers = new Map<TestingEnv, string[]>([
  [
    TestingEnv.PSI,
    [
      '10.16907/eb75dfba-6c91-4276-8dd6-05f949307213',
      '10.16907/edfe4ad5-9448-4e38-91a1-0459c8713b9b',
    ],
  ],
  [
    TestingEnv.OPENBIS,
    [
      'https://doi.org/10.1038/s41586-020-03065-y',
      'https://doi.org/10.1038/s41586-020-3010-5',
      'DOI: 10.1126/science.abe8770',
    ],
  ],
]);
