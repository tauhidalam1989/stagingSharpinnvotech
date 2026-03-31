const API_URL = process.env.NEXT_PUBLIC_API_URL || '';
const API_KEY = process.env.NEXT_PUBLIC_API_KEY || '';

// Helper to clean up undefined/null params before URLSearchParams
function cleanParams(params: any) {
    if (!params) return {};
    const cleaned: any = {};
    Object.keys(params).forEach(key => {
        if (params[key] !== undefined && params[key] !== null && params[key] !== '' && params[key] !== 'all') {
            cleaned[key] = params[key].toString();
        }
    });
    return cleaned;
}

export interface ProductCategory {
    id: number;
    name: string;
    nameAr?: string;
    icon?: string;
    slug: string;
    order: number;
    isActive: boolean;
}

export interface HowItWorkItem {
    icon: string;
    title: string;
    titleAr?: string;
    description: string;
    descriptionAr?: string;
}

export interface VisionItem {
    icon: string;
    text: string;
    textAr?: string;
}

export interface ProductFeatureItem {
    icon: string;
    text: string;
}

export interface Product {
    id: number;
    title: string;
    titleAr?: string;
    slug: string;
    categoryId?: number;
    category?: ProductCategory;
    cardIcon?: string;
    shortDescription?: string;
    shortDescriptionAr?: string;

    // Hero
    heroTitle?: string;
    heroTitleAr?: string;
    heroSubtitle?: string;
    heroSubtitleAr?: string;
    heroDescription?: string;
    heroDescriptionAr?: string;
    heroIcon?: string;
    heroPrimaryCtaText?: string;
    heroPrimaryCtaTextAr?: string;
    heroPrimaryCtaLink?: string;
    heroSecondaryCtaText?: string;
    heroSecondaryCtaTextAr?: string;
    heroSecondaryCtaLink?: string;
    heroImageAlt?: string;
    heroImageAltAr?: string;

    // About
    aboutTitle?: string;
    aboutTitleAr?: string;
    aboutContent?: string;
    aboutContentAr?: string;
    aboutImage?: string;
    aboutImageAlt?: string;
    aboutImageAltAr?: string;

    // Sections
    howItWorks?: HowItWorkItem[];
    keyFeaturesTitle?: string;
    keyFeaturesTitleAr?: string;
    keyFeaturesImages?: string[];
    keyFeaturesImageAlt?: string;
    keyFeaturesImageAltAr?: string;
    keyFeaturesList?: ProductFeatureItem[];
    keyFeaturesListAr?: ProductFeatureItem[];
    benefits?: BenefitItem[];
    visionTitle?: string;
    visionTitleAr?: string;
    visionSubtitle?: string;
    visionSubtitleAr?: string;
    visionItems?: VisionItem[];
    whySharpTitle?: string;
    whySharpTitleAr?: string;
    whySharpContent?: string;
    whySharpContentAr?: string;
    whySharpImage?: string;
    whySharpImageAlt?: string;
    whySharpImageAltAr?: string;

    // CTA
    ctaTitle?: string;
    ctaTitleAr?: string;
    ctaDescription?: string;
    ctaDescriptionAr?: string;
    ctaButton1Text?: string;
    ctaButton1TextAr?: string;
    ctaButton1Link?: string;
    ctaButton2Text?: string;
    ctaButton2TextAr?: string;
    ctaButton2Link?: string;

    // Extra
    faqs?: FAQItem[];
    metaTitle?: string;
    metaTitleAr?: string;
    metaDescription?: string;
    metaDescriptionAr?: string;
    metaKeywords?: string;
    metaKeywordsAr?: string;
    gallery?: string[];
    galleryAlt?: string;
    galleryAltAr?: string;
    order: number;
    isPublished: boolean;
    views?: number;
    createdAt?: string;
    updatedAt?: string;
}

export interface Client {
    id: number;
    name: string;
    logo: string;
    isActive: boolean;
    order: number;
    createdAt?: string;
    updatedAt?: string;
}

export interface Partner {
    id: number;
    name: string;
    logo: string;
    isActive: boolean;
    order: number;
    createdAt?: string;
    updatedAt?: string;
}

export interface Certificate {
    id: number;
    name: string;
    image: string;
    isActive: boolean;
    order: number;
    createdAt?: string;
    updatedAt?: string;
}

export interface NewsletterSubscription {
    id: string;
    email: string;
    createdAt: string;
    status?: 'Pending' | 'Contacted';
}

export interface Blog {
    id: number;
    title: string;
    slug: string;
    titleAr?: string;
    excerpt?: string;
    excerptAr?: string;
    content: string;
    contentAr?: string;
    featuredImage?: string;
    featuredImageAlt?: string;
    featuredImageAltAr?: string;
    gallery?: string[];
    galleryAlt?: string;
    galleryAltAr?: string;
    categories?: string[] | string;
    categoriesAr?: string[] | string;
    tags?: string[] | string;
    tagsAr?: string[] | string;
    isPublished?: boolean;
    metaTitle?: string;
    metaTitleAr?: string;
    metaDescription?: string;
    metaDescriptionAr?: string;
    metaKeywords?: string;
    metaKeywordsAr?: string;
    createdAt: string;
    creator?: {
        name: string;
    };
}

export interface UserProfile {
    id: number;
    name: string;
    email: string;
    phone?: string;
    avatar?: string;
    role: string;
    isActive: boolean;
    lastLogin?: string;
    createdAt: string;
}

export interface ServiceCategory {
    id: number;
    name: string;
    nameAr?: string;
    icon?: string;
    slug: string;
    order: number;
    isActive: boolean;
}

export interface ProcessItem {
    title: string;
    titleAr?: string;
    description: string;
    descriptionAr?: string;
    icon?: string;
}

export interface CapabilityItem {
    title: string;
    titleAr?: string;
    description?: string;
    descriptionAr?: string;
    icon?: string;
}

export interface BenefitItem {
    icon: string;
    title: string;
    titleAr?: string;
    description: string;
    descriptionAr?: string;
}

