import { MOCK_DEVICES } from '@/features/product-catalog/infrastructure/mock-data'

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const device = MOCK_DEVICES.find((d) => d.id === id)
  if (!device) {
    return Response.json({ error: 'Device not found.' }, { status: 404 })
  }
  return Response.json(device)
}
