import { motion } from "framer-motion";
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
  Box,
} from "@mui/material";
import { FiArrowRight, FiClock } from "react-icons/fi";
import TiltCard from "./effects/TiltCard";

const tagClassMap = {
  AI: "blog-tag--ai",
  Mobile: "blog-tag--mobile",
  Laptop: "blog-tag--laptop",
  Gadgets: "blog-tag--gadgets",
  Accessories: "blog-tag--gadgets",
};

const BlogTag = ({ tag }) => (
  <span className={`blog-tag ${tagClassMap[tag] || "blog-tag--default"}`}>{tag}</span>
);

const BlogCard = ({ blog, index = 0, featured = false, onReadMore }) => {
  const handleReadMore = () => {
    if (onReadMore) {
      onReadMore();
      return;
    }

    window.location.assign(`/blogs/${blog.slug || blog.id}`);
  };

  const tags = blog.tags || [blog.tag || "Tech"];

  if (featured) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        onClick={handleReadMore}
        style={{ cursor: "pointer", height: "100%" }}
      >
        <TiltCard maxTilt={4}>
          <div className="blog-featured glass-panel">
            <img src={blog.image} alt={blog.title} className="blog-featured__img" />
            <span className="blog-read-badge">
              <FiClock size={12} />
              {blog.readTime}
            </span>
            <div className="blog-featured__overlay" />
            <div className="blog-featured__content">
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.75, mb: 2 }}>
                {tags.map((t) => (
                  <BlogTag key={t} tag={t} />
                ))}
              </Box>
              <Typography
                variant="h4"
                sx={{ color: "#F8FAFC", fontWeight: 800, mb: 1.5, lineHeight: 1.2 }}
              >
                {blog.title}
              </Typography>
              <Typography variant="body1" sx={{ color: "#94A3B8", mb: 2, maxWidth: 600 }}>
                {blog.description}
              </Typography>
              <Typography variant="caption" sx={{ color: "#64748B" }}>
                {blog.date}
              </Typography>
            </div>
          </div>
        </TiltCard>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ delay: index * 0.08, duration: 0.45 }}
      style={{ height: "100%" }}
    >
      <TiltCard maxTilt={5}>
        <Card
          className="blog-card-premium glass-panel"
          sx={{ height: "100%", display: "flex", flexDirection: "column" }}
        >
          <Box className="blog-card-premium__img-wrap">
            <CardMedia
              component="img"
              height="200"
              image={blog.image}
              alt={blog.title}
              className="blog-card-premium__img"
              sx={{ objectFit: "cover" }}
            />
            <span className="blog-read-badge">
              <FiClock size={12} />
              {blog.readTime}
            </span>
          </Box>

          <CardContent sx={{ flexGrow: 1, display: "flex", flexDirection: "column", p: 2.5 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.75, flexWrap: "wrap", mb: 1.5 }}>
              {tags.map((t) => (
                <BlogTag key={t} tag={t} />
              ))}
              <Typography variant="caption" sx={{ color: "#64748B", ml: "auto" }}>
                {blog.date}
              </Typography>
            </Box>

            <Typography
              variant="h6"
              sx={{ color: "#F8FAFC", fontWeight: 600, fontSize: "1.05rem", mb: 1.5, lineHeight: 1.4 }}
            >
              {blog.title}
            </Typography>

            <Typography
              variant="body2"
              sx={{ color: "#94A3B8", mb: 2, flexGrow: 1, lineHeight: 1.7 }}
            >
              {blog.description}
            </Typography>

            <Button
              variant="outlined"
              endIcon={<FiArrowRight />}
              onClick={handleReadMore}
              sx={{
                alignSelf: "flex-start",
                color: "#60A5FA",
                borderColor: "rgba(59, 130, 246, 0.4)",
                textTransform: "none",
                fontWeight: 600,
                borderRadius: 2,
                "&:hover": {
                  borderColor: "#3B82F6",
                  bgcolor: "rgba(59, 130, 246, 0.12)",
                  boxShadow: "0 0 20px rgba(59, 130, 246, 0.2)",
                },
              }}
            >
              Read More
            </Button>
          </CardContent>
        </Card>
      </TiltCard>
    </motion.div>
  );
};

export default BlogCard;