export interface WhyChooseUsItem {
    title: string;
    titleAr?: string;
    description?: string;
    descriptionAr?: string;
    iconType?: 'file' | 'fa';
    iconPath?: string;
    iconFA?: string;
}

export interface FAQItem {
    question: string;
    questionAr?: string;
    answer: string;
    answerAr?: string;
}

export interface AboutPillarItem {
    title: string;
    titleAr?: string;
    iconType?: 'file' | 'fa';
    iconPath?: string;
    iconFA?: string;
}

export interface IndustryItem {
    title: string;
    titleAr?: string;
    iconType?: 'file' | 'fa';
    iconPath?: string;
    iconFA?: string;
}

export interface CriticalCardItem {
    title: string;
    titleAr?: string;
    iconType?: 'file' | 'fa';
    iconPath?: string;
    iconFA?: string;
}

export interface ServicePage {
    id: number;
    slug: string;
    categoryId?: number;
    category?: ServiceCategory;
    heroTitle: string;
    heroTitleAr?: string;
    heroTagline?: string;
    heroTaglineAr?: string;
    heroIntroduction?: string;
    heroIntroductionAr?: string;
    heroImage?: string;
    heroIcon?: string;
    cardIcon?: string;
    primaryCtaText?: string;
    primaryCtaTextAr?: string;
    primaryCtaLink?: string;
    secondaryCtaText?: string;
    secondaryCtaTextAr?: string;
    secondaryCtaLink?: string;
    overviewSectionTitle?: string;
    overviewSectionTitleAr?: string;
    processSectionTitle?: string;
    processSectionTitleAr?: string;
    capabilitiesSectionTitle?: string;
    capabilitiesSectionTitleAr?: string;
    benefitsSectionTitle?: string;
    benefitsSectionTitleAr?: string;
    whyChooseUsSectionTitle?: string;
    whyChooseUsSectionTitleAr?: string;
    whyChooseUsDescription?: string;
    whyChooseUsDescriptionAr?: string;
    whyChooseUsBottomNote?: string;
    whyChooseUsBottomNoteAr?: string;
    aboutSectionTitle?: string;
    aboutSectionTitleAr?: string;
    aboutSectionDescription?: string;
    aboutSectionDescriptionAr?: string;
    aboutSectionImage?: string;
    aboutSectionImageAlt?: string;
    aboutSectionImageAltAr?: string;
    aboutSectionBottomNote?: string;
    aboutSectionBottomNoteAr?: string;
    industriesSectionTitle?: string;
    industriesSectionTitleAr?: string;
    industriesSectionDescription?: string;
    industriesSectionDescriptionAr?: string;
    industriesImage?: string;
    industriesImageAlt?: string;
    industriesImageAltAr?: string;
    industriesSectionBottomNote?: string;
    industriesSectionBottomNoteAr?: string;
    criticalSectionTitle?: string;
    criticalSectionTitleAr?: string;
    criticalSectionDescription?: string;
    criticalSectionDescriptionAr?: string;
    criticalSectionButtonText?: string;
    criticalSectionButtonTextAr?: string;
    criticalSectionButtonLink?: string;
    criticalRightTitle?: string;
    criticalRightTitleAr?: string;
    process?: ProcessItem[];
    capabilities?: CapabilityItem[];
    benefits?: BenefitItem[];
    whyChooseUs?: WhyChooseUsItem[];
    faqs?: FAQItem[];
    aboutPillars?: AboutPillarItem[];
    industries?: IndustryItem[];
    criticalCards?: CriticalCardItem[];
    ctaMessage?: string;
    ctaMessageAr?: string;
    ctaPrimaryText?: string;
    ctaPrimaryTextAr?: string;
    ctaPrimaryLink?: string;
    ctaSecondaryText?: string;
    ctaSecondaryTextAr?: string;
    ctaSecondaryLink?: string;
    metaTitle?: string;
    metaTitleAr?: string;
    metaDescription?: string;
    metaDescriptionAr?: string;
    metaKeywords?: string;
    metaKeywordsAr?: string;
    order?: number;
    isPublished?: boolean;
    createdAt?: string;
    updatedAt?: string;
    views?: number;
}

export interface ApiResponse<T> {
    success: boolean;
    status_code: number;
    message: string;
    result?: T;
    data?: T;
}

export async function getPublishedProducts(): Promise<Product[]> {
    try {
        const res = await fetch(`${API_URL}/products/published`, {
            headers: {
                'x-api-key': API_KEY,
            },
            next: { revalidate: 60 },
        });
        if (!res.ok) {
            console.error(`Failed to fetch products: ${res.status}`);
            return [];
        }
        const data: ApiResponse<Product[]> = await res.json();

        // Return empty array if data.data is not an array (stability fix)
        if (!Array.isArray(data.data)) {
            console.error('Expected products array but received:', typeof data.data);
            return [];
        }

        return data.data;
    } catch (error) {
        console.error('Error fetching products:', error);
        return [];
    }
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
    try {
        const res = await fetch(`${API_URL}/products/slug/${slug}`, {
            headers: {
                'x-api-key': API_KEY,
            },
            next: { revalidate: 10 },
        });

        if (!res.ok) {
            return null;
        }

        const data: ApiResponse<Product> = await res.json();
        return data.result || data.data || null;
    } catch (error) {
        console.error(`Error fetching product with slug ${slug}:`, error);
        return null;
    }
}
export async function getPublishedBlogs(params?: { page?: number; limit?: number; search?: string; category?: string; tag?: string }): Promise<{ blogs: Blog[]; total: number }> {
    try {
        const query = new URLSearchParams();
        if (params?.page) query.append('page', params.page.toString());
        if (params?.limit) query.append('limit', params.limit.toString());
        if (params?.search) query.append('search', params.search);
        if (params?.category) query.append('category', params.category);
        if (params?.tag) query.append('tag', params.tag);
        query.append('status', 'published');
        query.append('sortBy', 'createdAt');
        query.append('sortOrder', 'DESC');

        const res = await fetch(`${API_URL}/blog?${query.toString()}`, {
            headers: {
                'x-api-key': API_KEY,
            },
            next: { revalidate: 60 },
        });

        if (!res.ok) {
            return { blogs: [], total: 0 };
        }

        const data: ApiResponse<Blog[]> & { pagination?: { total: number } } = await res.json();
        return {
            blogs: data.result || data.data || [],
            total: data.pagination?.total || 0
        };
    } catch (error) {
        console.error('Error fetching blogs:', error);
        return { blogs: [], total: 0 };
    }
}

