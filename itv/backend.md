# Backend Q&A

(This file contains the backend Q&A extracted from qna.txt)

**Backend — Q&A (batch 1 of many)**

File: backend/src/index.ts

Q1: What is the primary responsibility of `index.ts` in this project?
A1: `index.ts` boots the Express server: it loads environment variables (`dotenv`), configures middleware (`express.json()`, `cors()`), connects to MongoDB via `connectDB()`, registers the API router under `/api`, adds a health-check endpoint, and applies a centralized error handler. Example snippet:

```ts
import express from "express";
import { config } from "dotenv";
config();
const app = express();
app.use(express.json());
app.get("/health", (_req, res) => res.json({ message: "ok" }));
app.listen(process.env.PORT);
```

Q2: How should you change `index.ts` to gracefully handle shutdown signals?
A2: Listen for `SIGINT`/`SIGTERM` and close the server and DB connection to avoid data loss. Example:

```ts
const server = app.listen(PORT);
process.on("SIGINT", async () => {
  await mongoose.disconnect();
  server.close(() => process.exit(0));
});
```

File: backend/src/config/db.ts

Q3: What does `connectDB()` do and how does it report failures?
A3: `connectDB()` reads `MONGODB_URI` from env, attempts `mongoose.connect()`, logs success, and on error logs and exits the process with `process.exit(1)`. This ensures the service doesn't run without DB access.

Q4: How would you add retry logic to `connectDB()` for transient connection errors?
A4: Implement exponential backoff and a max retry count. Example:

```ts
let attempts = 0;
const connect = async () => {
  while (attempts < 5) {
    try {
      await mongoose.connect(uri);
      return;
    } catch (e) {
      attempts++;
      await new Promise((r) => setTimeout(r, 2 ** attempts * 1000));
    }
  }
  process.exit(1);
};
```

File: backend/src/controllers/authController.ts

Q5: How does `register` validate and respond to missing fields?
A5: It checks `fullName`, `email`, and `password`; if any are missing it uses `resHandler.error` to send a 400 with "All fields are required". Controllers are responsible for request-level validation and delegating business logic to services.

Q6: If `authService.register` throws "User already exists", how does the controller surface that to clients?
A6: The controller catches and passes the error to `next(error)` — the centralized error handler (`err-handler`) converts thrown errors into structured responses. In production you'd prefer domain-specific errors (e.g., `ConflictError`) mapped to 409.

File: backend/src/services/authService.ts

Q7: How are passwords stored in this app?
A7: Passwords are hashed using `bcryptjs.hash(password, 10)` (10 salt rounds) before saving to MongoDB. Example:

```ts
const hashed = await bcryptjs.hash(password, 10);
await User.create({ fullName, email, password: hashed });
```

Q8: Explain how login generates a JWT and what payload is included.
A8: On successful credential check, the service uses `jwt.sign` with `JWT_SECRET`, including `{ userId: user._id.toString(), email: user.email }` as payload and sets `expiresIn` with `JWT_EXPIRE`. The returned token authenticates API requests.

Q9: How does `forgotPassword` work in this service?
A9: It finds the user and creates a short-lived JWT (e.g., 15m) encoding `userId`. That token can be emailed as a password-reset link. The `resetPassword` function verifies the token and hashes the new password.

Q10: What are common security improvements for this flow?
A10: Use single-use reset tokens stored server-side (or include a nonce), rate-limit requests, validate email ownership, set appropriate token expirations, and ensure tokens are invalidated after password change.

File: backend/src/middlewares/authorization.ts

Q11: How does the `authorization` middleware validate a request?
A11: It reads `Authorization` header `Bearer <token>`, verifies JWT with `JWT_SECRET` using `jwt.verify`, places `decoded.userId` in `res.locals.userId`, and calls `next()`. On failure it returns 401 via `resHandler.error`.

Q12: What error cases must be considered in this middleware?
A12: Missing header, malformed header, invalid token signature, token expiry (`TokenExpiredError`), and missing `JWT_SECRET` environment variable. Each should map to an appropriate 401 response and not leak sensitive details.

File: backend/src/middlewares/res-hadler.ts

Q13: What is the purpose of `resHandler` and how does it help API consistency?
A13: `resHandler` centralizes success and error JSON shapes so all controllers return consistent responses containing `success`, `message`, and payload (e.g., `token`, `user`, `data`). This makes client-side parsing predictable.

