import { Helmet } from 'react-helmet-async';

interface SEOProps {
    title: string;
    description: string;
    url: string;
    image?: string;
}

export default function SEO({ title, description, url, image = 'https://zameengar.com/og-image.png' }: SEOProps) {
    const fullTitle = `${title} | Zameengar`;

    return (
        <Helmet>
            {/* Standard metadata */}
            <title>{fullTitle}</title>
            <meta name="description" content={description} />
            <link rel="canonical" href={url} />

            {/* Open Graph metadata */}
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={description} />
            <meta property="og:url" content={url} />
            <meta property="og:image" content={image} />
            <meta property="og:type" content="website" />

            {/* Twitter metadata */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={fullTitle} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={image} />
        </Helmet>
    );
}
