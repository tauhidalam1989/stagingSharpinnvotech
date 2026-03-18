import { getDictionary, Locale } from "@/lib/get-dictionary";
import { getPublishedServices, ServicePage } from "@/lib/api";
import Breadcrumbs from "@/components/Breadcrumbs";
import ServiceCard from "@/components/ServiceCard";

export default async function ServicesPage({
    params,
}: {
    params: Promise<{ lang: string }>;
}) {
    const { lang } = await params;
    const dict = await getDictionary(lang);
    const services = await getPublishedServices();
    const isAr = lang === 'ar';

    // Group services by category
    const servicesByCategory: { [key: string]: { name: string, services: ServicePage[] } } = {};

    services.forEach((service) => {
        const categoryId = service.categoryId || 0;
        const categoryName = isAr && service.category?.nameAr
            ? service.category.nameAr
            : service.category?.name || (isAr ? 'خدمات أخرى' : 'Other Services');

        if (!servicesByCategory[categoryId]) {
            servicesByCategory[categoryId] = {
                name: categoryName,
                services: []
            };
        }
        servicesByCategory[categoryId].services.push(service);
    });

    const categoryIds = Object.keys(servicesByCategory).sort((a, b) => Number(a) - Number(b));

    return (
        <div className="flex flex-col w-full min-h-screen bg-white dark:bg-zinc-950 overflow-x-hidden">
            <Breadcrumbs lang={lang} dict={dict} items={[{ label: isAr ? 'خدماتنا' : 'Services' }]} />
            
            <div className="relative flex-1">
                {/* Main Page Background (Moving Dots) - Starts after breadcrumbs */}
                <div
                    className="absolute inset-0 opacity-[0.4] dark:opacity-[0.3] pointer-events-none"
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='20' cy='20' r='4' fill='%231a6bf5' opacity='0.4'/%3E%3Ccircle cx='80' cy='30' r='4' fill='%231a6bf5' opacity='0.4'/%3E%3Ccircle cx='40' cy='70' r='4' fill='%231a6bf5' opacity='0.4'/%3E%3Ccircle cx='70' cy='80' r='4' fill='%231a6bf5' opacity='0.4'/%3E%3Ccircle cx='10' cy='90' r='4' fill='%231a6bf5' opacity='0.4'/%3E%3C/svg%3E")`,
                        backgroundSize: '100px 100px',
                        animation: 'moveDots 30s linear infinite'
                    }}
                ></div>

                {/* Hero Section */}
                <section className="relative pt-8 pb-8 overflow-hidden" dir={isAr ? 'rtl' : 'ltr'}>
                    {/* Visual Background Elements */}
                    <div className="absolute inset-0 pointer-events-none">
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-50/50 dark:bg-blue-900/10 rounded-full blur-[120px]"></div>
                        <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] dark:opacity-[0.05]"
                            style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
                    </div>

                    <div className="container mx-auto px-6 md:px-10 lg:px-12 xl:px-16 relative z-10 text-center">
                        <h1 className="text-3xl md:text-4xl font-black mb-4 tracking-tight text-[#1a6bf5]">
                            {isAr ? 'خدماتنا المميزة' : 'Our Services'}
                        </h1>
                        <p className="text-sm md:text-base text-zinc-500 dark:text-zinc-400 font-medium max-w-2xl mx-auto italic">
                            {isAr
                                ? 'حلول شاملة مصممة لتلبية احتياجات أعمالك الفريدة والارتقاء بها.'
                                : 'Comprehensive Solutions Tailored to Your Business Needs.'}
                        </p>
                    </div>
                </section>

                {/* Services Listing */}
                <section className="pb-16 relative" dir={isAr ? 'rtl' : 'ltr'}>
                    <div className="container mx-auto px-6 md:px-10 lg:px-12 xl:px-16">
                        {categoryIds.length > 0 ? (
                            categoryIds.map((id, index) => (
                                <div key={id} className={`mb-12 last:mb-0`}>
                                    <div className="flex items-center gap-4 sm:gap-6 mb-6">
                                        <h2 className="text-xl sm:text-2xl font-black text-[#141d72] dark:text-blue-400 tracking-tight max-w-full">
                                            {servicesByCategory[id].name}
                                        </h2>
                                        <div className="h-[2px] flex-1 bg-gradient-to-r from-blue-600/20 to-transparent hidden xs:block"></div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                        {servicesByCategory[id].services.sort((a, b) => (a.order || 0) - (b.order || 0)).map((service) => (
                                            <ServiceCard
                                                key={service.id}
                                                service={service}
                                                lang={lang}
                                                dict={dict}
                                            />
                                        ))}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-16 bg-zinc-50 dark:bg-zinc-900/50 rounded-[48px] border-2 border-dashed border-zinc-200 dark:border-zinc-800">
                                <div className="mb-6 h-20 w-20 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mx-auto">
                                    <i className="fas fa-box-open text-3xl text-zinc-300"></i>
                                </div>
                                <p className="text-xl font-bold text-zinc-400">
                                    {isAr ? 'لا توجد خدمات متاحة حالياً.' : 'No services available at the moment.'}
                                </p>
                            </div>
                        )}
                    </div>
                </section>
            </div>
        </div>
    );
}
