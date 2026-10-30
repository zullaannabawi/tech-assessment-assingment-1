import { ProductDetailPage } from '@/features/product-catalog/presentation/pages/product-detail-page'

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  // key={id} remounts the client page when navigating between products, so
  // its loading state resets exactly like the old setLoading(true) did.
  return <ProductDetailPage key={id} id={id} />
}
