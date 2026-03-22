import { getDictionary } from '@/lib/get-dictionary';
import { Locale } from '@/lib/get-dictionary';
import { getPublishedServices, ServicePage } from '@/lib/api';
import ServiceHero from '@/components/services/ServiceHero';
import ServiceListingClient from '@/components/services/ServiceListingClient';
import ServiceProcess from '@/components/services/ServiceProcess';
import ServiceWhy from '@/components/services/ServiceWhy';
import ServiceIndustries from '@/components/services/ServiceIndustries';
import ServiceCTA from '@/components/services/ServiceCTA';

export default async function ServicesPage({
    params,
}: {
    params: Promise<{ lang: string }>;
}) {
    const { lang } = await params;
    const locale = lang as Locale;
    const dict = await getDictionary(locale);
    const services = await getPublishedServices();

    // Group services by category
    const servicesByCategory: { [key: string]: { name: string, services: ServicePage[] } } = {};
    const categoryIds: string[] = [];

    services.forEach((service) => {
        if (service.category) {
            const catId = service.category.id.toString();
            const catName = lang === 'ar' && service.category.nameAr ? service.category.nameAr : service.category.name;
            
            if (!servicesByCategory[catId]) {
                servicesByCategory[catId] = {
                    name: catName,
                    services: [],
                };
                categoryIds.push(catId);
            }
            servicesByCategory[catId].services.push(service);
        }
    });

    // Sort categories based on order field
    const sortedCategoryIds = categoryIds.sort((a, b) => {
        const catA = services.find(s => s.category?.id.toString() === a)?.category;
        const catB = services.find(s => s.category?.id.toString() === b)?.category;
        return (catA?.order || 0) - (catB?.order || 0);
    });

    const heroCategories = sortedCategoryIds.map(id => ({
        id,
        name: servicesByCategory[id].name
    }));

    return (
        <div className="flex flex-col min-h-screen">
            <ServiceHero 
                lang={lang} 
                dict={dict} 
                categories={heroCategories} 
            />
            
            <ServiceListingClient 
                lang={lang} 
                dict={dict} 
                servicesByCategory={servicesByCategory} 
                categoryIds={sortedCategoryIds} 
            />

            <ServiceProcess lang={lang} dict={dict} />
            
            <ServiceWhy lang={lang} dict={dict} />
            
            <ServiceIndustries lang={lang} dict={dict} />
            
            <ServiceCTA lang={lang} dict={dict} />
        </div>
    );
}