Q14: How would you extend `resHandler` to include error codes and correlation IDs?
A14: Add optional fields to both success and error outputs: `code`, `correlationId` (from request headers), and `errors` array with detailed validation errors. Ensure not to expose stack traces in production.

File: backend/src/middlewares/err-handler.ts

Q15: How does global error handling work here?
A15: The Express error middleware logs the error, derives `code = err.status || 400` and `msg = err.message || 'Something went wrong...'` then calls `resHandler.error`. This centralizes logging and HTTP mapping.

Q16: What improvements are recommended for production error handling?
A16: Differentiate between operational vs programming errors, send sanitized messages to clients, integrate with observability (Sentry/Datadog), and include a correlation ID for tracing.

File: backend/src/services/resume/uitls.ts

Q17: How does `normalizeText` produce a hash for resumes and JDs?
A17: It strips whitespace with `.replace(/\s+/g, '').trim()` for both resume text and JD, concatenates them with `||`, then computes a `sha256` hex digest via `crypto.createHash('sha256').update(...).digest('hex')`. This deterministic hash is used to detect previously-analyzed content.

Q18: Why remove whitespace when hashing? Any caveats?
A18: Removing whitespace reduces false negatives from formatting differences (line breaks, extra spaces). Caveat: this makes hash insensitive to small changes; if you want stronger sensitivity, consider normalizing but keeping punctuation or using fuzzy similarity measures.

File: backend/src/services/resume/customAnalyzerService.ts

Q19: How does text extraction work for PDF and DOCX files?
A19: The code uses `pdf-parse` for PDFs and `mammoth` for DOCX. `pdf-parse` returns `.text`, `mammoth.extractRawText` gives plain text. Unsupported mimetypes raise an error.

Q20: Explain `matchKeywords` and `detectSections` behavior.
A20: `matchKeywords` lowercases & tokenizes JD and resume, removes stopwords, filters by a set of `TECH_KEYWORDS`, then returns `matched` and `missing` keywords. `detectSections` searches the resume lowercased text for section headers like "skills", "education", and "experience".

Q21: How does `analyzeATS` compute a score?
A21: Starts at 100, subtracts 2 points per missing keyword, subtracts 10 for each missing section, then clamps at 0. It's a simple heuristic combining keyword coverage and structure.

File: backend/src/services/resume/atsService.ts

Q22: Describe the caching behavior in `analyzeAndSaveResume`.
A22: The service computes a compare `hash` from resume + JD, searches `ResumeModel.findOne({ compareHash: hash })`. If found and `options.force` is not true, it returns the cached result with `cached: true`. Otherwise runs static and AI analysis and saves/updates the DB.

Q23: How is AI analysis integrated and merged with static analysis?
A23: `analyzeWithAI` returns an object (`aiResult`) with `atsScore`, `keywordAnalysis`, `sectionAnalysis`, etc. The service uses AI outputs when present to override or refine `score`, `keywords`, `sections`, `suggestions`, and `feedback`.

File: backend/src/ai-services/aiAtsService.ts

Q24: How does the backend call OpenAI and ensure JSON output?
A24: It constructs a `systemPrompt` that instructs the model to respond ONLY with valid JSON matching a schema. Then sends a chat completion request. The response is parsed: the code extracts a JSON substring via regex `text.match(\{[\s\S]*\})` and `JSON.parse`. This helps recover valid JSON even if the model adds minor surrounding text.

Q25: What are robust defenses against malformed model output?
A25: Use stricter prompt engineering, set `temperature: 0`, validate parsed JSON shape (schema validation), fallback to static analysis if parsing fails, and log raw model output for debugging.

File: backend/src/models/aiResume.ts

Q26: Why index `compareHash` and how does it help performance?
A26: Indexing `compareHash` speeds up lookups for duplicate resume+JD comparisons (`findOne({ compareHash })`). It reduces query latency when checking cached results.

Q27: What does `toJSON` in the schema do and why is it used?
A27: The `toJSON` transform creates `id` from `_id`, deletes `_id` and `__v` to present a cleaner API response to clients. It centralizes output shape formatting.

File: backend/src/services/gameService.ts & frontend/utils/game-ai.ts (interaction)

Q28: How does the backend store game results and how does the frontend call it?
A28: Backend `createGame` persists a `Game` doc with `{ userId, result, mode }`. Frontend `gameService.createGame` POSTs to `/api/game/create` including the JWT via interceptor. The game save is triggered in `useGame` after each finished match.

