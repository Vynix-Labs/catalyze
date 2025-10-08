export function mapMonnifyStatus(
  status: string
): "pending" | "processing" | "completed" | "failed" {
  switch (status) {
    case "SUCCESS":
      return "completed";
    case "FAILED":
      return "failed";
    case "PROCESSING":
      return "processing";
    default:
      return "pending";
  }
}