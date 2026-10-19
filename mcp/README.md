# MCP Chat — Anthropic + Model Context Protocol

A Python command-line AI chat application that connects Anthropic's Claude models to tools, resources, and prompts exposed through the **Model Context Protocol (MCP)**.

This is a learning and portfolio project demonstrating an MCP server, an asynchronous MCP client, and integration with a conversational AI interface.

## What this project demonstrates

- **MCP server:** A FastMCP `DocumentMCP` server using standard input/output (stdio) transport.
- **Tools:** `read_doc_contents` reads a document by ID; `edit_document` replaces matching text in an in-memory document.
- **Resources:** `docs://documents` lists document IDs; `docs://documents/{doc_id}` returns a document's content.
- **Prompt template:** `format` instructs the model to reformat a document as Markdown using the editing tool.
- **Asynchronous client:** Initializes MCP sessions, discovers and invokes tools, lists and retrieves prompts, and reads resources.
- **CLI integration:** Connects Claude to the document server and optionally additional MCP servers supplied as command-line arguments.

**Scope:** Documents are sample entries stored in an in-memory Python dictionary, not files read from disk or a persistent database. Edits last only for the server process lifetime.

## Architecture

```text
User
  |
  v
CLI (main.py, core/)
  |                    Anthropic API
  +------------------------> Claude
  |
  v
MCPClient (mcp_client.py)
  |  stdio / MCP session
  v
FastMCP DocumentMCP (mcp_server.py)
  +-- Tools: read_doc_contents, edit_document
  +-- Resources: docs://documents, docs://documents/{doc_id}
  +-- Prompt: format
```

## Technology stack

- Python 3.10+
- Anthropic Python SDK
- MCP Python SDK / FastMCP
- asyncio and stdio transports
- python-dotenv and prompt-toolkit

## Project files

| File | Purpose |
| --- | --- |
| [`mcp_server.py`](mcp_server.py) | MCP server, sample documents, tools, resources, and prompt |
| [`mcp_client.py`](mcp_client.py) | Async MCP client and session lifecycle |
| [`main.py`](main.py) | CLI startup, Claude configuration, and MCP client wiring |
| [`core/`](core/) | Claude integration and interactive chat |
| [`pyproject.toml`](pyproject.toml) | Python version and dependencies |

## Run locally

From the `mcp/` directory, with Python 3.10+ and [uv](https://docs.astral.sh/uv/) installed:

```bash
uv sync
```

Create a local `.env` file (never commit real credentials):

```dotenv
ANTHROPIC_API_KEY=your_api_key
CLAUDE_MODEL=your_supported_model_id
USE_UV=1
```

Start the CLI:

```bash
uv run main.py
```

Alternatively, set `USE_UV=0` to launch the document MCP server with `python` from the current environment.

To inspect the MCP server's exposed tools, resources, and prompts:

```bash
uv run mcp dev mcp_server.py
```

The `main.py` CLI also accepts optional paths to additional MCP server scripts as arguments.

## Example interactions

- Ask the assistant about `@deposition.md` to use a sample document in the conversation.
- Request `/format deposition.md` to use the MCP prompt flow for Markdown formatting.
- Explore `read_doc_contents`, `edit_document`, and the resources in the MCP Inspector.

These examples operate on the server's sample document dictionary; they do not access real user documents.

## Current limitations

- Document storage is in-memory and resets on server restart.
- The `format` prompt requests a model-driven edit; it does not guarantee a particular result.
- Automated lint, typing, and test commands are not currently defined in the project.

## Why this project matters

The project explores a central AI-agent integration pattern: giving an LLM discoverable, structured capabilities through a standard tool protocol rather than embedding every operation directly into a prompt.

## Author

**Omar Elnoamy** — M.Sc. Computer Science student, TU Darmstadt

[GitHub profile](https://github.com/Omarelnoamy)
