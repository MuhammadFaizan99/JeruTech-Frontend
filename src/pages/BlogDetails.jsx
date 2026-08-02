import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { Box, Chip, CircularProgress, Divider, IconButton, Stack, Typography } from "@mui/material";
import { FiArrowLeft, FiFacebook, FiLink, FiMessageCircle, FiShare2, FiTwitter } from "react-icons/fi";
import { toast } from "react-toastify";
import api from "../api";
import ScrollReveal from "../components/effects/ScrollReveal";

const BlogDetails = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [relatedBlogs, setRelatedBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadBlog = async () => {
      try {
        setLoading(true);
        setError("");
        const response = await api.get(`/blogs/${slug}`);
        const currentBlog = response.data?.blog;
        setBlog(currentBlog);

        if (currentBlog?.categories?.length) {
          const categoryIds = currentBlog.categories.map((category) => category._id || category.id).filter(Boolean);
          const relatedResponse = await api.get("/blogs");
          const filtered = (relatedResponse.data?.blogs || []).filter((item) => {
            if (item._id === currentBlog._id) return false;
            const shared = (item.categories || []).some((category) => categoryIds.includes(category._id || category.id));
            return shared;
          }).slice(0, 3);
          setRelatedBlogs(filtered);
        } else {
          setRelatedBlogs([]);
        }
      } catch (err) {
        setError(err.response?.data?.message || "Unable to load this blog right now.");
      } finally {
        setLoading(false);
      }
    };

    loadBlog();
  }, [slug]);

  const shareLinks = useMemo(() => {
    if (!blog) return [];
    const title = encodeURIComponent(blog.title);
    const url = encodeURIComponent(`${window.location.origin}/blogs/${blog.slug}`);
    return [
      { label: "Copy", icon: FiLink, action: async () => { navigator.clipboard.writeText(`${window.location.origin}/blogs/${blog.slug}`); toast.success("Link copied to clipboard."); } },
      { label: "Facebook", icon: FiFacebook, action: () => window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, "_blank", "noopener,noreferrer") },
      { label: "Twitter", icon: FiTwitter, action: () => window.open(`https://twitter.com/intent/tweet?text=${title}&url=${url}`, "_blank", "noopener,noreferrer") },
      { label: "WhatsApp", icon: FiMessageCircle, action: () => window.open(`https://wa.me/?text=${title}%20${url}`, "_blank", "noopener,noreferrer") },
    ];
  }, [blog]);

  if (loading) {
    return (
      <div className="page-wrapper" style={{ minHeight: "70vh", display: "grid", placeItems: "center" }}>
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
          <CircularProgress color="primary" />
          <Typography variant="h6" color="text.secondary">Loading blog details…</Typography>
        </Box>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="page-wrapper" style={{ minHeight: "70vh", display: "grid", placeItems: "center", padding: "2rem" }}>
        <Box sx={{ textAlign: "center", maxWidth: 560 }}>
          <Typography variant="h4" sx={{ mb: 1, color: "#F8FAFC" }}>Blog not found</Typography>
          <Typography color="text.secondary" sx={{ mb: 3 }}>{error || "This post is unavailable at the moment."}</Typography>
          <button onClick={() => navigate("/learn")} style={{ padding: "0.8rem 1.2rem", borderRadius: 999, border: "1px solid rgba(59,130,246,0.35)", background: "rgba(59,130,246,0.16)", color: "#F8FAFC", cursor: "pointer" }}>
            Back to blogs
          </button>
        </Box>
      </div>
    );
  }

  return (
    <div className="page-wrapper">
      <div style={{ maxWidth: 1180, margin: "0 auto", padding: "2rem 1rem 4rem" }}>
        <Box sx={{ mb: 3 }}>
          <button onClick={() => navigate("/learn")} style={{ display: "inline-flex", alignItems: "center", gap: 8, color: "#93C5FD", background: "transparent", border: "none", cursor: "pointer", fontWeight: 600 }}>
            <FiArrowLeft /> Back to Learn / Blogs
          </button>
        </Box>

        <nav aria-label="Breadcrumb" style={{ display: "flex", flexWrap: "wrap", gap: 8, color: "#94A3B8", marginBottom: 24 }}>
          <Link to="/" style={{ color: "inherit", textDecoration: "none" }}>Home</Link>
          <span>/</span>
          <Link to="/learn" style={{ color: "inherit", textDecoration: "none" }}>Learn</Link>
          <span>/</span>
          <span style={{ color: "#F8FAFC" }}>{blog.title}</span>
        </nav>

        <ScrollReveal direction="up">
          <Box sx={{ borderRadius: 4, overflow: "hidden", border: "1px solid rgba(255,255,255,0.12)", bgcolor: "rgba(15,23,42,0.78)", boxShadow: "0 30px 80px rgba(2,6,23,0.35)" }}>
            <img src={blog.image} alt={blog.title} style={{ width: "100%", height: "min(46vh, 420px)", objectFit: "cover" }} />
            <Box sx={{ p: { xs: 3, md: 5 } }}>
              <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" alignItems={{ xs: "flex-start", sm: "center" }} spacing={2} sx={{ mb: 2 }}>
                <Typography variant="h3" sx={{ color: "#F8FAFC", fontWeight: 800, lineHeight: 1.2 }}>
                  {blog.title}
                </Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap">
                  {shareLinks.map(({ label, icon: Icon, action }) => (
                    <IconButton key={label} onClick={action} size="small" sx={{ border: "1px solid rgba(255,255,255,0.12)", color: "#E2E8F0" }}>
                      <Icon />
                    </IconButton>
                  ))}
                </Stack>
              </Stack>

              <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} sx={{ mb: 2, color: "#94A3B8" }}>
                <Typography variant="body2">{blog.createdAt ? new Date(blog.createdAt).toLocaleDateString() : "Recently published"}</Typography>
                <Typography variant="body2">•</Typography>
                <Typography variant="body2">{(blog.categories || []).map((category) => category.name).join(" • ")}</Typography>
              </Stack>

              <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mb: 3 }}>
                {(blog.categories || []).map((category) => (
                  <Chip key={category._id || category.id || category.name} label={category.name} sx={{ bgcolor: "rgba(59,130,246,0.16)", color: "#BFDBFE", borderRadius: 999 }} />
                ))}
              </Stack>

              <Divider sx={{ mb: 3, borderColor: "rgba(255,255,255,0.1)" }} />
              <div dangerouslySetInnerHTML={{ __html: blog.description || "<p>No content available.</p>" }} style={{ color: "#E2E8F0", lineHeight: 1.9, fontSize: "1.02rem" }} />
            </Box>
          </Box>
        </ScrollReveal>

        {relatedBlogs.length > 0 && (
          <Box sx={{ mt: 6 }}>
            <Typography variant="h5" sx={{ color: "#F8FAFC", fontWeight: 700, mb: 3 }}>Related Blogs</Typography>
            <div style={{ display: "grid", gap: 20, gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))" }}>
              {relatedBlogs.map((entry) => (
                <Link key={entry._id} to={`/blogs/${entry.slug}`} style={{ textDecoration: "none", color: "inherit" }}>
                  <Box sx={{ borderRadius: 3, overflow: "hidden", border: "1px solid rgba(255,255,255,0.12)", bgcolor: "rgba(15,23,42,0.72)" }}>
                    <img src={entry.image} alt={entry.title} style={{ width: "100%", height: 170, objectFit: "cover" }} />
                    <Box sx={{ p: 2.4 }}>
                      <Typography sx={{ color: "#F8FAFC", fontWeight: 700, mb: 1 }}>{entry.title}</Typography>
                      <Typography variant="body2" color="text.secondary">{entry.createdAt ? new Date(entry.createdAt).toLocaleDateString() : "Recently published"}</Typography>
                    </Box>
                  </Box>
                </Link>
              ))}
            </div>
          </Box>
        )}
      </div>
    </div>
  );
};

export default BlogDetails;
