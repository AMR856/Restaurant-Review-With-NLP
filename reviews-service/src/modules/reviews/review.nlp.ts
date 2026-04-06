export type ReviewSentimentResult = {
  sentiment: "positive";
  confidence: number;
};

export const ReviewNlpService = {
  async analyze(_content: string): Promise<ReviewSentimentResult> {
    return {
      sentiment: "positive",
      confidence: 1,
    };
  },
};