Q29: Explain the leaderboard aggregation logic.
A29: `getLeaderboard` uses MongoDB aggregation to group by `userId`, summing wins/losses/draws using `$cond` checks on `result`, then sorts by `wins` descending. This produces a simple ranking.

File: backend/src/controllers/aiResumeController.ts

Q30: How does `analyzeResume` handle file upload and optional re-computation?
A30: It expects a `file` from `multer`, a `jobDescription` field, and an optional `forceRecompute`. If `force` is present it passes `{ force: true }` to `analyzeAndSaveResume` to bypass caching. It returns saved structured result and a `cached` meta flag.

Q31: How should controllers and services be separated for testability?
A31: Keep controllers thin (parse request, call services) and move business logic into services so units can be tested independently with mocks/stubs.

Q32: What input validation strategy is recommended for TypeScript backends?
A32: Use schema validators like `Joi` or `Zod` to validate request payloads and derive TypeScript types where possible to keep runtime and compile-time guarantees aligned.

Q33: How to securely handle file uploads in production?
A33: Validate MIME types and size, stream to temporary storage, scan for malware, and offload to object storage (S3) using signed upload URLs instead of storing on the server filesystem.

Q34: When should you use transactions with MongoDB?
A34: Use multi-document transactions when operations across multiple collections must be atomic; otherwise rely on single-document atomicity for performance.

Q35: How to structure background jobs for long-running tasks?
A35: Use a job queue (BullMQ/Redis, RabbitMQ) and worker processes to run AI calls, heavy parsing, or re-computation asynchronously and report progress via events or DB status fields.

Q36: What are good database index strategies for read-heavy endpoints?
A36: Index query predicates and sort keys, use compound indexes for frequent combined filters, and consider partial or TTL indexes for time-bound data.

Q37: How to implement pagination efficiently in MongoDB?
A37: Prefer cursor-based (using a sort key and last seen value) for large datasets; use `limit` + indexed sort to avoid large skips which are expensive.

Q38: How to safely expose database errors to clients?
A38: Map known operational errors to friendly messages and HTTP codes; log full details server-side and avoid leaking stack traces or internal schemas.

Q39: What rate-limiting approach works for mixed auth/anonymous APIs?
A39: Use per-IP for anonymous routes and per-user or per-API-key buckets for authenticated routes; back with Redis to support distributed limits.

Q40: How to design feature toggles in a backend service?
A40: Use a feature flag service or a DB-backed flag with caching; flags should be namespaced by environment and include targeting rules and kill-switch capability.

Q41: What logging fields help in tracing requests end-to-end?
A41: Include timestamp, level, requestId, userId (if available), route, method, status, latency, and correlation IDs for cross-service tracing.

Q42: How to add request IDs to Express apps?
A42: Generate a UUID per request in middleware, store it on `req.id` and `res.locals`, and include it in logs and responses for traceability.

Q43: How to test controllers with `supertest` and mocked services?
A43: Spin up the Express app with in-memory dependencies or use DI to inject mocks; call endpoints with `supertest` and assert status, body, and that service mocks were called.

Q44: What CI checks should run on pull requests for a backend repo?
A44: Run linting, TypeScript type checks, unit tests, basic integration tests (if cheap), and vulnerability scans on dependencies.

Q45: How to perform safe database migrations in production?
A45: Use idempotent migrations, apply in small steps, support backward-compatible code during rollout, and schedule heavy migrations during low traffic windows.

Q46: How to handle configuration across environments securely?
A46: Use environment variables injected by the platform, keep secrets in a secret manager, and avoid committing config files with secrets to VCS.

Q47: How to implement health and readiness checks for Kubernetes?
A47: Provide `/healthz` for liveness and `/readyz` for readiness; readiness should check critical dependencies (DB, cache) and return non-200 when not ready.

Q48: How to perform graceful shutdown in clustered Node apps?
A48: Stop accepting new requests, wait for in-flight requests to finish, close DB and queue connections, then exit workers; coordinate via the process manager or Kubernetes preStop hooks.

Q49: What are best practices for secrets rotation?
A49: Automate rotation using cloud secret managers, avoid long-lived credentials in code, and support zero-downtime rotation by retrieving secrets at runtime.

Q50: How to measure SLA/SLO for backend services?
A50: Define SLOs (e.g., 99.9% requests under 300ms), collect p99/p95 latencies and error rates, and create alerts when burn rate exceeds thresholds.

