import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import SEO from '../components/SEO';
import { Calendar, User, ArrowLeft, Tag } from 'lucide-react';

const WP_API = 'https://cms.zameengar.com/wp-json/wp/v2';

interface WPPost {
    id: number;
    slug: string;
    title: { rendered: string };
    content: { rendered: string };
    excerpt: { rendered: string };
    date: string;
    _embedded?: {
        'wp:featuredmedia'?: { source_url: string; alt_text: string }[];
        author?: { name: string }[];
        'wp:term'?: { name: string }[][];
    };
}

function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString('en-PK', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
}

function stripHtml(html: string) {
    return html.replace(/<[^>]+>/g, '').trim();
}

export default function BlogPost() {
    const { slug } = useParams<{ slug: string }>();
    const navigate = useNavigate();
    const [post, setPost] = useState<WPPost | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!slug) return;
        setLoading(true);
        setError(null);

        const fetchPost = async () => {
            try {
                const res = await fetch(`${WP_API}/posts?slug=${slug}&_embed`);
                if (!res.ok) throw new Error('Failed to load post');
                const data: WPPost[] = await res.json();
                if (data.length === 0) {
                    navigate('/blog', { replace: true });
                    return;
                }
                setPost(data[0]);
            } catch (err) {
                setError('Could not load this blog post. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchPost();
    }, [slug, navigate]);

    const featuredImage = post?._embedded?.['wp:featuredmedia']?.[0]?.source_url;
    const authorName = post?._embedded?.author?.[0]?.name ?? 'Zameengar Team';
    const categories = post?._embedded?.['wp:term']?.[0] ?? [];
    const tags = post?._embedded?.['wp:term']?.[1] ?? [];

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {post && (
                <SEO
                    title={`${stripHtml(post.title.rendered)} – Zameengar Blog`}
                    description={stripHtml(post.excerpt.rendered).slice(0, 160)}
                    url={`https://zameengar.com/blog/${post.slug}`}
                />
            )}
            <Header />
            <main className="flex-1 max-w-3xl mx-auto px-4 py-10 w-full">
                {/* Back Button */}
                <Link
                    to="/blog"
                    className="inline-flex items-center gap-2 text-green-700 font-medium hover:text-green-800 mb-8 group"
                >
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    Back to Blog
                </Link>

                {/* Loading State */}
                {loading && (
                    <div className="bg-white rounded-xl shadow-sm border overflow-hidden animate-pulse">
                        <div className="h-64 bg-gray-200" />
                        <div className="p-8 space-y-4">
                            <div className="h-6 bg-gray-200 rounded w-3/4" />
                            <div className="h-4 bg-gray-200 rounded w-1/2" />
                            <div className="space-y-2 pt-4">
                                {[...Array(6)].map((_, i) => (
                                    <div key={i} className="h-3 bg-gray-200 rounded" />
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Error State */}
                {error && (
                    <div className="text-center py-16">
                        <p className="text-red-500 text-lg">{error}</p>
                        <Link to="/blog" className="mt-4 inline-block text-green-700 underline">
                            Return to Blog
                        </Link>
                    </div>
                )}

                {/* Post Content */}
                {!loading && !error && post && (
                    <article className="bg-white rounded-xl shadow-sm border overflow-hidden">
                        {/* Featured Image */}
                        {featuredImage && (
                            <div className="h-72 overflow-hidden">
                                <img
                                    src={featuredImage}
                                    alt={post._embedded?.['wp:featuredmedia']?.[0]?.alt_text || stripHtml(post.title.rendered)}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        )}

                        <div className="p-6 md:p-10">
                            {/* Categories */}
                            {categories.length > 0 && (
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {categories.map((cat) => (
                                        <span
                                            key={cat.name}
                                            className="bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-1 rounded-full"
                                        >
                                            {cat.name}
                                        </span>
                                    ))}
                                </div>
                            )}

                            {/* Title */}
                            <h1
                                className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight mb-4"
                                dangerouslySetInnerHTML={{ __html: post.title.rendered }}
                            />

                            {/* Meta */}
                            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-8 pb-6 border-b border-gray-100">
                                <span className="flex items-center gap-1.5">
                                    <User className="w-4 h-4" />
                                    {authorName}
                                </span>
                                <span className="flex items-center gap-1.5">
                                    <Calendar className="w-4 h-4" />
                                    {formatDate(post.date)}
                                </span>
                            </div>

                            {/* Post Body — WordPress renders safe HTML here */}
                            <div
                                className="prose prose-gray prose-headings:text-gray-900 prose-a:text-green-700 prose-a:no-underline hover:prose-a:underline prose-img:rounded-lg max-w-none text-gray-700 leading-relaxed"
                                dangerouslySetInnerHTML={{ __html: post.content.rendered }}
                            />

                            {/* Tags */}
                            {tags.length > 0 && (
                                <div className="mt-10 pt-6 border-t border-gray-100">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <Tag className="w-4 h-4 text-gray-400" />
                                        {tags.map((tag) => (
                                            <span
                                                key={tag.name}
                                                className="bg-gray-100 text-gray-600 text-xs px-2.5 py-1 rounded-full"
                                            >
                                                {tag.name}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </article>
                )}
            </main>
            <Footer />
        </div>
    );
}
