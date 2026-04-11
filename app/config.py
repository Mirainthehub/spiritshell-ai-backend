from functools import lru_cache

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    openai_api_key: str = Field(default="", validation_alias="OPENAI_API_KEY")
    openai_base_url: str = Field(default="https://api.openai.com/v1", validation_alias="OPENAI_BASE_URL")
    openai_model: str = Field(default="gpt-4o-mini", validation_alias="OPENAI_MODEL")

    mempalace_palace_path: str = Field(default="", validation_alias="MEMPALACE_PALACE_PATH")
    mempalace_default_wing: str | None = Field(default=None, validation_alias="MEMPALACE_DEFAULT_WING")
    memory_top_k: int = Field(default=5, ge=1, le=20, validation_alias="MEMORY_TOP_K")
    memory_optional: bool = Field(default=True, validation_alias="MEMORY_OPTIONAL")

    max_user_message_chars: int = Field(default=12_000, validation_alias="MAX_USER_MESSAGE_CHARS")
    safety_blocklist: str = Field(default="", validation_alias="SAFETY_BLOCKLIST")

    spiritshell_identity: str = Field(default="", validation_alias="SPIRITSHELL_IDENTITY")


@lru_cache
def get_settings() -> Settings:
    return Settings()
