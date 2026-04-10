import os
import subprocess
import sys
from concurrent import futures
from pathlib import Path

import grpc
from dotenv import load_dotenv
from transformers import pipeline
from utils.ensure_modules import ensure_proto_modules

load_dotenv()

sentiment_pipeline = None

def _get_sentiment_pipeline():
    global sentiment_pipeline
    if sentiment_pipeline is None:
        sentiment_pipeline = pipeline(
            "sentiment-analysis",
            model="distilbert-base-uncased-finetuned-sst-2-english",
        )
    return sentiment_pipeline

sentiment_pb2, sentiment_pb2_grpc = ensure_proto_modules()

def _analyze_review_text(review: str) -> tuple[str, float]:
    if not review or len(review.strip()) == 0:
        raise ValueError("Review cannot be empty")

    result = _get_sentiment_pipeline()(review)[0]
    label = result["label"].lower()
    confidence = result["score"]
    return label, confidence

class SentimentAnalyzerServicer(sentiment_pb2_grpc.SentimentAnalyzerServicer):
    def AnalyzeReview(self, request, context):
        try:
            label, confidence = _analyze_review_text(request.review)
            return sentiment_pb2.AnalyzeReviewResponse(
                sentiment=label,
                confidence=confidence,
            )
        except ValueError as err:
            context.set_code(grpc.StatusCode.INVALID_ARGUMENT)
            context.set_details(str(err))
            return sentiment_pb2.AnalyzeReviewResponse()
        except Exception as err:  # pragma: no cover
            context.set_code(grpc.StatusCode.INTERNAL)
            context.set_details(f"NLP inference failed: {err}")
            return sentiment_pb2.AnalyzeReviewResponse()


def serve() -> None:
    host = os.getenv("NLP_GRPC_HOST", "0.0.0.0")
    port = int(os.getenv("NLP_GRPC_PORT", "50051"))
    bind_addr = f"{host}:{port}"

    server = grpc.server(futures.ThreadPoolExecutor(max_workers=4))
    sentiment_pb2_grpc.add_SentimentAnalyzerServicer_to_server(
        SentimentAnalyzerServicer(),
        server,
    )

    server.add_insecure_port(bind_addr)
    server.start()
    print(f"gRPC sentiment server listening on {bind_addr}")
    server.wait_for_termination()