export async function getBlogFiltersMetadata(): Promise<{ categories: string[]; tags: string[]; categoriesAr: string[]; tagsAr: string[] }> {
    try {
        // Fetch all published blogs to extract unique categories and tags (consistent with Angular logic)
        const res = await fetch(`${API_URL}/blog?status=published&limit=1000`, {
            headers: { 'x-api-key': API_KEY },
            next: { revalidate: 60 },
        });

        if (!res.ok) return { categories: [], tags: [], categoriesAr: [], tagsAr: [] };

        const data: ApiResponse<Blog[]> = await res.json();
        const blogs = data.result || data.data || [];

        const categorySet = new Set<string>();
        const tagSet = new Set<string>();
        const categorySetAr = new Set<string>();
        const tagSetAr = new Set<string>();

        blogs.forEach((blog: Blog) => {
            // Process categories
            const cats = Array.isArray(blog.categories) ? blog.categories : (typeof blog.categories === 'string' ? (blog.categories as string).split(',').map((c: string) => c.trim()) : []);
            cats.forEach((cat: string) => cat && categorySet.add(cat));

            // Process tags
            const tags = Array.isArray(blog.tags) ? blog.tags : (typeof blog.tags === 'string' ? (blog.tags as string).split(',').map((t: string) => t.trim()) : []);
            tags.forEach((tag: string) => tag && tagSet.add(tag));

            // Process categoriesAr
            const catsAr = Array.isArray(blog.categoriesAr) ? blog.categoriesAr : (typeof blog.categoriesAr === 'string' ? (blog.categoriesAr as string).split(',').map((c: string) => c.trim()) : []);
            catsAr.forEach((cat: string) => cat && categorySetAr.add(cat));

            // Process tagsAr
            const tagsAr = Array.isArray(blog.tagsAr) ? blog.tagsAr : (typeof blog.tagsAr === 'string' ? (blog.tagsAr as string).split(',').map((t: string) => t.trim()) : []);
            tagsAr.forEach((tag: string) => tag && tagSetAr.add(tag));
        });

        return {
            categories: Array.from(categorySet).sort(),
            tags: Array.from(tagSet).sort(),
            categoriesAr: Array.from(categorySetAr).sort(),
            tagsAr: Array.from(tagSetAr).sort(),
        };
    } catch (error) {
        console.error('Error fetching blog filter metadata:', error);
        return { categories: [], tags: [], categoriesAr: [], tagsAr: [] };
    }
}

export async function getBlogBySlug(slug: string): Promise<Blog | null> {
    try {
        const res = await fetch(`${API_URL}/blog/slug/${slug}`, {
            headers: {
                'x-api-key': API_KEY,
            },
            next: { revalidate: 60 },
        });

        if (!res.ok) {
            // Try fetching by ID if slug fails (some identifiers might be IDs)
            if (!isNaN(Number(slug))) {
                const resId = await fetch(`${API_URL}/blog/${slug}`, {
                    headers: {
                        'x-api-key': API_KEY,
                    },
                });
                if (resId.ok) {
                    const dataId: ApiResponse<Blog> = await resId.json();
                    return dataId.result || dataId.data || null;
                }
            }
            return null;
        }
        const data: ApiResponse<Blog> = await res.json();
        return data.result || data.data || null;
    } catch (error) {
        console.error(`Error fetching blog with slug ${slug}:`, error);
        return null;
    }
}

export async function getRelatedBlogs(blogId: number, limit: number = 3): Promise<Blog[]> {
    try {
        const res = await fetch(`${API_URL}/blog?status=published&limit=10`, {
            headers: { 'x-api-key': API_KEY },
            next: { revalidate: 60 },
        });

        if (!res.ok) return [];

        const data: ApiResponse<Blog[]> = await res.json();
        const blogs = data.result || data.data || [];

        return blogs.filter(b => b.id !== blogId).slice(0, limit);
    } catch (error) {
        console.error('Error fetching related blogs:', error);
        return [];
    }
}

export async function sendContactForm(payload: any): Promise<ApiResponse<any>> {
    try {
        const res = await fetch(`${API_URL}/mail/send-mail`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': API_KEY,
            },
            body: JSON.stringify(payload),
        });

        const data = await res.json();
        return data;
    } catch (error) {
        console.error('Error sending contact form:', error);
        return { success: false, status_code: 500, message: 'Internal server error' };
    }
}

export async function sendResume(formData: FormData): Promise<ApiResponse<any>> {
    try {
        const res = await fetch(`${API_URL}/mail/send-resume`, {
            method: 'POST',
            headers: {
                'x-api-key': API_KEY,
            },
            body: formData,
        });

        const data = await res.json();
        return data;
    } catch (error) {
        console.error('Error sending resume:', error);
        return { success: false, status_code: 500, message: 'Internal server error' };
    }
}

export async function getClients(status?: string): Promise<Client[]> {
    try {
        const query = status ? `?status=${status}` : '';
        const res = await fetch(`${API_URL}/client-partner/clients${query}`, {
            headers: { 'x-api-key': API_KEY },
            next: { revalidate: 10 },
        });
        if (!res.ok) {
            console.error(`Failed to fetch clients: ${res.status}`);
            return [];
        }
        const data: ApiResponse<Client[]> = await res.json();
        console.log('DEBUG: getClients response:', JSON.stringify(data).substring(0, 200));
        // Backend might return result or data
        const items = data.data || data.result || [];
        return Array.isArray(items) ? items : [];
    } catch (error) {
        console.error('Error fetching clients:', error);
        return [];
    }
}

