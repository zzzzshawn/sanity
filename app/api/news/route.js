import { env } from "../../../lib/env";
export async function GET() {
  return new Response(JSON.stringify({ newsUrl: env.NEWS_URL }), {
    status: 200,
  });
}
