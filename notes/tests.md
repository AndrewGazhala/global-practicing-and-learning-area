Here’s a practical map of the main test types in web programming, from smallest to broadest.

### 1. Unit tests
Test one function/component/module in isolation (mocks for everything else).  
**Example:** a pure `formatPrice()` helper, or a React button’s click handler with mocked props.  
**Goal:** fast feedback on small pieces of logic.

### 2. Integration tests
Test several units working together (still not the full product).  
**Example:** your Express tests with Supertest — routes + middleware + handlers, no browser/front-end.  
**Also:** React component + its hooks + a mocked API client.

### 3. API / contract tests
Verify HTTP endpoints: status codes, headers, body shape, auth.  
**Example:** `GET /api/v1/health` returns `{ status: "ok" }`.  
**Contract tests** also check that producer and consumer agree on the API shape (OpenAPI/Swagger helps here).

### 4. Component tests (front-end)
Render UI pieces and assert behavior/DOM, usually with Testing Library / Jest / Vitest.  
**Example:** “Hello World heading appears,” form validation messages show.

### 5. End-to-end (E2E) tests
Full user flow through the real stack (browser → UI → API → DB).  
**Tools:** Playwright, Cypress, Selenium.  
**Example:** user opens site, logs in, creates an item, sees it listed.

### 6. Acceptance / BDD tests
Business-facing scenarios (“Given / When / Then”). Often implemented as E2E or integration tests.  
**Tools:** Cucumber, sometimes Playwright with clear scenario names.

### 7. Snapshot tests
Capture rendered output (UI markup or JSON) and fail when it changes unexpectedly. Useful but brittle if overused.

### 8. Visual regression tests
Compare screenshots/UI pixels across versions.  
**Tools:** Chromatic, Percy, Playwright screenshots.

### 9. Performance tests
Check speed, throughput, latency under load.  
**Types:** load, stress, soak, spike.  
**Tools:** k6, JMeter, Lighthouse (front-end).

### 10. Security tests
Find auth holes, injection, XSS, misconfig.  
**Examples:** OWASP ZAP, dependency audits (`npm audit`), manual penetration testing.

### 11. Accessibility (a11y) tests
Check keyboard nav, ARIA, contrast, screen-reader friendliness.  
**Tools:** axe, Lighthouse, eslint-plugin-jsx-a11y.

### 12. Smoke / sanity tests
Tiny “is the app alive?” checks after deploy (health endpoint, homepage loads).

### 13. Regression tests
Any tests (unit → E2E) re-run to ensure old bugs/features still work after changes.

---

**How they relate (test pyramid)**

```text
        /\
       /E2E\          ← few, slow, expensive
      /------\
     /Integr. \       ← medium amount
    /----------\
   /   Unit     \     ← many, fast
  /--------------\
```

**In your project today**
- Back-end Supertest suite → **API integration**
- Front-end `App.test.tsx` → **component/unit-ish**
- Not yet: E2E, performance, security automation, visual regression

If you want, I can next sketch which of these are worth adding to this portfolio stack first.