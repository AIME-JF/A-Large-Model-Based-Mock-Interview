import os
from pathlib import Path


BASE_DIR = Path(__file__).resolve().parent


def load_local_env(env_path: Path = BASE_DIR / ".env"):
    if not env_path.exists():
        return

    for raw_line in env_path.read_text(encoding="utf-8").splitlines():
        line = raw_line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue

        key, value = line.split("=", 1)
        key = key.strip().lstrip("\ufeff")
        value = value.strip().strip('"').strip("'")
        if key and key not in os.environ:
            os.environ[key] = value


def get_spark_config():
    load_local_env()
    return {
        "appid": os.environ.get("SPARK_APPID", ""),
        "api_secret": os.environ.get("SPARK_API_SECRET", ""),
        "api_key": os.environ.get("SPARK_API_KEY", ""),
        "domain": os.environ.get("SPARK_DOMAIN", "x1"),
        "spark_url": os.environ.get("SPARK_URL", "wss://spark-api.xf-yun.com/v1/x1"),
    }


def require_spark_credentials(config):
    missing = [
        name
        for name, value in (
            ("SPARK_APPID", config["appid"]),
            ("SPARK_API_SECRET", config["api_secret"]),
            ("SPARK_API_KEY", config["api_key"]),
        )
        if not value
    ]
    if missing:
        raise RuntimeError("Missing Spark API config: " + ", ".join(missing))
