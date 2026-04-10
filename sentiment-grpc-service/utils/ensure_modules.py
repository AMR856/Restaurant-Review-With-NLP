import subprocess
import sys

from constants import GENERATED_DIR, PROTO_FILE


def ensure_proto_modules():
    """Generate Python gRPC bindings from the shared proto contract when needed."""
    if not PROTO_FILE.exists():
        raise FileNotFoundError(f"Proto contract not found at {PROTO_FILE}")

    GENERATED_DIR.mkdir(exist_ok=True)
    init_file = GENERATED_DIR / "__init__.py"
    if not init_file.exists():
        init_file.write_text("", encoding="utf-8")

    pb2_file = GENERATED_DIR / "sentiment_pb2.py"
    grpc_file = GENERATED_DIR / "sentiment_pb2_grpc.py"
    should_generate = (
        # Regenerate if either file is missing
        (not pb2_file.exists())
        or (not grpc_file.exists())
        # Regenerate if the proto file is newer than either generated file
        or (PROTO_FILE.stat().st_mtime > pb2_file.stat().st_mtime)
        or (PROTO_FILE.stat().st_mtime > grpc_file.stat().st_mtime)
    )


    # python -m grpc_tools.protoc \
    #   -I/path/to/proto/directory \
    #   --python_out=/path/to/generated \
    #   --grpc_python_out=/path/to/generated \
    #   /path/to/sentiment.proto
    if should_generate:
        subprocess.run(
            [
                sys.executable,
                "-m",
                "grpc_tools.protoc",
                f"-I{PROTO_FILE.parent}",
                f"--python_out={GENERATED_DIR}",
                f"--grpc_python_out={GENERATED_DIR}",
                str(PROTO_FILE),
            ],
            check=True,
        )

    if str(GENERATED_DIR) not in sys.path:
        sys.path.insert(0, str(GENERATED_DIR))

    import sentiment_pb2  # type: ignore
    import sentiment_pb2_grpc  # type: ignore

    return sentiment_pb2, sentiment_pb2_grpc
