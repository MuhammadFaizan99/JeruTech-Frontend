import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { blogs } from "../../data/blogs";
import api from "../../api";
import { uploadFilesToS3 } from "../../utils/upload";

const normalizeProduct = (product) => ({
  ...product,
  id: product._id || product.id,
  images: Array.isArray(product.images) && product.images.length
    ? product.images.filter(Boolean)
    : product.image
      ? [product.image]
      : [],
  company: product.company || product.name?.split(" ")[0] || "JeruTech",
});

const normalizeProducts = (products = []) =>
  products.map((product) => normalizeProduct(product));

const sanitizeParams = (params = {}) =>
  Object.fromEntries(
    Object.entries(params).filter(([, value]) => value !== undefined && value !== null && value !== "")
  );

const getUniqueCompanies = (products = []) =>
  [...new Set(
    products
      .map((product) => product.company || product.name?.split(" ")[0] || "JeruTech")
      .filter((company) => typeof company === "string" && company.trim())
      .map((company) => company.trim())
  )].sort((left, right) => left.localeCompare(right));

const initialState = {
  products: [],
  product: null,
  discountedProducts: [],
  nonDiscountedProducts: [],
  companies: [],
  blogs,
  selectedProduct: null,
  categories: [],
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    limit: 8,
    hasNextPage: false,
    hasPrevPage: false,
  },
  discountedPagination: {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    limit: 8,
    hasNextPage: false,
    hasPrevPage: false,
  },
  loading: false,
  listLoading: false,
  detailLoading: false,
  error: null,
  success: false,
};

export const fetchProducts = createAsyncThunk(
  "product/fetchProducts",
  async (params = {}, { rejectWithValue }) => {
    try {
      const res = await api.get("/products", { params: sanitizeParams(params) });
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch products."
      );
    }
  }
);

export const fetchProductById = createAsyncThunk(
  "product/fetchProductById",
  async (id, { rejectWithValue }) => {
    try {
      const res = await api.get(`/products/${id}`);
      return res.data.product;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch product."
      );
    }
  }
);

export const fetchDiscountedProducts = createAsyncThunk(
  "product/fetchDiscountedProducts",
  async (params = {}, { rejectWithValue }) => {
    try {
      const res = await api.get("/products", {
        params: sanitizeParams({ ...params, isDiscounted: true }),
      });
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch discounted products."
      );
    }
  }
);

export const fetchNonDiscountedProducts = createAsyncThunk(
  "product/fetchNonDiscountedProducts",
  async (params = {}, { rejectWithValue }) => {
    try {
      const res = await api.get("/products", {
        params: sanitizeParams({ ...params, isDiscounted: false }),
      });
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch non-discounted products."
      );
    }
  }
);

export const searchProducts = createAsyncThunk(
  "product/searchProducts",
  async (searchTerm, { rejectWithValue }) => {
    try {
      const res = await api.get("/products", {
        params: sanitizeParams({ search: searchTerm, isDiscounted: false }),
      });
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to search products."
      );
    }
  }
);

export const createProduct = createAsyncThunk(
  "product/createProduct",
  async (productData, { rejectWithValue }) => {
    try {
      const imageEntries = Array.isArray(productData.images)
        ? productData.images
        : productData.image
          ? [productData.image]
          : [];
      const resolvedImages = await uploadFilesToS3({ files: imageEntries, folder: "products" });

      const res = await api.post("/products", {
        ...productData,
        images: resolvedImages,
      });
      return res.data.product;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create product."
      );
    }
  }
);

export const updateProduct = createAsyncThunk(
  "product/updateProduct",
  async ({ id, productData }, { rejectWithValue }) => {
    try {
      const imageEntries = Array.isArray(productData.images)
        ? productData.images
        : productData.image
          ? [productData.image]
          : [];
      const resolvedImages = await uploadFilesToS3({ files: imageEntries, folder: "products" });

      const res = await api.put(`/products/${id}`, {
        ...productData,
        images: resolvedImages,
      });
      return res.data.product;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update product."
      );
    }
  }
);

export const deleteProduct = createAsyncThunk(
  "product/deleteProduct",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/products/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete product."
      );
    }
  }
);

