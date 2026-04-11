# SpiritShell AI Backend（第一版）

OpenAI 兼容 LLM + 轻量安全校验 + **MemPalace** 语义记忆（向量检索注入 system prompt）。

## 架构

1. **对话**：`POST /v1/chat` → 调用 `OPENAI_BASE_URL` 的 `chat/completions`。
2. **记忆**：用 MemPalace 的 `search_memories` 对「最后一条用户消息」做检索，将命中片段拼进 system prompt（RAG）。
3. **安全**：长度限制、可选关键词拦截（`SAFETY_BLOCKLIST`）。

记忆库需先用官方 CLI 建库并 `mine`（见下方脚本）。

## 快速开始

```bash
cd spiritshell-ai-backend
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate
pip install -r requirements.txt

cp .env.example .env
# 编辑 .env：填入 OPENAI_API_KEY，并把 MEMPALACE_PALACE_PATH 设为项目内绝对路径，例如：
# MEMPALACE_PALACE_PATH=/Users/you/Projects/spiritshell-ai-backend/data/palace

chmod +x scripts/bootstrap_memory.sh
./scripts/bootstrap_memory.sh
```

启动 API：

```bash
export MEMPALACE_PALACE_PATH="$PWD/data/palace"   # 与 .env 一致
uvicorn app.main:app --reload --host 0.0.0.0 --port 8080
```

测试：

```bash
curl -s http://127.0.0.1:8080/health | jq .
curl -s http://127.0.0.1:8080/v1/memory/status | jq .

curl -s http://127.0.0.1:8080/v1/chat \
  -H 'Content-Type: application/json' \
  -d '{"messages":[{"role":"user","content":"晚上九点以后用户更希望怎样互动？"}]}' | jq .
```

## 环境变量

见 `.env.example`。核心项：

- `OPENAI_API_KEY` / `OPENAI_BASE_URL` / `OPENAI_MODEL`
- `MEMPALACE_PALACE_PATH`：与 `mempalace mine` 使用的 Chroma 目录一致
- `MEMPALACE_DEFAULT_WING`：默认只检索该 wing（与 `mempalace mine --wing` 对齐）
- `MEMORY_OPTIONAL=true`：palace 未就绪时仍可对话（仅关闭 RAG）

## 新增记忆

在 `data/corpus/` 下增加或修改文本后执行：

```bash
export MEMPALACE_PALACE_PATH="$PWD/data/palace"
mempalace mine data/corpus --wing spiritshell --no-gitignore
```

## 与灵壳产品的关系

本仓库是**自研后端示例**：记忆层采用 MemPalace 的检索语义；部署与合规（脱敏、同意、多租户）需按产品要求自行加固。
