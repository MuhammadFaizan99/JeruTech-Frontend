import { useMemo } from "react";
import BlogCard from "../components/BlogCard";
import Pagination from "../components/Pagination";
import ScrollReveal from "../components/effects/ScrollReveal";
import { usePagination } from "../hooks/usePagination";
import { useAppSelector } from "../redux/hooks";
import { showInfoToast } from "../utils/toast";
import "../styles/Learn.scss";
import "../styles/Pagination.scss";

const openArticle = (title) => {
  showInfoToast(`Opening: "${title}" — Full blog content coming soon!`);
};

const Learn = () => {
  const blogs = useAppSelector((state) => state.product.blogs);
  const featured = blogs.find((b) => b.featured) || blogs[0];
  const trending = blogs.filter((b) => b.trending);
  const listBlogs = useMemo(
    () => blogs.filter((b) => b.id !== featured.id),
    [blogs, featured.id]
  );

  const itemsPerPage = 8;
  const { currentPage, totalPages, paginatedItems, goToPage, totalItems } = usePagination(listBlogs, itemsPerPage);

  return (
    <div className="page-wrapper learn-page">
      <section className="learn-page__header" id="learn-top">
        <ScrollReveal direction="up">
          <h1>Learn / Blogs</h1>
          <p>
            Stay updated with the latest technology trends, buying guides, and
            expert tips from JeruTech.
          </p>
        </ScrollReveal>
      </section>

      <section className="learn-page__body">
        <div className="learn-page__layout">
          <div className="learn-page__main">
            <ScrollReveal direction="left">
              <span className="learn-page__featured-label">Featured Article</span>
              <BlogCard blog={featured} featured />
            </ScrollReveal>

            <ScrollReveal direction="up" delay={0.15}>
              <h2 className="learn-page__section-title">Latest Articles</h2>
            </ScrollReveal>

            <div className="learn-page__grid" id="learn-list">
              {paginatedItems.map((blog, index) => (
                <BlogCard key={blog.id} blog={blog} index={index} />
              ))}
            </div>

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={totalItems}
              itemsPerPage={itemsPerPage}
              onPageChange={goToPage}
              scrollTarget="#learn-list"
            />
          </div>

          <aside className="learn-page__sidebar">
            <ScrollReveal direction="right">
              <div className="learn-page__tag-cloud">
                <span className="blog-tag blog-tag--ai">AI</span>
                <span className="blog-tag blog-tag--mobile">Mobile</span>
                <span className="blog-tag blog-tag--laptop">Laptop</span>
                <span className="blog-tag blog-tag--gadgets">Gadgets</span>
              </div>
              <h3 className="learn-page__sidebar-title">🔥 Trending Now</h3>
              {trending.map((blog) => (
                <div
                  key={blog.id}
                  className="trending-blog-item"
                  onClick={() => openArticle(blog.title)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === "Enter" && openArticle(blog.title)}
                >
                  <img src={blog.image} alt={blog.title} />
                  <div>
                    <h6>{blog.title}</h6>
                    <span>{blog.readTime}</span>
                  </div>
                </div>
              ))}
            </ScrollReveal>
          </aside>
        </div>
      </section>
    </div>
  );
};

export default Learn;
