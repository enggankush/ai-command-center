# Generic Tech Q&A

(This file contains the generic tech Q&A extracted from qna.txt)

**Generic Tech — Q&A (100 items)**

Q1: What is a hash function and where is it used?
A1: A hash function deterministically maps input data to a fixed-size output (hash). Uses: checksums, content-addressing, hash tables, password storage (with salt + slow hash), and deduplication. Example (SHA-256 in Node.js):

```js
const crypto = require("crypto");
const h = crypto.createHash("sha256").update("data").digest("hex");
```

Q2: What is the difference between cryptographic hashes and checksums?
A2: Cryptographic hashes (SHA-256) are collision-resistant and irreversible, designed for security. Checksums (CRC) detect accidental errors but are not secure against deliberate collisions.

Q3: How does password hashing with salt work?
A3: Salt is random per-user data concatenated with the password before hashing to prevent rainbow-table attacks. Use slow algorithms (bcrypt/argon2) that include salt and cost factor, e.g., `bcrypt.hash(password, 10)`.

Q4: Explain `bcrypt` vs `argon2`.
A4: Both are slow adaptive KDFs. `bcrypt` is older and widely supported; `argon2` (especially Argon2id) offers better resistance to GPU attacks and has configurable memory cost. Prefer Argon2 for new systems if available.

Q5: What is JWT and what are its parts?
A5: JWT (JSON Web Token) is a compact, URL-safe token with three parts: header, payload, and signature, separated by dots. Header specifies algorithm; payload contains claims (e.g., `sub`, `exp`); signature ensures integrity using HMAC or RSA.

Q6: Show how to create and verify a JWT in Node.js.
A6: Example using `jsonwebtoken`:

```ts
import jwt from "jsonwebtoken";
const token = jwt.sign({ userId: "123" }, process.env.JWT_SECRET, {
  expiresIn: "1h",
});
const decoded = jwt.verify(token, process.env.JWT_SECRET);
```

Q7: Should JWTs be stored in localStorage or cookies?
A7: Storing JWTs in `localStorage` is vulnerable to XSS; storing in secure, httpOnly cookies mitigates XSS but requires CSRF protections. Choose based on threat model and use SameSite/CSRF tokens for cookies.

Q8: What is the structure of an HTTP request and response?
A8: Request: method, URL, headers, optional body. Response: status line (HTTP/1.1 200 OK), headers, body. Headers control caching, content-type, auth, etc.

Q9: Explain CORS and how to configure it.
A9: Cross-Origin Resource Sharing restricts browser access to cross-origin resources. Server sends `Access-Control-Allow-Origin`, `Access-Control-Allow-Methods`, and other headers. In Express: `app.use(cors({ origin: 'http://localhost:5173' }))`.

Q10: Difference between REST and GraphQL?
A10: REST is resource-oriented with multiple endpoints; GraphQL provides a single endpoint letting clients specify the shape of the response. GraphQL reduces over/under-fetching but adds complexity (caching, rate-limiting, complexity control).

Q11: What is an ORM and what are pros/cons?
A11: ORM maps database rows to language objects (e.g., Mongoose, TypeORM). Pros: faster development, safer queries; cons: leaky abstractions, potential performance overhead and complex queries handled poorly.