const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    setProducts: (state, action) => {
      state.products = action.payload;
      state.discountedProducts = action.payload.filter(
        (product) => Number(product.discount) > 0
      );
    },
    setDiscountedProducts: (state, action) => {
      state.discountedProducts = action.payload;
    },
    setBlogs: (state, action) => {
      state.blogs = action.payload;
    },
    setSelectedProduct: (state, action) => {
      state.selectedProduct = action.payload;
    },
    clearSelectedProduct: (state) => {
      state.selectedProduct = null;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    clearProductError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.listLoading = true;
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.listLoading = false;
        state.loading = false;
        state.success = true;
        const payload = action.payload || {};
        const normalizedProducts = normalizeProducts(payload.data || []);
        state.products = normalizedProducts;
        state.categories = (payload.categories || []).filter((value) => value !== "All");
        state.companies = (payload.companies || getUniqueCompanies(normalizedProducts)).filter((value) => typeof value === "string" && value.trim());
        state.discountedProducts = normalizedProducts.filter(
          (product) => product.isDiscounted === true
        );
        state.nonDiscountedProducts = normalizedProducts.filter(
          (product) => product.isDiscounted === false
        );
        state.pagination = {
          currentPage: payload.pagination?.currentPage || payload.currentPage || 1,
          totalPages: payload.pagination?.totalPages || payload.totalPages || 1,
          totalItems: payload.pagination?.totalItems || payload.totalItems || normalizedProducts.length,
          limit: payload.pagination?.limit || payload.limit || 8,
          hasNextPage: payload.pagination?.hasNextPage ?? payload.hasNextPage ?? false,
          hasPrevPage: payload.pagination?.hasPrevPage ?? payload.hasPrevPage ?? false,
        };
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.listLoading = false;
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })

      .addCase(fetchProductById.pending, (state) => {
        state.detailLoading = true;
        state.loading = true;
        state.product = null;
        state.error = null;
        state.success = false;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.detailLoading = false;
        state.loading = false;
        state.success = true;
        const normalizedProduct = normalizeProduct(action.payload);
        state.product = normalizedProduct;
        state.selectedProduct = normalizedProduct;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.detailLoading = false;
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })

      .addCase(fetchDiscountedProducts.pending, (state) => {
        state.listLoading = true;
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(fetchDiscountedProducts.fulfilled, (state, action) => {
        state.listLoading = false;
        state.loading = false;
        state.success = true;
        const payload = action.payload || {};
        const normalizedProducts = normalizeProducts(payload.data || []);
        state.discountedProducts = normalizedProducts;
        state.companies = (payload.companies || getUniqueCompanies(normalizedProducts)).filter((value) => typeof value === "string" && value.trim());
        state.discountedPagination = {
          currentPage: payload.pagination?.currentPage || payload.currentPage || 1,
          totalPages: payload.pagination?.totalPages || payload.totalPages || 1,
          totalItems: payload.pagination?.totalItems || payload.totalItems || normalizedProducts.length,
          limit: payload.pagination?.limit || payload.limit || 8,
          hasNextPage: payload.pagination?.hasNextPage ?? payload.hasNextPage ?? false,
          hasPrevPage: payload.pagination?.hasPrevPage ?? payload.hasPrevPage ?? false,
        };
      })
      .addCase(fetchDiscountedProducts.rejected, (state, action) => {
        state.listLoading = false;
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })

      .addCase(fetchNonDiscountedProducts.pending, (state) => {
        state.listLoading = true;
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(fetchNonDiscountedProducts.fulfilled, (state, action) => {
        state.listLoading = false;
        state.loading = false;
        state.success = true;
        const payload = action.payload || {};
        const normalizedProducts = normalizeProducts(payload.data || []);
        state.nonDiscountedProducts = normalizedProducts;
        state.companies = (payload.companies || getUniqueCompanies(normalizedProducts)).filter((value) => typeof value === "string" && value.trim());
      })
      .addCase(fetchNonDiscountedProducts.rejected, (state, action) => {
        state.listLoading = false;
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })

      .addCase(searchProducts.pending, (state) => {
        state.listLoading = true;
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(searchProducts.fulfilled, (state, action) => {
        state.listLoading = false;
        state.loading = false;
        state.success = true;
        const payload = action.payload || {};
        const normalizedProducts = normalizeProducts(payload.data || []);
        state.products = normalizedProducts;
        state.categories = (payload.categories || state.categories).filter((value) => value !== "All");
        state.companies = (payload.companies || getUniqueCompanies(normalizedProducts)).filter((value) => typeof value === "string" && value.trim());
        state.discountedProducts = normalizedProducts.filter(
          (product) => product.isDiscounted === true
        );
        state.nonDiscountedProducts = normalizedProducts.filter(
          (product) => product.isDiscounted === false
        );
      })
      .addCase(searchProducts.rejected, (state, action) => {
        state.listLoading = false;
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })

      .addCase(createProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.loading = false;
        const createdProduct = normalizeProduct(action.payload);
        state.products.unshift(createdProduct);

        if (Number(createdProduct.discount) > 0) {
          state.discountedProducts.unshift(createdProduct);
        }

        state.companies = getUniqueCompanies(state.products);
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(updateProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.loading = false;
        const updatedProduct = normalizeProduct(action.payload);

        const updatedProductId = updatedProduct._id || updatedProduct.id;

        state.products = state.products.map((product) =>
          (product._id || product.id) === updatedProductId
            ? updatedProduct
            : product
        );

        state.discountedProducts = state.products.filter(
          (product) => Number(product.discount) > 0
        );

        state.companies = getUniqueCompanies(state.products);

        if (
          state.selectedProduct &&
          (state.selectedProduct._id || state.selectedProduct.id) === updatedProductId
        ) {
          state.selectedProduct = updatedProduct;
        }
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(deleteProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.loading = false;

        state.products = state.products.filter(
          (product) => (product._id || product.id) !== action.payload
        );

        state.discountedProducts = state.discountedProducts.filter(
          (product) => (product._id || product.id) !== action.payload
        );

        state.companies = getUniqueCompanies(state.products);
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  setProducts,
  setDiscountedProducts,
  setBlogs,
  setSelectedProduct,
  clearSelectedProduct,
  setLoading,
  setError,
  clearProductError,
} = productSlice.actions;

export default productSlice.reducer;