Q51: How to handle dependency failures (DB/cache) gracefully?
A51: Fail fast for dependent endpoints, return informative 503s, and implement retries with backoff for transient operations while protecting against retries that exacerbate load.

Q52: How to prevent blocking the event loop with CPU-bound work?
A52: Move heavy computations to worker threads or external services, use child processes, or offload to native addons if necessary.

Q53: What are common memory leak sources in Express apps?
A53: Unbounded caches, forgotten timers, retaining large results in global scope, and improperly closed DB cursors or streams.

Q54: How to profile a Node.js service in production safely?
A54: Use sampling profilers (clinic, 0x), collect a short trace during a known load window, and analyze hotspots offline; avoid continuous heavy profiling.

Q55: How to implement connection pooling for databases?
A55: Use the DB driver pool settings (Mongoose connection pooling options), keep pool sizes tuned to app concurrency and DB capacity.

Q56: How to manage backward-incompatible API changes?
A56: Introduce versioned endpoints (v1/v2), deprecate old APIs with clear timelines, and provide migration guides to clients.

Q57: When to use an API gateway vs direct services?
A57: API gateways centralize auth, rate-limiting, and routing for microservices; for small monoliths they add complexity and may be unnecessary.

Q58: What metrics are critical for AI-backed endpoints?
A58: Request latency, AI model latency, tokens consumed, success vs fallback rates (static vs AI), and cost per request.

Q59: How to cache expensive AI results effectively?
A59: Use deterministic keys (compareHash), TTL based on expected content change, and consider a cache layer (Redis) with size limits and eviction policies.

Q60: How to roll out a schema change for stored AI results?
A60: Add a `schemaVersion` field, write migration scripts, and ensure read code can handle older versions by mapping defaults.

Q61: How to handle GDPR/CCPA data deletion requests in the backend?
A61: Implement a deletion flow that removes or anonymizes data, keep audit logs, and provide an endpoint or admin tool that performs the deletion and confirms completion.

Q62: What techniques help reduce cold-start latency for serverless Node functions?
A62: Keep function bundles small, reuse connections across invocations, and provision warm instances if platform supports it.

Q63: How to structure logging to support multi-tenant services?
A63: Add tenant identifiers in log fields, avoid logging tenant PII, and ensure logs are partitioned or access-controlled per tenant.

Q64: How should error responses be internationalized?
A64: Return machine-readable error codes and let clients map messages to locales; avoid storing localized strings in low-level services unless required.

Q65: How to implement optimistic concurrency in MongoDB?
A65: Use a `version` field and check-and-update patterns (compare version in query) to prevent lost updates on concurrent writes.

Q66: What is a content negotiation strategy for APIs?
A66: Support `Accept` headers for clients that need different formats (JSON, CSV), but default to `application/json` for typical REST APIs.

Q67: How to secure admin endpoints?
A67: Restrict by IP, require strong auth (mTLS, admin tokens), and log all admin actions with audit trails.

Q68: How to safely log request/response bodies for debugging?
A68: Redact sensitive fields (passwords, tokens, PII), log only sampled requests in production, and use secure log stores with strict access control.

Q69: When to use WebSockets vs HTTP polling for features like live game updates?
A69: Use WebSockets for low-latency bidirectional interactions (real-time multiplayer); use polling or SSE when server pushes are infrequent and simpler implementation is sufficient.

Q70: What are patterns for implementing search in a backend?
A70: For simple keyword search use DB text indexes; for relevance and advanced features use search engines (Elasticsearch/OpenSearch) with sync/async indexing pipelines.

Q71: How to design an API client library for internal use?
A71: Provide typed request helpers, centralize auth and retries, handle pagination transparently, and version the client SDK alongside API changes.

Q72: How to handle large JSON responses efficiently?
A72: Use pagination, streaming responses (NDJSON), or compress responses with gzip/brotli; avoid sending unnecessary nested data.

Q73: How to implement schema validation for persisted documents?
A73: Use Mongoose schema validators plus additional runtime checks on save to enforce invariants not expressible in schema alone.

Q74: How to mitigate dependency supply-chain attacks?
A74: Use lockfiles, review dependency updates, pin critical transitive dependencies, scan with SCA tools, and avoid running untrusted install scripts.

Q75: What is a good approach to housekeeping tasks like old record cleanup?
A75: Schedule jobs (cron or queue) that delete or archive stale data using batched operations and monitor duration to avoid overloading DB.

