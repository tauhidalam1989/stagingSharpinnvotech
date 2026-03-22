import { getDictionary, Locale } from "@/lib/get-dictionary";
import { getClients, getPartners } from "@/lib/api";
import LogoCarousel from "@/components/LogoCarousel";
import FAQSection from "@/components/FAQSection";
import Newsletter from "@/components/Newsletter";
import Link from "next/link";
import Image from "next/image";
import Breadcrumbs from "@/components/Breadcrumbs";

export default async function ProjectsPage({
    params,
}: {
    params: Promise<{ lang: string }>;
}) {
    const { lang } = await params;
    const dict = await getDictionary(lang);

    const clients = await getClients('active');
    const partners = await getPartners('active');

    const staticProjects = [
        {
            image: '/img/project-1.jpg',
            category: dict.PROJECT.CATEGORY_ROBOTIC,
            title: dict.PROJECT.TITLE_ROBOTIC,
            link: `/${lang}/projects/robotic-automation`,
        },
        {
            image: '/img/project-2.jpg',
            category: dict.PROJECT.CATEGORY_MACHINE_LEARNING,
            title: dict.PROJECT.TITLE_MACHINE_LEARNING,
            link: `/${lang}/projects/machine-learning`,
        },
        {
            image: '/img/project-3.jpg',
            category: dict.PROJECT.CATEGORY_PREDICTIVE,
            title: dict.PROJECT.TITLE_PREDICTIVE,
            link: `/${lang}/projects/predictive-analysis`,
        },
    ];

    return (
        <div className="flex flex-col w-full min-h-screen bg-zinc-50 dark:bg-zinc-950">
            {/* <Breadcrumbs lang={lang} dict={dict} items={[{ label: isAr ? 'مشاريعنا' : 'Projects' }]} /> */}
            {/* Hero Section */}
            <section className="pt-36 pb-24 bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-4xl md:text-5xl lg:text-7xl font-black mb-8 tracking-tight">
                        {dict.PAGE_TITLES.PROJECTS}
                    </h1>
                    <p className="text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
                        {lang === 'ar' ? 'استكشف مشاريعنا الناجحة وحلولنا المبتكرة في مختلف قطاعات التكنولوجيا.' : 'Explore our successful projects and innovative solutions across various technology sectors.'}
                    </p>
                </div>
            </section>

            {/* Featured Projects Grid */}
            <section className="py-24">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {staticProjects.map((project, i) => (
                            <div key={i}>
                                <Link
                                    href={project.link}
                                    className="group relative h-[500px] rounded-[48px] overflow-hidden bg-zinc-900 block"
                                >
                                    <Image
                                        src={project.image}
                                        alt={project.title}
                                        fill
                                        className="object-cover opacity-60 transition-transform group-hover:scale-110 duration-700"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent"></div>
                                    <div className="absolute bottom-0 left-0 p-10 space-y-4">
                                        <span className="inline-block px-4 py-1 rounded-full bg-blue-600 text-xs font-bold text-white uppercase tracking-widest">
                                            {project.category}
                                        </span>
                                        <h3 className="text-2xl font-bold text-white leading-tight">
                                            {project.title}
                                        </h3>
                                        <div className="flex items-center text-sm font-bold text-white pt-4 border-t border-white/10 opacity-0 group-hover:opacity-100 transition-opacity">
                                            {dict.SERVICE.READ_MORE} <span className="ml-2">→</span>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Clients & Partners */}
            <section className="py-24 bg-white dark:bg-zinc-900/50">
                <div className="container mx-auto px-4">
                    <LogoCarousel
                        items={clients}
                        title={dict.clientsPage.clients.title}
                        description={dict.clientsPage.clients.description}
                        lang={lang}
                    />
                    <div className="h-px bg-zinc-200 dark:bg-zinc-800 my-16 opacity-30"></div>
                    <LogoCarousel
                        items={partners}
                        title={dict.clientsPage.partners.title}
                        description={dict.clientsPage.partners.description}
                        lang={lang}
                    />
                </div>
            </section>

            <FAQSection lang={lang} dict={dict} />
            <Newsletter lang={lang} dict={dict} />
        </div>
    );
}