Q12: Explain ACID properties.
A12: Atomicity (all or nothing), Consistency (DB moves from valid state to valid state), Isolation (concurrent transactions don't interfere), Durability (once committed, persists despite failures).

Q13: What is the CAP theorem?
A13: In distributed systems, you can have at most two of Consistency, Availability, and Partition tolerance. E.g., in network partitions, choose CP (consistent but maybe unavailable) or AP (available but may be eventually consistent).

Q14: Explain eventual consistency vs strong consistency.
A14: Strong consistency ensures all reads see latest writes; eventual consistency guarantees that, given time, all replicas converge. Eventual is common in distributed systems for higher availability.

Q15: What is SQL injection and how to prevent it?
A15: SQL injection occurs when untrusted input is concatenated into SQL queries. Prevent by using parameterized queries/prepared statements, ORMs, and input validation. Example (node-postgres):

```js
client.query("SELECT * FROM users WHERE id = $1", [id]);
```

Q16: What is CSRF and how to mitigate it?
A16: Cross-Site Request Forgery tricks authenticated users into making unwanted requests. Mitigations: use sameSite cookies, CSRF tokens, require custom headers (AJAX), and double-submit cookie pattern.

Q17: What is XSS and mitigation strategies?
A17: Cross-site scripting injects malicious scripts into pages. Mitigate by escaping/encoding output, using CSP, sanitizing inputs, and avoiding dangerous `innerHTML` usage.

Q18: Explain TLS handshake at a high level.
A18: ClientHello → ServerHello (cert) → client verifies cert, generates pre-master secret → key derivation → secure symmetric session established. Certificates validate server identity; session keys encrypt traffic.

Q19: How to obtain HTTPS certs for a web app?
A19: Use Let's Encrypt to generate free certs via ACME protocol; automations like Certbot or using platform-managed certs (Cloudflare, AWS ACM) simplify management.

Q20: What is OAuth2 and how does it differ from OpenID Connect?
A20: OAuth2 is an authorization framework providing access tokens; OpenID Connect builds on OAuth2 to add authentication and ID tokens for user identity.

Q21: Explain access token vs refresh token.
A21: Access token grants API access for a short time; refresh token (longer-lived) is used to obtain new access tokens. Keep refresh tokens securely stored and support revocation.

Q22: Describe rate limiting strategies.
A22: Token bucket (allows bursts, replenishes tokens), leaky bucket (smooths requests), fixed window, sliding window. Implement per-IP or per-user limits and return 429 for exceeded limits.

Q23: What is a token bucket and simple pseudo-code?
A23: Token bucket allows requests when tokens available; tokens added at rate R. Pseudocode:

```
if tokens >= 1: tokens -= 1; allow;
else: reject;
time += now - last; tokens = min(capacity, tokens + rate*time);
```

Q24: What is exponential backoff with jitter and why use it?
A24: Backoff increases wait times (base\*2^attempt) to avoid thundering herd; jitter adds randomness to avoid synchronized retries. Use to retry transient failures reliably.

Q25: How do you design an idempotent endpoint?
A25: Ensure repeated identical requests produce same effect (e.g., use idempotency keys, check existing resource before create). PUT is idempotent; POST typically is not unless designed with idempotency keys.

Q26: Explain the difference between synchronous and asynchronous operations.
A26: Synchronous blocks until completion; asynchronous returns immediately and completes later (callbacks/promises/events). Async allows concurrency without blocking threads.

Q27: What is the Node.js event loop?
A27: Single-threaded loop that handles callback queues (timers, I/O, microtasks), enabling non-blocking I/O. Long CPU-bound tasks block the loop and should be offloaded to worker threads or processes.

Q28: How does async/await work under the hood?
A28: `async` functions return promises. `await` pauses execution until the promise resolves, then resumes—transformed into promise chains by transpilers or V8.

Q29: What are memory leaks in JS and common causes?
A29: Memory leaks occur when unused objects remain reachable: global variables, closures holding large data, forgotten timers/intervals, DOM references from detached nodes.

Q30: How to find memory leaks in Node.js?
A30: Use `--inspect` and Chrome DevTools heap snapshots, `heapdump`, `clinic.js` or `Valgrind`-like tools; analyze retained objects and paths to GC roots.

Q31: What is Docker and why use it?
A31: Docker containers package application and dependencies into lightweight, reproducible images, enabling consistent environments across dev/stage/prod and simplifying deployment.

Q32: How to write a simple `Dockerfile` for a Node.js app?
A32: Example:

```
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
CMD ["node", "dist/index.js"]
```

Q33: What is orchestration and how does Kubernetes help?
A33: Orchestration automates deployment, scaling, and management of containers. Kubernetes provides pods, deployments, services, autoscaling, and declarative configs for production-grade apps.

Q34: Explain liveness and readiness probes in Kubernetes.
A34: Liveness probe checks if the container is alive (restart if failed). Readiness probe checks if the container is ready to accept traffic (used by service load balancers).

Q35: What is CI/CD and why is it important?
A35: Continuous Integration/Continuous Deployment automates building, testing, and deploying code to ensure fast, reliable, and repeatable releases and catch regressions early.

Q36: Give examples of CI tools.
A36: GitHub Actions, GitLab CI, Jenkins, CircleCI, Travis CI; each runs pipelines on code events (push/PR) to run tests, linters, builds.

Q37: What is unit testing vs integration testing vs end-to-end testing?
A37: Unit tests verify small components in isolation, integration tests verify interactions between components, e2e tests simulate user flows across the system (UI → backend → DB).

Q38: Why use feature flags?
A38: Feature flags allow toggling features at runtime, enabling gradual rollouts, A/B testing, and quick rollbacks without redeploying code.

Q39: What is observability and its three pillars?
A39: Observability = metrics (numeric measures), logs (event records), and traces (distributed request flows). Together they help debug production issues.

Q40: What is a circuit breaker pattern?
A40: Circuit breaker prevents repeated calls to failing services: if errors exceed threshold, open breaker (fail fast), after cooldown try half-open and then close on success.

Q41: Explain eventual consistency using a shopping cart example.
A41: If two servers update cart concurrently, replicas may diverge temporarily; eventually updates converge (via replication/merge). Users may see stale cart for short time until replication completes.

Q42: What is Redis and common use cases?
A42: Redis is an in-memory key-value store used for caching, sessions, pub/sub, rate-limiting counters, and as a lightweight datastore for fast operations.

Q43: How to implement a cache with Redis and HTTP cache headers?
A43: Cache computed results in Redis with TTL, and set `Cache-Control`/`ETag` headers for client-side caching; invalidate cache on writes or use cache-aside pattern.

Q44: What is database indexing and types of indexes?
A44: Indexes speed up queries by providing sorted lookup structures (B-tree, hash, compound indexes, partial, unique, text). Trade-offs: faster reads, slower writes, additional storage.

Q45: Explain database transactions and isolation levels.
A45: Transactions group operations atomically. Isolation levels: Read Uncommitted, Read Committed, Repeatable Read, Serializable—trading isolation for concurrency.

Q46: What is sharding and when to use it?
A46: Sharding splits data across nodes by key to scale horizontally when a single node can't handle data/traffic. Use when datasets are huge or throughput demands exceed single node.

Q47: Describe leader election in distributed systems.
A47: Leader election selects a coordinator among nodes for tasks like writes or scheduling. Algorithms: Raft, Paxos, ZooKeeper-based leader election.

Q48: What is consistent hashing and why use it?
A48: Consistent hashing maps keys to nodes with minimal remapping when nodes change, ideal for distributed caches or sharded storage to minimize reshuffling on scale events.

Q49: What is Pub/Sub vs Message Queue?
A49: Pub/Sub broadcasts messages to multiple subscribers (fan-out). Message Queue delivers messages to one consumer for processing (work queue). Use pub/sub for events, queues for task processing.

Q50: Explain idempotency and how to implement it for POST requests.
A50: Idempotency ensures repeated calls have same effect. Implement by accepting client-supplied unique idempotency keys and storing result for reuse; reject duplicates or return stored response.

Q51: Describe how to design a secure password reset flow.
A51: Generate single-use token stored server-side, send email link with token, short expiry (15m), validate token and user on reset, rotate tokens on use, log events, rate-limit requests.

Q52: How to prevent sensitive data leak in logs?
A52: Redact PII, avoid logging full tokens/passwords, use structured logs with safe fields, restrict log access, and apply retention policies.

Q53: What are WebSockets and when to use them?
A53: WebSockets provide bidirectional, full-duplex communication over a single TCP connection—use for real-time apps (chat, live updates) where server pushes are needed.

Q54: What is Server-Sent Events (SSE) and when is it preferred?
A54: SSE is unidirectional (server → client) over HTTP, simpler than WebSockets for streaming real-time updates where client doesn't need to send frequent messages.

Q55: Explain OAuth Authorization Code flow (high level).
A55: Client directs user to auth server, user logs in and authorizes, auth server returns authorization code to client, client exchanges code for access token securely server-side.

Q56: What is Cross-Origin Resource Policy (CORP) and Cross-Origin-Opener-Policy (COOP)?
A56: CORP controls which origins can load a resource; COOP isolates browsing contexts for security (helps with cross-origin opener vulnerabilities). Used for secure cross-origin embeddings.

Q57: How to implement input validation and sanitization?
A57: Use whitelist validation, schema validation libraries (Joi, Zod), parameterized DB queries, and escape/encode outputs to avoid XSS/SQL injection.

Q58: What are prepared statements and why use them?
A58: Prepared statements separate SQL and data, allowing DB engine to safely substitute parameters and prevent SQL injection while improving performance for repeated queries.

Q59: Describe how to implement pagination in APIs.
A59: Methods: offset-based pagination (limit/offset), cursor-based pagination (opaque cursor/token), or keyset pagination. Cursor-based scales better for large datasets and avoids duplication on writes.

Q60: What is an index-only query?
+A60: A query that can be satisfied entirely from index data without fetching full rows, faster because it avoids hitting storage for row contents.

... (file continues with all 100 Q&A)
