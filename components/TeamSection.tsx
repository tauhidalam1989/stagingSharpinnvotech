import Image from 'next/image';
import { Locale } from '@/lib/get-dictionary';

export default function TeamSection({ lang, dict }: { lang: Locale; dict: any }) {
    const isRtl = lang === 'ar';
    const teamMembers = [
        { 
            name: dict.TEAM.BORIS_JOHNSON, 
            role: dict.TEAM.FOUNDER_CEO, 
            image: '/img/team-1.jpg',
            delay: '0.1s',
            socials: ['facebook-f', 'twitter', 'instagram', 'linkedin-in']
        },
        { 
            name: dict.TEAM.ADAM_CREW, 
            role: dict.TEAM.EXECUTIVE_MANAGER, 
            image: '/img/team-2.jpg',
            delay: '0.5s',
            socials: ['facebook-f', 'twitter', 'instagram', 'linkedin-in']
        },
        { 
            name: dict.TEAM.KATE_WINSLET, 
            role: dict.TEAM.CO_FOUNDER, 
            image: '/img/team-3.jpg',
            delay: '0.3s',
            socials: ['facebook-f', 'twitter', 'instagram', 'linkedin-in']
        },
        { 
            name: dict.TEAM.CODY_GARDNER, 
            role: dict.TEAM.PROJECT_MANAGER, 
            image: '/img/team-4.jpg',
            delay: '0.7s',
            socials: ['facebook-f', 'twitter', 'instagram', 'linkedin-in']
        },
    ];

    return (
        <section className="py-24 bg-white dark:bg-zinc-950">
            <div className="container mx-auto px-4 md:px-6">
                <div className="flex flex-col lg:flex-row gap-12 items-center">
                    {/* Team Introduction Section */}
                    <div className="lg:w-5/12 space-y-6">
                        <div className="inline-block rounded-full border border-[#0d6efd] text-[#0d6efd] px-4 py-1 text-sm font-semibold">
                            {dict.TEAM.OUR_TEAM}
                        </div>
                        <h2 className="text-4xl md:text-5xl font-black text-zinc-900 dark:text-white leading-tight">
                            {dict.TEAM.TITLE}
                        </h2>
                        <p className="text-zinc-600 dark:text-zinc-400 text-lg leading-relaxed">
                            {dict.TEAM.DESCRIPTION}
                        </p>
                        <button className="bg-[#0d6efd] text-white px-8 py-3 rounded-full font-bold shadow-lg shadow-blue-500/30 hover:bg-[#0b5ed7] transition-all transform hover:scale-105 active:scale-95">
                            {dict.TEAM.READ_MORE}
                        </button>
                    </div>

                    {/* Team Members Section */}
                    <div className="lg:w-7/12">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {teamMembers.map((member, index) => (
                                <div key={index} className="team-item bg-white dark:bg-zinc-900 text-center rounded-xl p-6 pt-0 shadow-xl shadow-zinc-200/50 dark:shadow-none transition-all duration-300 hover:-translate-y-2">
                                    <div className="relative group">
                                        <div className="p-4">
                                            <Image
                                                src={member.image}
                                                alt={member.name}
                                                width={200}
                                                height={200}
                                                className="mx-auto rounded-full transition-transform duration-500 group-hover:scale-110"
                                            />
                                        </div>
                                    </div>
                                    <h5 className="text-xl font-black text-zinc-900 dark:text-white mb-1">
                                        {member.name}
                                    </h5>
                                    <small className="text-zinc-500 dark:text-zinc-400 font-medium tracking-wide uppercase">
                                        {member.role}
                                    </small>
                                    <div className="flex justify-center gap-2 mt-6">
                                        {member.socials.map((icon, sIdx) => (
                                            <button key={sIdx} className="w-10 h-10 flex items-center justify-center rounded bg-[#0d6efd] text-white transition-all transform hover:scale-110 active:scale-90 shadow-md shadow-blue-500/20">
                                                <i className={`fab fa-${icon}`}></i>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
