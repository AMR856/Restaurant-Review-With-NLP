import argparse
import subprocess
import sys
from pathlib import Path

import grpc
from utils.ensure_modules import ensure_proto_modules

def main() -> None:
    parser = argparse.ArgumentParser(description="Test gRPC sentiment server")
    parser.add_argument("review", help="Review text")
    parser.add_argument(
        "--target",
        default="localhost:50051",
        help="gRPC target in host:port format",
    )
    args = parser.parse_args()

    sentiment_pb2, sentiment_pb2_grpc = ensure_proto_modules()

    with grpc.insecure_channel(args.target) as channel:
        stub = sentiment_pb2_grpc.SentimentAnalyzerStub(channel)
        response = stub.AnalyzeReview(
            sentiment_pb2.AnalyzeReviewRequest(review=args.review)
        )

    print(f"sentiment={response.sentiment} confidence={response.confidence:.4f}")


if __name__ == "__main__":
    main()