export async function getPartners(status?: string): Promise<Partner[]> {
    try {
        const query = status ? `?status=${status}` : '';
        const res = await fetch(`${API_URL}/client-partner/partners${query}`, {
            headers: { 'x-api-key': API_KEY },
            next: { revalidate: 10 },
        });
        if (!res.ok) {
            console.error(`Failed to fetch partners: ${res.status}`);
            return [];
        }
        const data: ApiResponse<Partner[]> = await res.json();
        console.log('DEBUG: getPartners response:', JSON.stringify(data).substring(0, 200));
        const items = data.data || data.result || [];
        return Array.isArray(items) ? items : [];
    } catch (error) {
        console.error('Error fetching partners:', error);
        return [];
    }
}

export async function getCertificates(status?: string): Promise<Certificate[]> {
    try {
        const query = status ? `?status=${status}` : '';
        const res = await fetch(`${API_URL}/client-partner/certificates${query}`, {
            headers: { 'x-api-key': API_KEY },
            next: { revalidate: 10 },
        });
        if (!res.ok) {
            console.error(`Failed to fetch certificates: ${res.status}`);
            return [];
        }
        const data: ApiResponse<Certificate[]> = await res.json();
        console.log('DEBUG: getCertificates response:', JSON.stringify(data).substring(0, 200));
        const items = data.data || data.result || [];
        return Array.isArray(items) ? items : [];
    } catch (error) {
        console.error('Error fetching certificates:', error);
        return [];
    }
}

export async function getAdminBlogs(params?: any): Promise<{ blogs: Blog[]; total: number }> {
    try {
        const query = new URLSearchParams(cleanParams(params)).toString();
        const res = await fetch(`${API_URL}/blog${query ? `?${query}` : ''}`, {
            headers: {
                'x-api-key': API_KEY,
                'accesstoken': `Bearer ${localStorage.getItem('auth_token')}`
            },
        });
        const data = await res.json();
        const items = data.result || data.data || [];
        return {
            blogs: Array.isArray(items) ? items : [],
            total: data.pagination?.total || 0
        };
    } catch (error) {
        console.error('Error fetching admin blogs:', error);
        return { blogs: [], total: 0 };
    }
}

export async function getBlogStats(): Promise<any> {
    try {
        const res = await fetch(`${API_URL}/blog/stats`, {
            headers: {
                'x-api-key': API_KEY,
                'accesstoken': `Bearer ${localStorage.getItem('auth_token')}`
            },
        });
        const data = await res.json();
        return data.result || data.data || {};
    } catch (error) {
        console.error('Error fetching blog stats:', error);
        return {};
    }
}

export async function getBlogById(id: number): Promise<Blog | null> {
    try {
        const res = await fetch(`${API_URL}/blog/${id}`, {
            headers: {
                'x-api-key': API_KEY,
                'accesstoken': `Bearer ${localStorage.getItem('auth_token')}`
            },
        });
        const data = await res.json();
        return data.result || data.data || null;
    } catch (error) {
        console.error('Error fetching blog by id:', error);
        return null;
    }
}

export async function createBlog(formData: FormData): Promise<ApiResponse<Blog>> {
    try {
        const res = await fetch(`${API_URL}/blog`, {
            method: 'POST',
            headers: {
                'x-api-key': API_KEY,
                'accesstoken': `Bearer ${localStorage.getItem('auth_token')}`
            },
            body: formData,
        });
        return await res.json();
    } catch (error) {
        console.error('Error creating blog:', error);
        return { success: false, status_code: 500, message: 'Internal server error' };
    }
}

export async function updateBlog(id: number, payload: any): Promise<ApiResponse<Blog>> {
    try {
        const isFormData = payload instanceof FormData;
        const res = await fetch(`${API_URL}/blog/${id}`, {
            method: 'PUT',
            headers: {
                'x-api-key': API_KEY,
                'accesstoken': `Bearer ${localStorage.getItem('auth_token')}`,
                ...(isFormData ? {} : { 'Content-Type': 'application/json' })
            },
            body: isFormData ? payload : JSON.stringify(payload),
        });
        return await res.json();
    } catch (error) {
        console.error('Error updating blog:', error);
        return { success: false, status_code: 500, message: 'Internal server error' };
    }
}

export async function deleteBlog(id: number): Promise<ApiResponse<void>> {
    try {
        const res = await fetch(`${API_URL}/blog/${id}`, {
            method: 'DELETE',
            headers: {
                'x-api-key': API_KEY,
                'accesstoken': `Bearer ${localStorage.getItem('auth_token')}`
            },
        });
        return await res.json();
    } catch (error) {
        console.error('Error deleting blog:', error);
        return { success: false, status_code: 500, message: 'Internal server error' };
    }
}

export async function getAdminServices(params?: any): Promise<{ services: ServicePage[]; total: number }> {
    try {
        const query = new URLSearchParams(cleanParams(params)).toString();
        const res = await fetch(`${API_URL}/services${query ? `?${query}` : ''}`, {
            headers: {
                'x-api-key': API_KEY,
                'accesstoken': `Bearer ${localStorage.getItem('auth_token')}`
            },
        });
        const data = await res.json();
        const items = data.result || data.data || [];
        return {
            services: Array.isArray(items) ? items : [],
            total: data.pagination?.total || 0
        };
    } catch (error) {
        console.error('Error fetching admin services:', error);
        return { services: [], total: 0 };
    }
}

export async function getPublishedServices(): Promise<ServicePage[]> {
    try {
        const res = await fetch(`${API_URL}/services/published`, {
            headers: {
                'x-api-key': API_KEY,
            },
            next: { revalidate: 60 },
        });
        if (!res.ok) {
            console.error(`Failed to fetch services: ${res.status}`);
            return [];
        }
        const data: ApiResponse<ServicePage[]> = await res.json();

        // Return empty array if data.data is not an array (stability fix)
        if (!Array.isArray(data.data)) {
            console.error('Expected services array but received:', typeof data.data);
            return [];
        }

        return data.data;
    } catch (error) {
        console.error('Error fetching services:', error);
        return [];
    }
}

