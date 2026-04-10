from pathlib import Path


BASE_DIR = Path(__file__).resolve().parent
PROTO_FILE = BASE_DIR.parent / "shared-proto" / "sentiment.proto"
GENERATED_DIR = BASE_DIR / "generated"
