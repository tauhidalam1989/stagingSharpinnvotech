import { getDictionary } from "@/lib/get-dictionary";
import { getPublishedProducts, Product } from "@/lib/api";
import ProductHero from "@/components/products/ProductHero";
import ProductListingClient from "@/components/products/ProductListingClient";
import ProductPlatform from "@/components/products/ProductPlatform";
import ProductCTA from "@/components/products/ProductCTA";

export default async function ProductsPage({
    params,
}: {
    params: Promise<{ lang: string }>;
}) {
    const { lang } = await params;
    const dict = await getDictionary(lang);
    const products = await getPublishedProducts();
    const isAr = lang === 'ar';

    // Group products by category
    const productsByCategory: { [key: string]: { name: string, products: Product[] } } = {};

    products.forEach((product) => {
        const categoryId = product.categoryId || 0;
        const categoryName = isAr && product.category?.nameAr
            ? product.category.nameAr
            : product.category?.name || (isAr ? 'منتجات أخرى' : 'Other Products');

        if (!productsByCategory[categoryId]) {
            productsByCategory[categoryId] = {
                name: categoryName,
                products: []
            };
        }
        productsByCategory[categoryId].products.push(product);
    });

    const categoryIds = Object.keys(productsByCategory).sort((a, b) => Number(a) - Number(b));

    return (
        <main className="flex flex-col w-full min-h-screen bg-white dark:bg-zinc-950">
            {/* Hero Section */}
            <ProductHero lang={lang} dict={dict} />

            {/* Product Listing Section with Sticky Filters and Category Groups */}
            <div className="relative flex-1">
                <ProductListingClient 
                    lang={lang} 
                    dict={dict} 
                    productsByCategory={productsByCategory}
                    categoryIds={categoryIds}
                />
            </div>

            {/* Platform Highlights Section */}
            <ProductPlatform lang={lang} />

            {/* Bottom CTA Section */}
            <ProductCTA lang={lang} />
        </main>
    );
}
