import type { Context } from "@netlify/edge-functions";

const BOT_USER_AGENTS = [
    "whatsapp",
    "facebookexternalhit",
    "facebot",
    "twitterbot",
    "telegrambot",
    "slackbot",
    "linkedinbot",
    "discordbot",
    "pinterest",
    "skypeuripreview",
];

const SUPABASE_URL = "https://oevuvxezmdnvgusveukg.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_i82qW0hOtGAqHt-Q2w3F8g_xfPP4IyU";

function escapeHtml(str: string): string {
    return str
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}

export default async (request: Request, context: Context) => {
    const userAgent = (request.headers.get("user-agent") || "").toLowerCase();
    const isBot = BOT_USER_AGENTS.some((bot) => userAgent.includes(bot));

    // If it's a normal human user in a browser, pass straight through to the React SPA
    if (!isBot) {
        return context.next();
    }

    const url = new URL(request.url);
    const pathname = url.pathname;

    // Check if the route is a property detail page: /properties/:id
    const propertyMatch = pathname.match(/^\/properties\/([a-zA-Z0-9-]+)\/?$/);
    if (!propertyMatch) {
        return context.next();
    }

    const propertyId = propertyMatch[1];

    try {
        // Fetch property details directly from Supabase REST API
        const propRes = await fetch(
            `${SUPABASE_URL}/rest/v1/properties?id=eq.${propertyId}&select=id,title,description,price,city,purpose,property_type`,
            {
                headers: {
                    apikey: SUPABASE_ANON_KEY,
                    Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
                },
            }
        );

        if (!propRes.ok) {
            return context.next();
        }

        const props = await propRes.json();
        if (!props || props.length === 0) {
            return context.next();
        }

        const property = props[0];

        // Fetch property images
        const imgRes = await fetch(
            `${SUPABASE_URL}/rest/v1/property_images?property_id=eq.${propertyId}&select=image_url,is_primary&order=sort_order`,
            {
                headers: {
                    apikey: SUPABASE_ANON_KEY,
                    Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
                },
            }
        );

        let imageUrl = "https://zameengar.com/og-image.png";
        if (imgRes.ok) {
            const images = await imgRes.json();
            if (images && images.length > 0) {
                const primary = images.find((img: any) => img.is_primary);
                imageUrl = primary ? primary.image_url : images[0].image_url;
            }
        }

        const title = property.title
            ? `${property.title} | Zameengar`
            : "Property Details | Zameengar";

        const priceText = property.price
            ? `PKR ${Number(property.price).toLocaleString()} - `
            : "";
        const descText = property.description
            ? property.description.substring(0, 200).replace(/\r?\n|\r/g, " ")
            : `View this ${property.property_type || "property"} for ${property.purpose || "sale"} in ${property.city || "Pakistan"} on Zameengar.`;

        const description = `${priceText}${property.city ? property.city + " - " : ""}${descText}`;
        const canonicalUrl = `https://zameengar.com/properties/${propertyId}`;

        // Return server-rendered HTML specifically for WhatsApp, Facebook, Twitter, and other preview bots
        const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>${escapeHtml(title)}</title>
    <meta name="description" content="${escapeHtml(description)}">
    <link rel="canonical" href="${escapeHtml(canonicalUrl)}">

    <!-- Open Graph for WhatsApp, Facebook, LinkedIn -->
    <meta property="og:type" content="website">
    <meta property="og:site_name" content="Zameengar">
    <meta property="og:title" content="${escapeHtml(title)}">
    <meta property="og:description" content="${escapeHtml(description)}">
    <meta property="og:url" content="${escapeHtml(canonicalUrl)}">
    <meta property="og:image" content="${escapeHtml(imageUrl)}">
    <meta property="og:image:secure_url" content="${escapeHtml(imageUrl)}">
    <meta property="og:image:type" content="image/jpeg">
    <meta property="og:image:width" content="1200">
    <meta property="og:image:height" content="630">

    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${escapeHtml(title)}">
    <meta name="twitter:description" content="${escapeHtml(description)}">
    <meta name="twitter:image" content="${escapeHtml(imageUrl)}">

    <!-- Immediate redirect if opened by a human browser that spoofed user-agent -->
    <meta http-equiv="refresh" content="0;url=${escapeHtml(canonicalUrl)}">
</head>
<body>
    <h1>${escapeHtml(title)}</h1>
    <p>${escapeHtml(description)}</p>
    <img src="${escapeHtml(imageUrl)}" alt="${escapeHtml(title)}">
</body>
</html>`;

        return new Response(html, {
            status: 200,
            headers: {
                "Content-Type": "text/html; charset=utf-8",
                "Cache-Control": "public, max-age=3600, s-maxage=86400",
            },
        });
    } catch (err) {
        // Fallback to client-side app on error
        return context.next();
    }
};

export const config = {
    path: "/properties/*",
};
