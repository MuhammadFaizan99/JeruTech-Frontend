import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import BlogCard from "../components/BlogCard";
import Pagination from "../components/Pagination";
import ScrollReveal from "../components/effects/ScrollReveal";
import { usePagination } from "../hooks/usePagination";
import api from "../api";
import "../styles/Learn.scss";
import "../styles/Pagination.scss";

const Learn = () => {
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadBlogs = async () => {
      try {
        setLoading(true);
        setError("");
        const [blogsResponse, categoriesResponse] = await Promise.all([
          api.get("/blogs"),
          api.get("/categories?limit=100"),
        ]);

        const remoteBlogs = (blogsResponse.data?.blogs || []).map((blog) => ({
          ...blog,
          id: blog._id || blog.id,
          title: blog.title,
          description: (blog.description || "")
            .replace(/<[^>]+>/g, " ")
            .replace(/&nbsp;/g, " ")
            .replace(/\s+/g, " ")
            .trim()
            .slice(0, 160),
          image: blog.image,
          date: blog.createdAt ? new Date(blog.createdAt).toLocaleDateString() : "Recently published",
          tags: (blog.categories || []).map((category) => category.name),
          slug: blog.slug,
        }));

        setBlogs(remoteBlogs);
        setCategories([{ _id: "all", name: "All" }, ...(categoriesResponse.data?.categories || [])]);
      } catch (err) {
        setError(err.response?.data?.message || "Unable to load blogs right now.");
      } finally {
        setLoading(false);
      }
    };

    loadBlogs();
  }, []);

  const filteredBlogs = useMemo(() => {
    if (!selectedCategory || selectedCategory === "all") {
      return blogs;
    }

    return blogs.filter((blog) =>
      (blog.categories || []).some((category) => {
        const categoryId = category._id || category.id;
        return categoryId === selectedCategory || category.name === selectedCategory;
      })
    );
  }, [blogs, selectedCategory]);

  const itemsPerPage = 6;
  const { currentPage, totalPages, paginatedItems, goToPage, totalItems } = usePagination(filteredBlogs, itemsPerPage);

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
        <div className="learn-page__main">
          {loading ? (
            <div className="learn-page__status-card">Loading fresh blog posts…</div>
          ) : error ? (
            <div className="learn-page__status-card">{error}</div>
          ) : (
            <>
              <ScrollReveal direction="up">
                <div className="learn-page__filters" role="toolbar" aria-label="Blog categories">
                  {categories.map((category) => (
                    <button
                      key={category._id || category.id || category.name}
                      type="button"
                      className={`learn-page__filter-chip${selectedCategory === (category._id || category.id || category.name) ? " learn-page__filter-chip--active" : ""}`}
                      onClick={() => setSelectedCategory(category._id || category.id || category.name)}
                    >
                      {category.name}
                    </button>
                  ))}
                </div>
              </ScrollReveal>

              {filteredBlogs.length === 0 ? (
                <div className="learn-page__status-card">No blogs found for this category yet.</div>
              ) : (
                <>
                  <div className="learn-page__grid" id="learn-list">
                    {paginatedItems.map((blog, index) => (
                      <BlogCard key={blog.id} blog={blog} index={index} onReadMore={() => navigate(`/blogs/${blog.slug}`)} />
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
                </>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
};

export default Learn;
