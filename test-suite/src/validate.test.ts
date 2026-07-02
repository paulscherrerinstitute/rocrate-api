import { readFileSync } from "fs";
import path from "path";
import { API_KEY, BASE_URL } from "./env";
import { pollJob, zipResource, zipResources } from "./utils";

describe("Validate endpoint", () => {
  const endpoint = `${BASE_URL}/validate`;

  test("should be valid with a valid PSI publication (ZIP)", async () => {
    const zipBody = await zipResource(
      path.join(__dirname, "../crates/one-publication.psi.json"),
    );

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/zip",
        "api-key": API_KEY,
      },
      body: zipBody,
    });

    let validationReport;
    if (response.status === 202) {
      const body = await response.json();
      expect(body.jobId).toBeDefined();
      const asyncResponse = await pollJob(body.jobId);
      const jobBody = await asyncResponse.json();
      expect(jobBody.status).toBe("COMPLETED");
      expect(response.headers.get("content-type")).toMatch(/json/);
      validationReport = jobBody.validationResult;
    } else {
      expect(response.status).toBe(200);
      expect(response.headers.get("content-type")).toMatch(/json/);
      validationReport = await response.json();
    }

    expect(validationReport.isValid).toBe(true);
    // TODO: remove foundIndentifiers support
    expect(
      validationReport.entities ?? validationReport.foundIdentifiers,
    ).toContain(
      "https://doi.org/10.16907/d910159a-d48a-45fb-acf2-74b27cd5a8e5",
    );
  });

  test("should be valid with a valid PSI publication (JSON-LD)", async () => {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/ld+json",
        "api-key": API_KEY,
      },
      body: readFileSync(
        path.join(__dirname, "../crates/one-publication.psi.json"),
      ),
    });

    let validationReport;
    if (response.status === 202) {
      const body = await response.json();
      expect(body.jobId).toBeDefined();
      const asyncResponse = await pollJob(body.jobId);
      const jobBody = await asyncResponse.json();
      expect(jobBody.status).toBe("COMPLETED");
      expect(response.headers.get("content-type")).toMatch(/json/);
      validationReport = jobBody.validationResult;
    } else {
      expect(response.status).toBe(200);
      expect(response.headers.get("content-type")).toMatch(/json/);
      validationReport = await response.json();
    }

    expect(validationReport.isValid).toBe(true);
    // TODO: remove foundIndentifiers support
    expect(
      validationReport.entities ?? validationReport.foundIdentifiers,
    ).toContain(
      "https://doi.org/10.16907/d910159a-d48a-45fb-acf2-74b27cd5a8e5",
    );
  });

  test("should be valid with multiple valid PSI publication (ZIP)", async () => {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/zip",
        "api-key": API_KEY,
      },
      body: await zipResource(
        path.join(__dirname, "../crates/multiple-publications.psi.json"),
      ),
    });

    let validationReport;
    if (response.status === 202) {
      const body = await response.json();
      expect(body.jobId).toBeDefined();
      const asyncResponse = await pollJob(body.jobId);
      const jobBody = await asyncResponse.json();
      expect(jobBody.status).toBe("COMPLETED");
      expect(response.headers.get("content-type")).toMatch(/json/);
      validationReport = jobBody.validationResult;
    } else {
      expect(response.status).toBe(200);
      expect(response.headers.get("content-type")).toMatch(/json/);
      validationReport = await response.json();
    }

    expect(validationReport.isValid).toBe(true);
    // TODO: remove foundIndentifiers support
    expect(
      validationReport.entities ?? validationReport.foundIdentifiers,
    ).toContain(
      "https://doi.org/10.16907/d910159a-d48a-45fb-acf2-74b27cd5a8e5",
    );
    expect(
      validationReport.entities ?? validationReport.foundIdentifiers,
    ).toContain(
      "https://doi.org/10.16907/4b55cbae-ac98-445a-a15e-1534b2a8b01f",
    );
  });

  test("should be valid with multiple valid PSI publication (JSON-LD)", async () => {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/ld+json",
        "api-key": API_KEY,
      },
      body: readFileSync(
        path.join(__dirname, "../crates/multiple-publications.psi.json"),
      ),
    });

    let validationReport;
    if (response.status === 202) {
      const body = await response.json();
      expect(body.jobId).toBeDefined();
      const asyncResponse = await pollJob(body.jobId);
      const jobBody = await asyncResponse.json();
      expect(jobBody.status).toBe("COMPLETED");
      expect(response.headers.get("content-type")).toMatch(/json/);
      validationReport = jobBody.validationResult;
    } else {
      expect(response.status).toBe(200);
      expect(response.headers.get("content-type")).toMatch(/json/);
      validationReport = await response.json();
    }

    expect(validationReport.isValid).toBe(true);
    // TODO: remove foundIndentifiers support
    expect(
      validationReport.entities ?? validationReport.foundIdentifiers,
    ).toContain(
      "https://doi.org/10.16907/d910159a-d48a-45fb-acf2-74b27cd5a8e5",
    );
    expect(
      validationReport.entities ?? validationReport.foundIdentifiers,
    ).toContain(
      "https://doi.org/10.16907/4b55cbae-ac98-445a-a15e-1534b2a8b01f",
    );
  });

  test("should be invalid with an invalid PSI publication (ZIP)", async () => {
    const zipBody = await zipResource(
      path.join(__dirname, "../crates/invalid.psi.json"),
    );

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/zip",
        "api-key": API_KEY,
      },
      body: zipBody,
    });

    let validationReport;
    if (response.status === 202) {
      const body = await response.json();
      expect(body.jobId).toBeDefined();
      const asyncResponse = await pollJob(body.jobId);
      const jobBody = await asyncResponse.json();
      expect(jobBody.status).toBe("COMPLETED");
      expect(response.headers.get("content-type")).toMatch(/json/);
      validationReport = jobBody.validationResult;
    } else {
      expect(response.status).toBe(200);
      expect(response.headers.get("content-type")).toMatch(/json/);
      validationReport = await response.json();
    }

    expect(validationReport.isValid).toBe(false);
  });

  test("should be invalid with an empty graph (ZIP)", async () => {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/zip",
        "api-key": API_KEY,
      },
      body: await zipResource(
        path.join(__dirname, "../crates/empty-graph.json"),
      ),
    });

    expect(response.status).toBe(400);
    expect(response.headers.get("Content-type")).toMatch(/json/);
    const jsonResponse = await response.json();
    expect(typeof jsonResponse.message).toBe("string");
  });

  test("should be invalid with an empty graph (JSON-LD)", async () => {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/ld+json",
        "api-key": API_KEY,
      },
      body: readFileSync(path.join(__dirname, "../crates/empty-graph.json")),
    });

    expect(response.status).toBe(400);
    expect(response.headers.get("Content-type")).toMatch(/json/);
    const jsonResponse = await response.json();
    expect(typeof jsonResponse.message).toBe("string");
  });

  test("should return an error with a malformed payload (JSON-LD)", async () => {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/ld+json",
        "api-key": API_KEY,
      },
      body: "{",
    });

    expect(response.status).toBe(400);
    expect(response.headers.get("Content-type")).toMatch(/json/);
    const jsonResponse = await response.json();
    expect(typeof jsonResponse.message).toBe("string");
  });

  test("should return an error with a malformed payload (ZIP)", async () => {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/zip",
        "api-key": API_KEY,
      },
      body: "not a zip file",
    });

    expect(response.status).toBe(400);
    expect(response.headers.get("Content-type")).toMatch(/json/);
    const jsonResponse = await response.json();
    expect(typeof jsonResponse.message).toBe("string");
  });

  test("should return an error with an empty payload (JSON-LD)", async () => {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/ld+json",
        "api-key": API_KEY,
      },
    });

    expect(response.status).toBe(400);
    expect(response.headers.get("Content-type")).toMatch(/json/);
    const jsonResponse = await response.json();
    expect(typeof jsonResponse.message).toBe("string");
  });

  test("should return an error with an empty payload (ZIP)", async () => {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/zip",
        "api-key": API_KEY,
      },
    });

    expect(response.status).toBe(400);
    expect(response.headers.get("Content-type")).toMatch(/json/);
    const jsonResponse = await response.json();
    expect(typeof jsonResponse.message).toBe("string");
  });

  test("should return an error without ro-crate-metadata.json file (ZIP)", async () => {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/zip",
        "api-key": API_KEY,
      },
      body: await zipResources(new Map()),
    });

    expect(response.status).toBe(400);
    expect(response.headers.get("Content-type")).toMatch(/json/);
    const jsonResponse = await response.json();
    expect(typeof jsonResponse.message).toBe("string");
  });
});