export async function getServiceBySlug(slug: string): Promise<ServicePage | null> {
    try {
        const res = await fetch(`${API_URL}/services/slug/${slug}`, {
            headers: {
                'x-api-key': API_KEY,
            },
            next: { revalidate: 10 },
        });

        if (!res.ok) {
            return null;
        }

        const data: ApiResponse<ServicePage> = await res.json();
        return data.result || data.data || null;
    } catch (error) {
        console.error(`Error fetching service with slug ${slug}:`, error);
        return null;
    }
}

export async function getServiceById(id: number): Promise<ServicePage | null> {
    try {
        const res = await fetch(`${API_URL}/services/${id}`, {
            headers: {
                'x-api-key': API_KEY,
                'accesstoken': `Bearer ${localStorage.getItem('auth_token')}`
            },
        });
        const data = await res.json();
        return data.result || data.data || null;
    } catch (error) {
        console.error('Error fetching service by id:', error);
        return null;
    }
}

export async function createService(formData: FormData): Promise<ApiResponse<ServicePage>> {
    try {
        const res = await fetch(`${API_URL}/services`, {
            method: 'POST',
            headers: {
                'x-api-key': API_KEY,
                'accesstoken': `Bearer ${localStorage.getItem('auth_token')}`
            },
            body: formData,
        });
        return await res.json();
    } catch (error) {
        console.error('Error creating service:', error);
        return { success: false, status_code: 500, message: 'Internal server error' };
    }
}

export async function updateService(id: number, payload: any): Promise<ApiResponse<ServicePage>> {
    try {
        const isFormData = payload instanceof FormData;
        const res = await fetch(`${API_URL}/services/${id}`, {
            method: 'PUT',
            headers: {
                'x-api-key': API_KEY,
                'accesstoken': `Bearer ${localStorage.getItem('auth_token')}`,
                ...(isFormData ? {} : { 'Content-Type': 'application/json' })
            },
            body: isFormData ? payload : JSON.stringify(payload),
        });
        return await res.json();
    } catch (error) {
        console.error('Error updating service:', error);
        return { success: false, status_code: 500, message: 'Internal server error' };
    }
}

export async function deleteService(id: number): Promise<ApiResponse<void>> {
    try {
        const res = await fetch(`${API_URL}/services/${id}`, {
            method: 'DELETE',
            headers: {
                'x-api-key': API_KEY,
                'accesstoken': `Bearer ${localStorage.getItem('auth_token')}`
            },
        });
        return await res.json();
    } catch (error) {
        console.error('Error deleting service:', error);
        return { success: false, status_code: 500, message: 'Internal server error' };
    }
}

export async function getServiceCategories(): Promise<ServiceCategory[]> {
    try {
        const res = await fetch(`${API_URL}/service-categories`, {
            headers: {
                'x-api-key': API_KEY,
            }
        });
        const data = await res.json();
        const items = data.result || data.data || [];
        return Array.isArray(items) ? items : [];
    } catch (error) {
        console.error('Error fetching service categories:', error);
        return [];
    }
}

export async function createServiceCategory(payload: any): Promise<ApiResponse<ServiceCategory>> {
    try {
        const res = await fetch(`${API_URL}/service-categories`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': API_KEY,
                'accesstoken': `Bearer ${localStorage.getItem('auth_token')}`
            },
            body: JSON.stringify(payload),
        });
        return await res.json();
    } catch (error) {
        console.error('Error creating service category:', error);
        return { success: false, status_code: 500, message: 'Internal server error' };
    }
}

