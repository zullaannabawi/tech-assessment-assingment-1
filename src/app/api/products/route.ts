import { MOCK_DEVICES } from '@/features/product-catalog/infrastructure/mock-data'

export async function GET() {
  return Response.json(MOCK_DEVICES)
}