Q76: How to perform blue-green deployments safely?
A76: Deploy new version to green, run smoke tests, switch traffic with load balancer, keep green for quick rollback, and monitor closely during cutover.

Q77: How to manage feature branches and releases in Git workflows?
A77: Use trunk-based or GitFlow per team preference; protect main branch with PR reviews, CI checks, and enforce PR size limits for faster reviews.

Q78: How to handle timezones in a backend application?
A78: Store timestamps in UTC, accept client timezone info when needed, and format for presentation in the client layer.

Q79: How to implement rate-limited retries for downstream APIs?
A79: Use exponential backoff with jitter and limit retries for non-idempotent operations; for idempotent ops retries are safer.

Q80: How to design multi-region read replicas with a single write region?
A80: Use primary-write/replica-read pattern with eventual consistency, direct reads to local replicas, and ensure application tolerates replication lag.

Q81: What are best practices for dependency injection in Node/TypeScript?
A81: Use constructor injection, small interfaces, avoid global singletons, and prefer lightweight DI containers or manual wiring for clarity.

Q82: How to make error monitoring actionable?
A82: Group similar errors, add context (userId, requestId), set alert thresholds, and include reproducible steps or payload samples in alerts.

Q83: How to avoid leaking internal IPs/ports in error messages?
A83: Sanitize error outputs, map internal errors to generic messages, and maintain rich logs only accessible to ops/engineering.

Q84: When to shard collections vs scale vertically?
A84: Shard when your single-node DB cannot handle dataset size or traffic; prefer vertical scaling or read replicas for moderate loads.

Q85: How to implement synchronous vs async validation flows?
A85: Use fast synchronous checks for simple validation and queue longer-running validations (virus scan, deep content checks) to background jobs.

Q86: How to reduce tail latencies in APIs?
A86: Use connection pooling, avoid noisy neighbors in shared hosts, instrument p99 and p999, and scale horizontally to absorb spikes.

Q87: How to design an audit log for security-sensitive operations?
A87: Record who, what, when, and where (actor, action, timestamp, IP), keep immutable logs, and restrict access to auditors.

Q88: What is the recommended approach for schema-less vs schema-full persistence?
A88: For flexible data use schema-less stores but enforce application-level validation; for strict domain models prefer schema-full DBs for invariants.

Q89: How to safely expose paginated export endpoints (CSV/JSON)?
A89: Rate-limit export generation, require auth, stream results to avoid memory pressure, and provide signed temporary download links.

Q90: How to implement server-side template rendering for emails?
A90: Use templating engines (Handlebars/EJS) with strict input escaping, keep templates in version control, and precompile templates where possible.

Q91: How to design a feature that requires user consent for data processing?
A91: Record consent with timestamp and terms version, gate processing by consent flag, and provide revocation endpoints that stop future processing.

Q92: How to handle file deduplication and storage optimization?
A92: Use content-addressed storage (hashes), deduplicate identical files, and store metadata pointing to shared blobs.

Q93: What is the approach for handling downstream webhook failures?
A93: Retry with backoff, queue failed deliveries for later retry, mark failures for manual review, and provide dead-letter queues.

Q94: How to implement multi-tenant isolation at the data layer?
A94: Use tenant-scoped DBs for strong isolation or row-level tenancy with tenantId fields and strict access control in queries.

Q95: How to enforce schema evolution compatibility across microservices?
A95: Use backward-compatible changes, communicate schema versions, and validate messages at ingestion to avoid silent failures.

Q96: What are practical tips for optimizing cold caches?
A96: Pre-warm caches on deploy, populate popular keys proactively, and use tiered caches (local memory + Redis).

Q97: How to build a safe rollback plan for deployments?
A97: Keep previous artifacts available, use database migrations that are reversible or compatible across versions, and test rollbacks in staging.

Q98: How to implement tenant-aware rate limiting?
A98: Maintain separate counters per tenant keyed by tenantId, share global buckets for platform-level limits, and tune per-tenant caps.

Q99: How to document APIs for internal and external use?
A99: Use OpenAPI/Swagger for machine-readable docs, include examples, error codes, and quick-start snippets; keep docs versioned alongside code.

Q100: What are final checklist items before shipping a backend release?
A100: Run tests, check migrations, verify monitoring and alerts, ensure config/secrets are set, run smoke tests, and have a rollback strategy.