export async function updateServiceCategory(id: number, payload: any): Promise<ApiResponse<ServiceCategory>> {
    try {
        const res = await fetch(`${API_URL}/service-categories/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': API_KEY,
                'accesstoken': `Bearer ${localStorage.getItem('auth_token')}`
            },
            body: JSON.stringify(payload),
        });
        return await res.json();
    } catch (error) {
        console.error('Error updating service category:', error);
        return { success: false, status_code: 500, message: 'Internal server error' };
    }
}

export async function deleteServiceCategory(id: number): Promise<ApiResponse<void>> {
    try {
        const res = await fetch(`${API_URL}/service-categories/${id}`, {
            method: 'DELETE',
            headers: {
                'x-api-key': API_KEY,
                'accesstoken': `Bearer ${localStorage.getItem('auth_token')}`
            },
        });
        return await res.json();
    } catch (error) {
        console.error('Error deleting service category:', error);
        return { success: false, status_code: 500, message: 'Internal server error' };
    }
}

export async function getServiceStats(): Promise<any> {
    try {
        const res = await fetch(`${API_URL}/services/stats`, {
            headers: {
                'x-api-key': API_KEY,
                'accesstoken': `Bearer ${localStorage.getItem('auth_token')}`
            },
        });
        const data = await res.json();
        return data.result || data.data || {};
    } catch (error) {
        console.error('Error fetching service stats:', error);
        return {};
    }
}

export async function getAdminProducts(params?: any): Promise<{ products: Product[]; total: number }> {
    try {
        const query = new URLSearchParams(cleanParams(params)).toString();
        const res = await fetch(`${API_URL}/products${query ? `?${query}` : ''}`, {
            headers: {
                'x-api-key': API_KEY,
                'accesstoken': `Bearer ${localStorage.getItem('auth_token')}`
            },
        });
        const data = await res.json();
        const items = data.result || data.data || [];
        return {
            products: Array.isArray(items) ? items : [],
            total: data.pagination?.total || data.total || data.count || (Array.isArray(items) ? items.length : 0)
        };
    } catch (error) {
        console.error('Error fetching admin products:', error);
        return { products: [], total: 0 };
    }
}

export async function getProductById(id: number): Promise<Product | null> {
    try {
        const res = await fetch(`${API_URL}/products/${id}`, {
            headers: {
                'x-api-key': API_KEY,
                'accesstoken': `Bearer ${localStorage.getItem('auth_token')}`
            },
        });
        const data = await res.json();
        return data.result || data.data || null;
    } catch (error) {
        console.error('Error fetching product by id:', error);
        return null;
    }
}

export async function createProduct(formData: FormData): Promise<ApiResponse<Product>> {
    try {
        const res = await fetch(`${API_URL}/products`, {
            method: 'POST',
            headers: {
                'x-api-key': API_KEY,
                'accesstoken': `Bearer ${localStorage.getItem('auth_token')}`
            },
            body: formData,
        });
        return await res.json();
    } catch (error) {
        console.error('Error creating product:', error);
        return { success: false, status_code: 500, message: 'Internal server error' };
    }
}

export async function updateProduct(id: number, payload: any): Promise<ApiResponse<Product>> {
    try {
        const isFormData = payload instanceof FormData;
        const res = await fetch(`${API_URL}/products/${id}`, {
            method: 'PUT',
            headers: {
                'x-api-key': API_KEY,
                'accesstoken': `Bearer ${localStorage.getItem('auth_token')}`,
                ...(isFormData ? {} : { 'Content-Type': 'application/json' })
            },
            body: isFormData ? payload : JSON.stringify(payload),
        });
        return await res.json();
    } catch (error) {
        console.error('Error updating product:', error);
        return { success: false, status_code: 500, message: 'Internal server error' };
    }
}

export async function deleteProduct(id: number): Promise<ApiResponse<void>> {
    try {
        const res = await fetch(`${API_URL}/products/${id}`, {
            method: 'DELETE',
            headers: {
                'x-api-key': API_KEY,
                'accesstoken': `Bearer ${localStorage.getItem('auth_token')}`
            },
        });
        return await res.json();
    } catch (error) {
        console.error('Error deleting product:', error);
        return { success: false, status_code: 500, message: 'Internal server error' };
    }
}

export async function getProductCategories(): Promise<ProductCategory[]> {
    try {
        const res = await fetch(`${API_URL}/product-categories`, {
            headers: {
                'x-api-key': API_KEY,
            }
        });
        const data = await res.json();
        return data.result || data.data || [];
    } catch (error) {
        console.error('Error fetching product categories:', error);
        return [];
    }
}

export async function getProductStats(): Promise<any> {
    try {
        const res = await fetch(`${API_URL}/products/stats`, {
            headers: {
                'x-api-key': API_KEY,
                'accesstoken': `Bearer ${localStorage.getItem('auth_token')}`
            },
        });
        const data = await res.json();
        return data.result || data.data || {};
    } catch (error) {
        console.error('Error fetching product stats:', error);
        return {};
    }
}

export async function createProductCategory(payload: any): Promise<ApiResponse<ProductCategory>> {
    try {
        const res = await fetch(`${API_URL}/product-categories`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': API_KEY,
                'accesstoken': `Bearer ${localStorage.getItem('auth_token')}`
            },
            body: JSON.stringify(payload),
        });
        return await res.json();
    } catch (error) {
        console.error('Error creating product category:', error);
        return { success: false, status_code: 500, message: 'Internal server error' };
    }
}

export async function updateProductCategory(id: number, payload: any): Promise<ApiResponse<ProductCategory>> {
    try {
        const res = await fetch(`${API_URL}/product-categories/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': API_KEY,
                'accesstoken': `Bearer ${localStorage.getItem('auth_token')}`
            },
            body: JSON.stringify(payload),
        });
        return await res.json();
    } catch (error) {
        console.error('Error updating product category:', error);
        return { success: false, status_code: 500, message: 'Internal server error' };
    }
}

export async function deleteProductCategory(id: number): Promise<ApiResponse<void>> {
    try {
        const res = await fetch(`${API_URL}/product-categories/${id}`, {
            method: 'DELETE',
            headers: {
                'x-api-key': API_KEY,
                'accesstoken': `Bearer ${localStorage.getItem('auth_token')}`
            },
        });
        return await res.json();
    } catch (error) {
        console.error('Error deleting product category:', error);
        return { success: false, status_code: 500, message: 'Internal server error' };
    }
}

// Client Management
export async function getAdminClients(): Promise<Client[]> {
    try {
        const res = await fetch(`${API_URL}/client-partner/clients`, {
            headers: {
                'x-api-key': API_KEY,
                'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
            },
        });
        const data = await res.json();
        const items = data.result || data.data || [];
        return Array.isArray(items) ? items : [];
    } catch (error) {
        console.error('Error fetching admin clients:', error);
        return [];
    }
}

export async function getClientById(id: number): Promise<Client | null> {
    try {
        const res = await fetch(`${API_URL}/client-partner/clients/${id}`, {
            headers: {
                'x-api-key': API_KEY,
                'accesstoken': `Bearer ${localStorage.getItem('auth_token')}`
            },
        });
        const data = await res.json();
        return data.result || null;
    } catch (error) {
        console.error('Error fetching client by id:', error);
        return null;
    }
}

export async function createClient(formData: FormData): Promise<ApiResponse<Client>> {
    try {
        const res = await fetch(`${API_URL}/client-partner/clients`, {
            method: 'POST',
            headers: {
                'x-api-key': API_KEY,
                'accesstoken': `Bearer ${localStorage.getItem('auth_token')}`
            },
            body: formData,
        });
        return await res.json();
    } catch (error) {
        console.error('Error creating client:', error);
        return { success: false, status_code: 500, message: 'Internal server error' };
    }
}

export async function updateClient(id: number, payload: any): Promise<ApiResponse<Client>> {
    try {
        const isFormData = payload instanceof FormData;
        const res = await fetch(`${API_URL}/client-partner/clients/${id}`, {
            method: 'PUT',
            headers: {
                'x-api-key': API_KEY,
                'accesstoken': `Bearer ${localStorage.getItem('auth_token')}`,
                ...(isFormData ? {} : { 'Content-Type': 'application/json' })
            },
            body: isFormData ? payload : JSON.stringify(payload),
        });
        return await res.json();
    } catch (error) {
        console.error('Error updating client:', error);
        return { success: false, status_code: 500, message: 'Internal server error' };
    }
}

