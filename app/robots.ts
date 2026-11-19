import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://qrdineing.vercel.app";

  return {
    rules: {
      userAgent: "*",
      allow: ["/", "/restaurant/", "/privacy", "/terms", "/compliance", "/security", "/refund"],
      disallow: [
        "/login",
        "/signup",
        "/forgot-password",
        "/admin/",
        "/kitchen/",
        "/waiter/",
        "/super-admin/",
        "/api/",
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
