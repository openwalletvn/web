# MCP Stateful vs Stateless on Cloudflare Workers

## What happened

Original MCP server used `McpAgent` from the `agents` package - a Durable Object (DO) subclass. Every MCP session spawned a DO instance that wrote session state to SQLite. Local dev pointed at prod MCP URL → SSE reconnect loop fired every ~15s → burned Cloudflare DO free tier write quota within hours.

## Key concepts

**Durable Object (DO):** Single-instance stateful object in CF network. Has its own SQLite DB. Guaranteed one instance per session. Every session init = SQL rows written = quota consumed.

**Stateful MCP:** `McpAgent extends DurableObject`. Client opens SSE GET → DO spawns → session persisted in SQLite → SSE stays alive for server push. Required for: multi-turn tool memory on server, server-initiated events.

**Stateless MCP:** `WebStandardStreamableHTTPServerTransport({ sessionIdGenerator: undefined })`. Each POST is self-contained - no DO, no SQLite, no persistent connection. Client must resend all context each time.

## Why stateless is correct for this project

All MCP tools (`searchCards`, `rankCards`, `compareCards`, etc.) are pure API proxies - each tool call hits `api.openwallet.vn` fresh with no dependency on prior tool results stored server-side. Multi-step tool chaining is handled client-side by `stopWhen: stepCountIs(5)` in `streamText`. DO state was overhead with zero benefit.

Conversation context (what the AI remembers) is completely separate - lives in browser `localStorage`, sent with every request to OpenRouter. DO has no awareness of message history.

## The DO quota trap

Free tier quota resets every 24h UTC midnight. Symptoms:
- CF logs show `SqlError: SQL query failed: Exceeded allowed rows written in Durable Objects free tier`
- Error 1101 Worker threw exception on POST
- Requests every ~15s = SSE reconnect loop after DO write failure

## Fix applied

`../mcp/src/index.ts`: Replaced `McpAgent`/DO pattern with plain CF Worker + `WebStandardStreamableHTTPServerTransport` stateless.

```ts
// before: McpAgent (DO)
export class OpenWalletMCP extends McpAgent<Env> { ... }

// after: plain Worker, new server+transport per request
const server = new McpServer(...);
createMcpServer(env, server);
const transport = new WebStandardStreamableHTTPServerTransport({ sessionIdGenerator: undefined });
await server.connect(transport);
return transport.handleRequest(request);
```

Also removed: `[[migrations]]` + `[durable_objects]` from `wrangler.toml`, `agents` dep from `package.json`, `MCP_OBJECT` from `Env`.

## When you'd need stateful

- Tool results depend on previous tool calls stored server-side
- Server needs to push unsolicited events to client
- Long-running background operations that outlive a single HTTP request