export async function deleteClient(id: number): Promise<ApiResponse<void>> {
    try {
        const res = await fetch(`${API_URL}/client-partner/clients/${id}`, {
            method: 'DELETE',
            headers: {
                'x-api-key': API_KEY,
                'accesstoken': `Bearer ${localStorage.getItem('auth_token')}`
            },
        });
        return await res.json();
    } catch (error) {
        console.error('Error deleting client:', error);
        return { success: false, status_code: 500, message: 'Internal server error' };
    }
}

// Partner Management
export async function getAdminPartners(): Promise<Partner[]> {
    try {
        const res = await fetch(`${API_URL}/client-partner/partners`, {
            headers: {
                'x-api-key': API_KEY,
                'accesstoken': `Bearer ${localStorage.getItem('auth_token')}`
            },
        });
        const data = await res.json();
        return data.result || [];
    } catch (error) {
        console.error('Error fetching admin partners:', error);
        return [];
    }
}

export async function getPartnerById(id: number): Promise<Partner | null> {
    try {
        const res = await fetch(`${API_URL}/client-partner/partners/${id}`, {
            headers: {
                'x-api-key': API_KEY,
                'accesstoken': `Bearer ${localStorage.getItem('auth_token')}`
            },
        });
        const data = await res.json();
        return data.result || null;
    } catch (error) {
        console.error('Error fetching partner by id:', error);
        return null;
    }
}

export async function createPartner(formData: FormData): Promise<ApiResponse<Partner>> {
    try {
        const res = await fetch(`${API_URL}/client-partner/partners`, {
            method: 'POST',
            headers: {
                'x-api-key': API_KEY,
                'accesstoken': `Bearer ${localStorage.getItem('auth_token')}`
            },
            body: formData,
        });
        return await res.json();
    } catch (error) {
        console.error('Error creating partner:', error);
        return { success: false, status_code: 500, message: 'Internal server error' };
    }
}

export async function updatePartner(id: number, payload: any): Promise<ApiResponse<Partner>> {
    try {
        const isFormData = payload instanceof FormData;
        const res = await fetch(`${API_URL}/client-partner/partners/${id}`, {
            method: 'PUT',
            headers: {
                'x-api-key': API_KEY,
                'accesstoken': `Bearer ${localStorage.getItem('auth_token')}`,
                ...(isFormData ? {} : { 'Content-Type': 'application/json' })
            },
            body: isFormData ? payload : JSON.stringify(payload),
        });
        return await res.json();
    } catch (error) {
        console.error('Error updating partner:', error);
        return { success: false, status_code: 500, message: 'Internal server error' };
    }
}

export async function deletePartner(id: number): Promise<ApiResponse<void>> {
    try {
        const res = await fetch(`${API_URL}/client-partner/partners/${id}`, {
            method: 'DELETE',
            headers: {
                'x-api-key': API_KEY,
                'accesstoken': `Bearer ${localStorage.getItem('auth_token')}`
            },
        });
        return await res.json();
    } catch (error) {
        console.error('Error deleting partner:', error);
        return { success: false, status_code: 500, message: 'Internal server error' };
    }
}

// Certificate Management
export async function getAdminCertificates(): Promise<Certificate[]> {
    try {
        const res = await fetch(`${API_URL}/client-partner/certificates`, {
            headers: {
                'x-api-key': API_KEY,
                'accesstoken': `Bearer ${localStorage.getItem('auth_token')}`
            },
        });
        const data = await res.json();
        return data.result || [];
    } catch (error) {
        console.error('Error fetching admin certificates:', error);
        return [];
    }
}

export async function getCertificateById(id: number): Promise<Certificate | null> {
    try {
        const res = await fetch(`${API_URL}/client-partner/certificates/${id}`, {
            headers: {
                'x-api-key': API_KEY,
                'accesstoken': `Bearer ${localStorage.getItem('auth_token')}`
            },
        });
        const data = await res.json();
        return data.result || null;
    } catch (error) {
        console.error('Error fetching certificate by id:', error);
        return null;
    }
}

export async function createCertificate(formData: FormData): Promise<ApiResponse<Certificate>> {
    try {
        const res = await fetch(`${API_URL}/client-partner/certificates`, {
            method: 'POST',
            headers: {
                'x-api-key': API_KEY,
                'accesstoken': `Bearer ${localStorage.getItem('auth_token')}`
            },
            body: formData,
        });
        return await res.json();
    } catch (error) {
        console.error('Error creating certificate:', error);
        return { success: false, status_code: 500, message: 'Internal server error' };
    }
}

export async function updateCertificate(id: number, formData: FormData): Promise<ApiResponse<Certificate>> {
    try {
        const res = await fetch(`${API_URL}/client-partner/certificates/${id}`, {
            method: 'PUT',
            headers: {
                'x-api-key': API_KEY,
                'accesstoken': `Bearer ${localStorage.getItem('auth_token')}`
            },
            body: formData,
        });
        return await res.json();
    } catch (error) {
        console.error('Error updating certificate:', error);
        return { success: false, status_code: 500, message: 'Internal server error' };
    }
}

export async function deleteCertificate(id: number): Promise<ApiResponse<void>> {
    try {
        const res = await fetch(`${API_URL}/client-partner/certificates/${id}`, {
            method: 'DELETE',
            headers: {
                'x-api-key': API_KEY,
                'accesstoken': `Bearer ${localStorage.getItem('auth_token')}`
            },
        });
        return await res.json();
    } catch (error) {
        console.error('Error deleting certificate:', error);
        return { success: false, status_code: 500, message: 'Internal server error' };
    }
}

// Auth & Profile
export async function loginAdmin(credentials: any): Promise<ApiResponse<{ token: string; user: UserProfile }>> {
    try {
        const res = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': API_KEY,
            },
            body: JSON.stringify(credentials),
        });
        return await res.json();
    } catch (error) {
        console.error('Error logging in:', error);
        return { success: false, status_code: 500, message: 'Internal server error' };
    }
}

