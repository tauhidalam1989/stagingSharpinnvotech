import { getDictionary } from "@/lib/get-dictionary";
import NotFoundUI from "@/components/NotFoundUI";
import Footer from "@/components/Footer";

export default async function NotFoundPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  return (
    <>
      <NotFoundUI lang={lang} dict={dict} />
    </>
  );
}
