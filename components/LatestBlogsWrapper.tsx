import { getPublishedBlogs } from '@/lib/api';
import LatestBlogsSection from './LatestBlogsSection';

export default async function LatestBlogsWrapper({ lang, dict }: { lang: string; dict: any }) {
    const blogsRes = await getPublishedBlogs({ limit: 8 });

    return (
        <LatestBlogsSection
            lang={lang}
            dict={dict}
            blogs={blogsRes.blogs}
        />
    );
}
