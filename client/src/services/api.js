const API_URL = import.meta.env.VITE_API_URL;

export const registerUser = async (userData) => {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Registration failed");
  }

  return data;
};

export const loginUser = async (credentials) => {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Login failed");
  }

  return data;
};

// GET REGISTERED USER COUNTS (ADMIN DASHBOARD)
export const getUserStats = async () => {
  const token = localStorage.getItem("vc_token");

  const response = await fetch(`${API_URL}/auth/admin/user-stats`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch user stats");
  }

  return data;
};

// GET PENDING WHOLESALE APPLICATIONS
export const getPendingWholesaleApplications = async () => {
  const token = localStorage.getItem("vc_token");

  const response = await fetch(
    `${API_URL}/auth/admin/wholesale/pending`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to fetch wholesale applications"
    );
  }

  return data.applications || [];
};


// APPROVE WHOLESALE APPLICATION
export const approveWholesaleApplication = async (userId) => {
  const token = localStorage.getItem("vc_token");

  const response = await fetch(
    `${API_URL}/auth/admin/wholesale/${userId}/approve`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to approve wholesale application"
    );
  }

  return data;
};


// REJECT WHOLESALE APPLICATION
export const rejectWholesaleApplication = async (userId) => {
  const token = localStorage.getItem("vc_token");

  const response = await fetch(
    `${API_URL}/auth/admin/wholesale/${userId}/reject`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to reject wholesale application"
    );
  }

  return data;
};

export const getCurrentUser = async () => {
  const token = localStorage.getItem("vc_token");

  if (!token) {
    return null;
  }

  const response = await fetch(`${API_URL}/auth/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    localStorage.removeItem("vc_token");
    localStorage.removeItem("vc_user");
    return null;
  }

  return data.user;
};

// GET ALL PRODUCTS
export const getProducts = async (
  page = 1,
  limit = 12,
  store = "",
  filters = {}
) => {
  const params = new URLSearchParams();

  params.set("page", page);
  params.set("limit", limit);

  if (store) {
    params.set("store", store);
  }

  if (filters.category && filters.category !== "all") {
    params.set("category", filters.category);
  }

  if (filters.brand && filters.brand !== "all") {
    params.set("brand", filters.brand);
  }

  if (filters.bikeBrand && filters.bikeBrand !== "all") {
    params.set("bikeBrand", filters.bikeBrand);
  }

  if (filters.inStockOnly) {
    params.set("inStockOnly", "true");
  }

  if (filters.priceMax) {
    params.set("priceMax", filters.priceMax);
  }

  if (filters.searchTerm) {
    params.set("searchTerm", filters.searchTerm);
  }

  if (filters.sort) {
    params.set("sort", filters.sort);
  }

  const response = await fetch(
    `${API_URL}/products?${params.toString()}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch products");
  }

  return response.json();
};

// GET SINGLE PRODUCT
export const getProductById = async (id) => {
  const response = await fetch(`${API_URL}/products/${id}`);

  if (!response.ok) {
    throw new Error("Failed to fetch product");
  }

  return response.json();
};

// CREATE PRODUCT
export const createProduct = async (productData) => {
  const token = localStorage.getItem("vc_token");

  const response = await fetch(`${API_URL}/products`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(productData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to create product");
  }

  return data;
};


// UPDATE PRODUCT
export const updateProduct = async (id, productData) => {
  const token = localStorage.getItem("vc_token");

  const response = await fetch(`${API_URL}/products/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(productData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to update product");
  }

  return data;
};

// DELETE PRODUCT
export const deleteProduct = async (id) => {
  const token = localStorage.getItem("vc_token");

  const response = await fetch(`${API_URL}/products/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to delete product");
  }

  return data;
};


// CREATE RAZORPAY ORDER
export const createRazorpayOrder = async (items) => {
  const token = localStorage.getItem("vc_token");

  const response = await fetch(
    `${API_URL}/payments/create-order`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        items,
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to create Razorpay order"
    );
  }

  return data;
};

// VERIFY RAZORPAY PAYMENT
export const verifyRazorpayPayment = async (paymentData) => {
  const token = localStorage.getItem("vc_token");

  const response = await fetch(`${API_URL}/payments/verify`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(paymentData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Payment verification failed");
  }

  return data;
};
//CREATE ORDER
export const createOrder = async (orderData) => {
  const token = localStorage.getItem("vc_token");

  const response = await fetch(`${API_URL}/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(orderData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to create order");
  }

  return data;
};

//GETMY ORDERS
export const getMyOrders = async () => {
  const token = localStorage.getItem("vc_token");

  const response = await fetch(`${API_URL}/orders/my`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch orders");
  }

  return data.orders;
};

//GET ALL ORDERS
export const getAllOrders = async () => {
  const token = localStorage.getItem("vc_token");

  const response = await fetch(`${API_URL}/orders/admin`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch all orders");
  }

  return data.orders;
};

//UPDATE ORDER STATUS
export const updateOrderStatus = async (orderId, status) => {
  const token = localStorage.getItem("vc_token");

  const response = await fetch(`${API_URL}/orders/${orderId}/status`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      status,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to update order status");
  }

  return data.order;
};