export async function getProfile(): Promise<UserProfile | null> {
    try {
        const token = localStorage.getItem('auth_token');
        if (!token) return null;

        const res = await fetch(`${API_URL}/auth/profile`, {
            headers: {
                'x-api-key': API_KEY,
                'accesstoken': `Bearer ${token}`
            },
        });

        if (!res.ok) {
            console.error(`Profile fetch error: ${res.status}`);
            return null;
        }

        const data: ApiResponse<UserProfile> = await res.json();
        // Backend returns user in result or data
        return data.result || data.data || null;
    } catch (error) {
        console.error('Error fetching profile:', error);
        return null;
    }
}

export async function changePassword(payload: any): Promise<ApiResponse<any>> {
    try {
        const res = await fetch(`${API_URL}/auth/change-password`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': API_KEY,
                'accesstoken': `Bearer ${localStorage.getItem('auth_token')}`
            },
            body: JSON.stringify(payload),
        });
        return await res.json();
    } catch (error) {
        console.error('Error changing password:', error);
        return { success: false, status_code: 500, message: 'Internal server error' };
    }
}

// User Management
export async function getUsers(page: number = 1, limit: number = 10): Promise<{ data: UserProfile[]; pagination: any }> {
    try {
        const query = new URLSearchParams({
            page: page.toString(),
            limit: limit.toString()
        }).toString();

        const res = await fetch(`${API_URL}/users?${query}`, {
            headers: {
                'x-api-key': API_KEY,
                'accesstoken': `Bearer ${localStorage.getItem('auth_token')}`
            },
        });
        const data = await res.json();
        const items = data.result || data.data || [];
        return {
            data: Array.isArray(items) ? items : [],
            pagination: data.pagination || { total: 0, page, limit, pages: 0 }
        };
    } catch (error) {
        console.error('Error fetching users:', error);
        return { data: [], pagination: { total: 0, page, limit, pages: 0 } };
    }
}

export async function getUserById(id: number): Promise<UserProfile | null> {
    try {
        const res = await fetch(`${API_URL}/users/${id}`, {
            headers: {
                'x-api-key': API_KEY,
                'accesstoken': `Bearer ${localStorage.getItem('auth_token')}`
            },
        });
        const data = await res.json();
        return data.result || data.data || null;
    } catch (error) {
        console.error('Error fetching user by id:', error);
        return null;
    }
}

export async function createUser(userData: any): Promise<ApiResponse<UserProfile>> {
    try {
        const res = await fetch(`${API_URL}/users`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': API_KEY,
                'accesstoken': `Bearer ${localStorage.getItem('auth_token')}`
            },
            body: JSON.stringify(userData),
        });
        return await res.json();
    } catch (error) {
        console.error('Error creating user:', error);
        return { success: false, status_code: 500, message: 'Internal server error' };
    }
}

export async function updateUser(id: number, userData: any): Promise<ApiResponse<UserProfile>> {
    try {
        const res = await fetch(`${API_URL}/users/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': API_KEY,
                'accesstoken': `Bearer ${localStorage.getItem('auth_token')}`
            },
            body: JSON.stringify(userData),
        });
        return await res.json();
    } catch (error) {
        console.error('Error updating user:', error);
        return { success: false, status_code: 500, message: 'Internal server error' };
    }
}

export async function deleteUser(id: number): Promise<ApiResponse<void>> {
    try {
        const res = await fetch(`${API_URL}/users/${id}`, {
            method: 'DELETE',
            headers: {
                'x-api-key': API_KEY,
                'accesstoken': `Bearer ${localStorage.getItem('auth_token')}`
            },
        });
        return await res.json();
    } catch (error) {
        console.error('Error deleting user:', error);
        return { success: false, status_code: 500, message: 'Internal server error' };
    }
}

export async function toggleUserStatus(id: number, isActive: boolean): Promise<ApiResponse<void>> {
    try {
        const res = await fetch(`${API_URL}/users/${id}/status`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': API_KEY,
                'accesstoken': `Bearer ${localStorage.getItem('auth_token')}`
            },
            body: JSON.stringify({ isActive }),
        });
        return await res.json();
    } catch (error) {
        console.error('Error toggling user status:', error);
        return { success: false, status_code: 500, message: 'Internal server error' };
    }
}

export async function getNewsletters(params?: { page?: number; limit?: number }): Promise<{ newsletters: NewsletterSubscription[]; total: number }> {
    try {
        const query = new URLSearchParams(cleanParams(params)).toString();
        const res = await fetch(`${API_URL}/newsletter${query ? `?${query}` : ''}`, {
            headers: {
                'x-api-key': API_KEY,
                'accesstoken': `Bearer ${localStorage.getItem('auth_token')}`
            },
        });
        const data = await res.json();
        const items = data.result || data.data || [];
        return {
            newsletters: Array.isArray(items) ? items : (items.data || []),
            total: data.pagination?.total || data.total || data.count || (Array.isArray(items) ? items.length : 0)
        };
    } catch (error) {
        console.error('Error fetching newsletters:', error);
        return { newsletters: [], total: 0 };
    }
}

export async function updateNewsletterStatus(id: string, status: string): Promise<ApiResponse<any>> {
    try {
        const res = await fetch(`${API_URL}/newsletter/${id}/status`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': API_KEY,
                'accesstoken': `Bearer ${localStorage.getItem('auth_token')}`
            },
            body: JSON.stringify({ status })
        });
        return await res.json();
    } catch (error) {
        console.error('Error updating newsletter status:', error);
        return { success: false, status_code: 500, message: 'Internal server error' };
    }
}

export async function deleteNewsletter(id: string): Promise<ApiResponse<any>> {
    try {
        const res = await fetch(`${API_URL}/newsletter/${id}`, {
            method: 'DELETE',
            headers: {
                'x-api-key': API_KEY,
                'accesstoken': `Bearer ${localStorage.getItem('auth_token')}`
            }
        });
        return await res.json();
    } catch (error) {
        console.error('Error deleting newsletter:', error);
        return { success: false, status_code: 500, message: 'Internal server error' };
    }
}

