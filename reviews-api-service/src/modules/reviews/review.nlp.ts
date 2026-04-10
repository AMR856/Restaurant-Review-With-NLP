import path from "path";
import * as grpc from "@grpc/grpc-js";
import * as protoLoader from "@grpc/proto-loader";

export type ReviewSentiment = "positive" | "negative";

export type ReviewSentimentResult = {
  sentiment: ReviewSentiment;
  confidence: number;
};

type SentimentAnalyzerClient = grpc.Client & {
  AnalyzeReview(
    request: { review: string },
    callback: (
      error: grpc.ServiceError | null,
      response: AnalyzeReviewResponse,
    ) => void,
  ): void;
};

type AnalyzeReviewResponse = {
  sentiment?: string;
  confidence?: number;
};

let grpcClient: SentimentAnalyzerClient | null = null;

const createGrpcClient = (): SentimentAnalyzerClient => {
  const protoPath =
    process.env.NLP_GRPC_PROTO_PATH ??
    path.resolve(process.cwd(), "../shared-proto/sentiment.proto");

  const packageDefinition = protoLoader.loadSync(protoPath, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
  });

  const loadedProto = grpc.loadPackageDefinition(
    packageDefinition,
  ) as unknown as {
    sentiment: {
      SentimentAnalyzer: new (
        address: string,
        credentials: grpc.ChannelCredentials,
      ) => SentimentAnalyzerClient;
    };
  };

  const grpcHost = process.env.NLP_GRPC_HOST ?? "127.0.0.1";
  const grpcPort = process.env.NLP_GRPC_PORT ?? "50051";
  const target = process.env.NLP_GRPC_TARGET ?? `${grpcHost}:${grpcPort}`;

  return new loadedProto.sentiment.SentimentAnalyzer(
    target,
    grpc.credentials.createInsecure(),
  );
};

const getGrpcClient = (): SentimentAnalyzerClient => {
  if (!grpcClient) {
    grpcClient = createGrpcClient();
  }

  return grpcClient;
};

export const ReviewNlpService = {
  async analyze(content: string): Promise<ReviewSentimentResult> {
    const client = getGrpcClient();

    const response = await new Promise<AnalyzeReviewResponse>(
      (resolve, reject) => {
        client.AnalyzeReview({ review: content }, (error, grpcResponse) => {
          if (error) {
            reject(error);
            return;
          }

          resolve(grpcResponse);
        });
      },
    );

    const normalizedSentiment = (response.sentiment ?? "").toLowerCase();
    if (
      normalizedSentiment !== "positive" &&
      normalizedSentiment !== "negative"
    ) {
      throw new Error(
        `Unexpected sentiment received from NLP service: ${response.sentiment}`,
      );
    }

    return {
      sentiment: normalizedSentiment,
      confidence: Number(response.confidence ?? 0),
    };
  },
};
