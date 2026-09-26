import type { MetadataRoute } from "next";
import { getProducts } from "@/services";

export const revalidate = 3600; // Update sitemap setiap 1 jam

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://jovique.com";

  // Ambil produk katalog untuk diindeks oleh Googlebot
  const productsResponse = await getProducts({ limit: 100 }).catch(() => ({
    data: [],
    totalCount: 0,
    page: 1,
    limit: 100,
    totalPages: 0,
    hasMore: false,
  }));

  const productUrls: MetadataRoute.Sitemap = productsResponse.data.map(
    (product) => ({
      url: `${siteUrl}/products/${product.slug}`,
      lastModified: product.created_at
        ? new Date(product.created_at)
        : new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    })
  );

  return [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${siteUrl}/products`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/cart`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.3,
    },
    {
      url: `${siteUrl}/wishlist`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.3,
    },
    ...productUrls,
  ];
}
