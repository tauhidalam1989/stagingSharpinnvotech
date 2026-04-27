import { Product, Blog, ServicePage } from './api';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://sharpinnvotech.com';
const ORG_NAME = 'Sharp Innovation';
const LOGO_URL = `${SITE_URL}/assets/logo/SLogo.png`;

export function getOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    'name': ORG_NAME,
    'url': SITE_URL,
    'logo': LOGO_URL,
    'sameAs': [
      'https://www.facebook.com/profile.php?id=61556338118947',
      'https://x.com/sharpInnvo1351',
      'https://www.linkedin.com/company/sharp-innovations-company-for-information-technology-%D8%B4%D8%B1%D9%83%D8%A9-%D8%A7%D8%A8%D8%AA%D9%83%D8%A7%D8%B1%D8%A7%D8%AA-%D8%AD%D8%A7%D8%AF%D8%A9-%D9%84%D8%AA%D9%82%D9%86%D9%8A%D8%A9-%D8%A7%D9%84%D9%85%D8%B9%D9%84%D9%88%D9%85%D8%A7%D8%AA/',
      'https://www.instagram.com/sharpinnovations2104/'
    ],
    'contactPoint': {
      '@type': 'ContactPoint',
      'telephone': '+966 53 140 9624',
      'contactType': 'customer service',
      'areaServed': 'AE',
      'availableLanguage': ['en', 'ar']
    }
  };
}

export function getWebSiteSchema(lang: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    'name': ORG_NAME,
    'url': SITE_URL,
    'inLanguage': lang,
    'publisher': {
      '@id': `${SITE_URL}/#organization`
    }
  };
}

export function getProductSchema(product: Product, lang: string) {
  const isAr = lang === 'ar';
  const title = isAr ? (product.titleAr || product.title) : product.title;
  const description = isAr ? (product.shortDescriptionAr || product.shortDescription) : product.shortDescription;

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    'name': title,
    'description': description,
    'image': product.cardIcon || LOGO_URL,
    'sku': `PROD-${product.id}`,
    'brand': {
      '@type': 'Brand',
      'name': ORG_NAME
    },
    'url': `${SITE_URL}/${lang}/products/${product.slug}`,
    'offers': {
      '@type': 'Offer',
      'url': `${SITE_URL}/${lang}/products/${product.slug}`,
      'priceCurrency': 'AED',
      'availability': 'https://schema.org/InStock',
      'seller': {
        '@type': 'Organization',
        'name': ORG_NAME
      }
    }
  };
}

export function getBlogSchema(blog: Blog, lang: string) {
  const isAr = lang === 'ar';
  const title = isAr ? (blog.titleAr || blog.title) : blog.title;
  const description = isAr ? (blog.excerptAr || blog.excerpt) : blog.excerpt;

  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    'headline': title,
    'description': description,
    'image': blog.featuredImage || LOGO_URL,
    'datePublished': blog.createdAt,
    'dateModified': blog.createdAt, // Ideally use updatedAt if available
    'author': {
      '@type': 'Person',
      'name': blog.creator?.name || ORG_NAME
    },
    'publisher': {
      '@type': 'Organization',
      'name': ORG_NAME,
      'logo': {
        '@type': 'ImageObject',
        'url': LOGO_URL
      }
    },
    'mainEntityOfPage': {
      '@type': 'WebPage',
      '@id': `${SITE_URL}/${lang}/blogs/${blog.slug}`
    }
  };
}

export function getServiceSchema(service: ServicePage, lang: string) {
  const isAr = lang === 'ar';
  const title = isAr ? (service.heroTitleAr || service.heroTitle) : service.heroTitle;
  const description = isAr ? (service.heroIntroductionAr || service.heroIntroduction) : service.heroIntroduction;

  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    'serviceType': 'IT Solutions',
    'provider': {
      '@type': 'Organization',
      'name': ORG_NAME
    },
    'name': title,
    'description': description,
    'areaServed': 'UAE',
    'hasOfferCatalog': {
      '@type': 'OfferCatalog',
      'name': 'IT Services',
      'itemListElement': [
        {
          '@type': 'Offer',
          'itemOffered': {
            '@type': 'Service',
            'name': title
          }
        }
      ]
    }
  };
}

export function getBreadcrumbSchema(items: { name: string; item: string }[], lang: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': items.map((item, index) => ({
      '@type': 'ListItem',
      'position': index + 1,
      'name': item.name,
      'item': item.item.startsWith('http') ? item.item : `${SITE_URL}${item.item}`
    }))
  };
}

export function getWebPageSchema(title: string, description: string, lang: string, type: 'AboutPage' | 'ContactPage' | 'WebPage' = 'WebPage') {
  return {
    '@context': 'https://schema.org',
    '@type': type,
    'name': title,
    'description': description,
    'publisher': {
      '@id': `${SITE_URL}/#organization`
    },
    'inLanguage': lang
  };
}
