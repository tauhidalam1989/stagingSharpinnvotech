import Image from "next/image";
import { getDictionary, Locale } from "@/lib/get-dictionary";
import {
    Lightbulb,
    GraduationCap,
    Globe,
    Users,
    Home,
    CheckCircle2,
    Star,
    Mail,
    ArrowRight,
    Briefcase,
    Trophy,
    Coffee,
    Heart,
    Rocket
} from "lucide-react";
import Link from "next/link";
import CareerHero from "@/components/careers/CareerHero";
import CareerProcess from "@/components/careers/CareerProcess";
import { motion } from "framer-motion";
import JsonLd from "@/components/JsonLd";
import { getWebPageSchema } from "@/lib/schema-builder";
import { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
    const { lang } = await params;
    const dict = await getDictionary(lang);
    return {
        title: dict.career?.career_title || "Careers",
        description: dict.career?.careers_description || "Join our team and start your journey with Sharp Innovations.",
        alternates: {
            canonical: `/${lang}/careers`,
        }
    };
}

export default async function CareersPage({
    params,
}: {
    params: Promise<{ lang: string }>;
}) {
    const { lang } = await params;
    const dict = await getDictionary(lang);
    const schema = getWebPageSchema(
        dict.career?.career_title || "Careers",
        dict.career?.careers_description || "Join our team and start your journey with Sharp Innovations.",
        lang,
        'WebPage'
    );
    const isAr = lang === 'ar';
    const s = dict.career;

    const whyChooseUsPoints = [
        {
            title: s.why_choose_us_points.point1_title,
            desc: s.why_choose_us_points.point1_description,
            icon: <Lightbulb className="w-6 h-6" />,
            color: "blue"
        },
        {
            title: s.why_choose_us_points.point2_title,
            desc: s.why_choose_us_points.point2_description,
            icon: <GraduationCap className="w-6 h-6" />,
            color: "purple"
        },
        {
            title: s.why_choose_us_points.point3_title,
            desc: s.why_choose_us_points.point3_description,
            icon: <Globe className="w-6 h-6" />,
            color: "indigo"
        },
        {
            title: s.why_choose_us_points.point4_title,
            desc: s.why_choose_us_points.point4_description,
            icon: <Users className="w-6 h-6" />,
            color: "cyan"
        },
        {
            title: s.why_choose_us_points.point5_title,
            desc: s.why_choose_us_points.point5_description,
            icon: <Home className="w-6 h-6" />,
            color: "emerald"
        },
        {
            title: isAr ? 'دعم مستمر' : 'Unwavering Support',
            desc: isAr ? 'نحن نساند موظفينا في كل خطوة.' : 'We stand by our employees at every step.',
            icon: <Heart className="w-6 h-6" />,
            color: "rose"
        },
    ];

    const getColorClasses = (color: string) => {
        switch (color) {
            case 'blue': return 'bg-blue-500/10 text-blue-600 dark:text-blue-400 group-hover:bg-blue-600';
            case 'purple': return 'bg-purple-500/10 text-purple-600 dark:text-purple-400 group-hover:bg-purple-600';
            case 'indigo': return 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 group-hover:bg-indigo-600';
            case 'cyan': return 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 group-hover:bg-cyan-600';
            case 'emerald': return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 group-hover:bg-emerald-600';
            case 'rose': return 'bg-rose-500/10 text-rose-600 dark:text-rose-400 group-hover:bg-rose-600';
            default: return 'bg-zinc-500/10 text-zinc-600 group-hover:bg-zinc-600';
        }
    };

    return (
        <main className="flex flex-col w-full min-h-screen bg-zinc-50 dark:bg-zinc-950 overflow-hidden" dir={isAr ? 'rtl' : 'ltr'}>

            {/* New Premium Career Hero */}
            <CareerHero lang={lang} dict={dict} />

            {/* Intro Section with Premium Overlap */}
            <section className="py-24 relative">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                        <div className="relative group">
                            <div className="aspect-[4/3] rounded-[3rem] overflow-hidden shadow-2xl transition-transform duration-700 group-hover:scale-[1.02]">
                                <Image
                                    src="/img/career.png"
                                    alt="Join our team"
                                    fill
                                    className="object-cover"
                                />
                                <div className="absolute inset-0 bg-blue-900/10 group-hover:bg-transparent transition-colors duration-500" />
                            </div>
                            {/* Decorative elements */}
                            <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -z-10 animate-pulse" />
                            <div className="absolute top-1/2 -translate-y-1/2 -right-10 w-20 h-40 bg-cyan-400/20 rounded-full blur-2xl -z-10" />
                        </div>
                        <div className="space-y-10">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-[10px] font-black tracking-widest uppercase">
                                <Trophy className="w-3 h-3" />
                                {isAr ? 'تميزنا يكمن في فريقنا' : 'OUR EXCELLENCE LIES IN OUR TEAM'}
                            </div>
                            <h2 className="text-4xl md:text-5xl font-syne font-black text-zinc-900 dark:text-white leading-tight">
                                {isAr ? 'لماذا تبدأ رحلتك مع ابتكارات حادة؟' : 'Why Start Your Journey with Sharp Innovations?'}
                            </h2>
                            <p className="text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed font-dm-sans font-light italic border-l-4 border-blue-600 pl-6 dark:border-blue-400">
                                {s.careers_description}
                            </p>
                            <div className="flex flex-wrap gap-4 pt-4">
                                <div className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 shadow-sm">
                                    <Coffee className="w-5 h-5 text-orange-500" />
                                    <span className="text-sm font-bold">{isAr ? 'ثقافة تعاونية' : 'Collaborative Culture'}</span>
                                </div>
                                <div className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 shadow-sm">
                                    <Rocket className="w-5 h-5 text-cyan-500" />
                                    <span className="text-sm font-bold">{isAr ? 'نمو لم يسبق له مثيل' : 'Hyper Growth'}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Why Choose Us - Enhanced Colorful Cards */}
            <section className="py-24 bg-zinc-100 dark:bg-zinc-900/40 relative overflow-hidden">
                <div className="container mx-auto px-6 relative z-10">
                    <div className="text-center max-w-3xl mx-auto mb-20">
                        <h2 className="text-4xl md:text-5xl font-syne font-black mb-6 text-zinc-900 dark:text-white tracking-tight">
                            {s.why_choose_us_title}
                        </h2>
                        <div className="w-24 h-1.5 bg-blue-600 mx-auto rounded-full mb-8" />
                        <p className="text-lg text-zinc-600 dark:text-zinc-400 font-dm-sans">
                            {s.why_choose_us_description}
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
                        {whyChooseUsPoints.map((point, i) => (
                            <div
                                key={i}
                                className="group bg-white dark:bg-zinc-900 p-10 rounded-[2.5rem] border border-zinc-200/50 dark:border-zinc-800 shadow-sm transition-all duration-500 hover:-translate-y-3 hover:shadow-2xl flex flex-col items-center text-center"
                            >
                                <div className={`h-16 w-16 rounded-[1.5rem] flex items-center justify-center mb-8 transition-all duration-500 shadow-lg group-hover:shadow-white/20 group-hover:scale-110 group-hover:rotate-[15deg] ${getColorClasses(point.color)}`}>
                                    <div className="transition-colors duration-500 group-hover:text-white">
                                        {point.icon}
                                    </div>
                                </div>
                                <h3 className="text-2xl font-syne font-bold mb-4 text-zinc-900 dark:text-white transition-colors duration-500 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                                    {point.title}
                                </h3>
                                <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed font-dm-sans">
                                    {point.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
                {/* Background decorative orbs */}
                <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-400/5 rounded-full blur-3xl -z-10" />
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple-400/5 rounded-full blur-3xl -z-10" />
            </section>

            {/* New Hiring Process Section */}
            <CareerProcess lang={lang} dict={dict} />

            {/* Opportunities & Offer - Modern Split Layout */}
            <section className="py-24 bg-white dark:bg-zinc-950 relative">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-32">
                        {/* Opportunities */}
                        <div className="space-y-12">
                            <div>
                                <h3 className="text-3xl md:text-5xl font-syne font-black mb-6 text-zinc-900 dark:text-white tracking-tight">
                                    {s.opportunities_title}
                                </h3>
                                <p className="text-lg text-zinc-500 dark:text-zinc-400 font-dm-sans leading-relaxed">
                                    {s.opportunities_description}
                                </p>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {Object.values(s.opportunities_list).map((role: any, i) => (
                                    <div key={i} className="group flex items-center gap-4 bg-zinc-50 dark:bg-zinc-900/50 p-5 rounded-2xl border border-zinc-100 dark:border-zinc-800 transition-all hover:bg-blue-600 hover:border-blue-700 shadow-sm hover:shadow-lg">
                                        <Briefcase className="w-5 h-5 text-blue-600 group-hover:text-white transition-colors" />
                                        <span className="font-syne font-bold text-sm tracking-tight text-zinc-900 dark:text-white group-hover:text-white transition-colors">{role}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* What we offer */}
                        <div className="space-y-12 lg:pt-4">
                            <div>
                                <h3 className="text-3xl md:text-5xl font-syne font-black mb-6 text-zinc-900 dark:text-white tracking-tight">
                                    {s.what_we_offer_title}
                                </h3>
                                <div className="h-1.5 w-20 bg-cyan-400 rounded-full mb-8" />
                            </div>
                            <div className="space-y-6">
                                {Object.values(s.what_we_offer_list).map((offer: any, i) => (
                                    <div key={i} className="flex items-center gap-6 group">
                                        <div className="h-12 w-12 bg-white dark:bg-zinc-900 rounded-2xl flex items-center justify-center text-blue-600 border border-zinc-100 dark:border-zinc-800 shadow-sm transition-all group-hover:bg-blue-600 group-hover:text-white group-hover:scale-110">
                                            <Star className="w-5 h-5 fill-current" />
                                        </div>
                                        <span className="text-lg text-zinc-700 dark:text-zinc-300 font-syne font-bold group-hover:text-zinc-900 dark:group-hover:text-white transition-colors">{offer}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Redesigned Join Us / Contact Section */}
            <section className="py-24 bg-zinc-100 dark:bg-zinc-900/50 relative overflow-hidden">
                <div className="container mx-auto px-6 relative z-10">
                    <div className="max-w-5xl mx-auto bg-white dark:bg-zinc-900 rounded-[3rem] overflow-hidden shadow-2xl border border-zinc-200/50 dark:border-zinc-800 grid grid-cols-1 lg:grid-cols-5">
                        <div className="lg:col-span-3 p-12 md:p-16 space-y-8">
                            <h3 className="text-3xl md:text-5xl font-syne font-black text-[#141d72] dark:text-blue-400 leading-tight">
                                {s.join_us_title}
                            </h3>
                            <p className="text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed font-dm-sans">
                                {s.join_us_description}
                            </p>
                            <div className="flex flex-col sm:flex-row gap-8 items-start sm:items-center">
                                <Link href="mailto:hr@sharpinnvotech.com" className="group flex items-center gap-4 bg-[#0d6efd] text-white px-8 py-5 rounded-2xl font-black transition-all hover:bg-blue-700 shadow-lg hover:shadow-blue-500/25">
                                    {isAr ? 'أرسل سيرتك الذاتية' : 'Submit your Resume'}
                                    <Mail className={`w-5 h-5 transition-transform group-hover:scale-110 ${isAr ? 'rotate-180' : ''}`} />
                                </Link>
                                <div className="flex flex-col">
                                    <span className="text-xs font-black text-zinc-400 uppercase tracking-widest mb-1">{isAr ? 'بريدنا الإلكتروني' : 'OUR EMAIL'}</span>
                                    <span className="text-lg font-black text-zinc-900 dark:text-white">hr@sharpinnvotech.com</span>
                                </div>
                            </div>
                        </div>
                        <div className="lg:col-span-2 relative bg-blue-600 min-h-[300px]">
                            <Image
                                src="/img/career.png"
                                alt="Hiring"
                                fill
                                className="object-cover opacity-60 mix-blend-overlay"
                            />
                            <div className="absolute inset-0 flex flex-col justify-end p-12 bg-gradient-to-t from-blue-900/80 to-transparent">
                                <p className="text-white text-lg font-syne font-bold italic !text-white leading-relaxed">
                                    {lang === 'ar'
                                        ? '"نحن لا نبحث عن موظفين فقط، بل نبحث عن شركاء يشاركوننا شغف الابتكار والتحول الرقمي."'
                                        : '"We are not just looking for employees, we are looking for partners who share our passion for innovation and digital transformation."'
                                    }
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Enhanced Closing Banner */}
            <section className="py-24 bg-[#0d6efd] text-white text-center relative overflow-hidden">
                <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
                <div className="container mx-auto px-6 max-w-4xl relative z-10">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-3xl backdrop-blur-md mb-8 rotate-[12deg]">
                        <Rocket className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="text-4xl md:text-6xl font-syne font-black mb-8 leading-tight">
                        {s.closing_statement}
                    </h3>
                    <p className="text-xl md:text-2xl !text-white opacity-90 max-w-3xl mx-auto font-dm-sans font-light">
                        {s.closing_description}
                    </p>
                </div>
                {/* Decoration */}
                <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-white/10 rounded-full blur-[100px]" />
                <div className="absolute -top-20 -left-20 w-80 h-80 bg-cyan-400/20 rounded-full blur-[80px]" />
            </section>
        </main>
    );
}
