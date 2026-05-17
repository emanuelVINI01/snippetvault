import { dictionaries } from "@/src/i18n/dictionaries";
import { siteConfig } from "@/src/lib/site";

export function getHomeJsonLd() {
  return [
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: siteConfig.name,
      url: siteConfig.url,
      applicationCategory: "UtilitiesApplication",
      operatingSystem: "Web",
      description: siteConfig.description,
      image: `${siteConfig.url}${siteConfig.ogImage}`,
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
      },
      creator: {
        "@type": "Person",
        name: siteConfig.creator,
        url: siteConfig.creatorUrl,
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: dictionaries.pt.home.faqs.map((faq) => ({
        "@type": "Question",
        name: faq.q,
        acceptedAnswer: {
          "@type": "Answer",
          text: faq.a,
        },
      })),
    },
  ];
}
