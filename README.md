# SpiritShell AI Backend（第一版）

**默认对接本机 Ollama**（OpenAI 兼容 `chat/completions`）+ 轻量安全校验 + **MemPalace** 语义记忆（RAG）。

## 架构

1. **对话**：`POST /v1/chat` → `OPENAI_BASE_URL`（默认 `http://127.0.0.1:11434/v1`）的 `chat/completions`。
2. **记忆**：MemPalace `search_memories` 检索后注入 system prompt。
3. **安全**：长度限制、可选 `SAFETY_BLOCKLIST`。

## 前置：Ollama

1. 安装 [Ollama](https://ollama.com)。
2. 拉取与配置一致的模型（名称须与 `OPENAI_MODEL` 相同）：

```bash
ollama pull llama3.2
ollama list
```

3. 确认本机接口可用：

```bash
curl -s http://127.0.0.1:11434/api/tags | head
```

## 快速开始

```bash
cd spiritshell-ai-backend
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate
pip install -r requirements.txt

cp .env.example .env
# 编辑 .env：至少设置 MEMPALACE_PALACE_PATH 为本机绝对路径，例如：
# MEMPALACE_PALACE_PATH=/Users/you/Projects/spiritshell-ai-backend/data/palace
# 若使用非 llama3.2，请同步修改 OPENAI_MODEL

chmod +x scripts/bootstrap_memory.sh
./scripts/bootstrap_memory.sh
```

启动 API：

```bash
# 确保 Ollama 已在运行（菜单栏图标或 ollama serve）
uvicorn app.main:app --reload --host 0.0.0.0 --port 8080
```

**浏览器对话页**（与后端同源，直接调 `/v1/chat`）：

- 打开：<http://127.0.0.1:8080/> 或 <http://127.0.0.1:8080/chat>

命令行测试：

```bash
curl -s http://127.0.0.1:8080/health | jq .
curl -s http://127.0.0.1:8080/v1/memory/status | jq .

curl -s http://127.0.0.1:8080/v1/chat \
  -H 'Content-Type: application/json' \
  -d '{"messages":[{"role":"user","content":"用一句话介绍你自己"}]}' | jq .
```

## 环境变量

见 `.env.example`。

| 变量 | 默认（代码内） | 说明 |
|------|----------------|------|
| `OPENAI_BASE_URL` | `http://127.0.0.1:11434/v1` | Ollama OpenAI 兼容前缀 |
| `OPENAI_API_KEY` | `ollama` | Ollama 不校验，填非空即可 |
| `OPENAI_MODEL` | `llama3.2` | 与 `ollama list` 一致 |
| `MEMPALACE_PALACE_PATH` | 空 | **须在 .env 中设为绝对路径** |

改用 **OpenAI / Groq** 等：在 `.env` 中覆盖上述三项，见 `.env.example` 注释。

## 新增记忆

在 `data/corpus/` 下增改文本后：

```bash
export MEMPALACE_PALACE_PATH="$PWD/data/palace"
mempalace mine data/corpus --wing spiritshell --no-gitignore
```

## 与灵壳产品的关系

本仓库为自研后端示例；生产环境需自行做脱敏、同意与多租户隔离。
