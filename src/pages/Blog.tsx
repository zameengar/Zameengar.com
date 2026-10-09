import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import SEO from '../components/SEO';
import { Calendar, User, ArrowRight, BookOpen } from 'lucide-react';

const WP_API = 'https://cms.zameengar.com/wp-json/wp/v2';

interface WPPost {
    id: number;
    slug: string;
    title: { rendered: string };
    excerpt: { rendered: string };
    date: string;
    _embedded?: {
        'wp:featuredmedia'?: { source_url: string; alt_text: string }[];
        author?: { name: string }[];
        'wp:term'?: { name: string }[][];
    };
}

function stripHtml(html: string) {
    return html.replace(/<[^>]+>/g, '').trim();
}

function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString('en-PK', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
}

export default function Blog() {
    const [posts, setPosts] = useState<WPPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const res = await fetch(`${WP_API}/posts?_embed&per_page=12&orderby=date&order=desc`);
                if (!res.ok) throw new Error('Failed to load posts');
                const data: WPPost[] = await res.json();
                setPosts(data);
            } catch (err) {
                setError('Could not load blog posts. Please try again later.');
            } finally {
                setLoading(false);
            }
        };
        fetchPosts();
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <SEO
                title="Blog – Real Estate Tips & Insights"
                description="Stay up to date with the latest real estate news, property investment tips, and market insights from the Zameengar team."
                url="https://zameengar.com/blog"
            />
            <Header />
            <main className="flex-1 max-w-6xl mx-auto px-4 py-12 w-full">
                {/* Page Header */}
                <div className="mb-10">
                    <div className="flex items-center gap-3 mb-2">
                        <BookOpen className="w-8 h-8 text-green-700" />
                        <h1 className="text-4xl font-bold text-gray-900">Zameengar Blog</h1>
                    </div>
                    <p className="text-gray-500 text-lg mt-1">
                        Real estate tips, market analysis, and property investment insights — all in one place.
                    </p>
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="bg-white rounded-xl shadow-sm border overflow-hidden animate-pulse">
                                <div className="h-48 bg-gray-200" />
                                <div className="p-5 space-y-3">
                                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                                    <div className="h-3 bg-gray-200 rounded w-full" />
                                    <div className="h-3 bg-gray-200 rounded w-2/3" />
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Error State */}
                {error && (
                    <div className="text-center py-16">
                        <p className="text-red-500 text-lg">{error}</p>
                    </div>
                )}

                {/* Posts Grid */}
                {!loading && !error && posts.length === 0 && (
                    <div className="text-center py-16">
                        <p className="text-gray-500 text-lg">No blog posts published yet. Check back soon!</p>
                    </div>
                )}

                {!loading && !error && posts.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {posts.map((post) => {
                            const featuredImage = post._embedded?.['wp:featuredmedia']?.[0]?.source_url;
                            const authorName = post._embedded?.author?.[0]?.name ?? 'Zameengar Team';
                            const categories = post._embedded?.['wp:term']?.[0] ?? [];

                            return (
                                <Link
                                    to={`/blog/${post.slug}`}
                                    key={post.id}
                                    className="bg-white rounded-xl shadow-sm border overflow-hidden hover:shadow-md transition-shadow group flex flex-col"
                                >
                                    {/* Featured Image */}
                                    <div className="h-48 bg-green-50 overflow-hidden relative">
                                        {featuredImage ? (
                                            <img
                                                src={featuredImage}
                                                alt={post._embedded?.['wp:featuredmedia']?.[0]?.alt_text || post.title.rendered}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <BookOpen className="w-12 h-12 text-green-200" />
                                            </div>
                                        )}
                                        {/* Category Badge */}
                                        {categories[0] && (
                                            <span className="absolute top-3 left-3 bg-green-700 text-white text-xs font-semibold px-2.5 py-1 rounded-full">
                                                {categories[0].name}
                                            </span>
                                        )}
                                    </div>

                                    {/* Content */}
                                    <div className="p-5 flex flex-col flex-1">
                                        <h2
                                            className="text-lg font-bold text-gray-900 mb-2 group-hover:text-green-700 transition-colors line-clamp-2"
                                            dangerouslySetInnerHTML={{ __html: post.title.rendered }}
                                        />
                                        <p className="text-gray-500 text-sm leading-relaxed line-clamp-3 flex-1">
                                            {stripHtml(post.excerpt.rendered)}
                                        </p>
                                        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                                            <div className="flex items-center gap-3 text-xs text-gray-400">
                                                <span className="flex items-center gap-1">
                                                    <User className="w-3 h-3" />
                                                    {authorName}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Calendar className="w-3 h-3" />
                                                    {formatDate(post.date)}
                                                </span>
                                            </div>
                                            <ArrowRight className="w-4 h-4 text-green-600 group-hover:translate-x-1 transition-transform" />
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                )}
            </main>
            <Footer />
        </div>
    );
}
