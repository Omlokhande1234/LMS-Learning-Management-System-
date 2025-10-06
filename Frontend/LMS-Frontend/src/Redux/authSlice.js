import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-hot-toast";
import axiosInstance from "../Helper/axiosInstance";

const initialState = {
  isLoggedIn: localStorage.getItem("isLoggedIn") === "true",
  data: localStorage.getItem("data") ? JSON.parse(localStorage.getItem("data")) : {},
  role: localStorage.getItem("role") || "",
};

// function to handle signup
export const createAccount = createAsyncThunk("/user/signup", async (data) => {
  try {
    // Backend route: app.use('/user', authRoutes) -> router.post('/signup')
    let res = axiosInstance.post("/user/signup", data);

    toast.promise(res, {
      loading: "Wait! Creating your account",
      success: (data) => {
        return data?.data?.message;
      },
      error: "Failed to create account",
    });

    res = await res;
    return res.data;
  } catch (error) {
    toast.error(error?.response?.data?.message || error.message);
  }
});

// function to fetch user data
export const getUserData = createAsyncThunk("/user/getuser", async () => {
  try {
    // Backend route: router.get('/getuser')
    const res = await axiosInstance.get("/user/getuser");
    return res?.data;
  } catch (error) {
    toast.error(error?.response?.data?.message || error.message);
  }
});
// (old misplaced changePassword block removed)

// function to handle login
export const login = createAsyncThunk("auth/login", async (data) => {
  try {
    let res = axiosInstance.post("/user/signin", data);

    await toast.promise(res, {
      loading: "Loading...",
      success: (d) => d?.data?.message,
      error: "Failed to log in",
    });

    res = await res;
    return res.data;
  } catch (error) {
    toast.error(error?.response?.data?.message || error.message);
  }
});

// function to handle logout
export const logout = createAsyncThunk("auth/logout", async () => {
  try {
    let res = axiosInstance.get("/user/signout");

    await toast.promise(res, {
      loading: "Loading...",
      success: (d) => d?.data?.message,
      error: "Failed to log out",
    });

    res = await res;
    return res.data;
  } catch (error) {
    toast.error(error?.response?.data?.message || error.message);
  }
});

// function to change user password
export const changePassword = createAsyncThunk(
  "/auth/changePassword",
  async (userPassword) => {
    try {
      let res = axiosInstance.post("/user/change-password", userPassword);

      await toast.promise(res, {
        loading: "Loading...",
        success: (d) => d?.data?.message,
        error: "Failed to change password",
      });

      res = await res;
      return res.data;
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    }
  }
);

// function to handle forget password
export const forgetPassword = createAsyncThunk(
  "auth/forgetPassword",
  async (email) => {
    try {
      let res = axiosInstance.post("/user/reset", { email });

      await toast.promise(res, {
        loading: "Loading...",
        success: (data) => {
          return data?.data?.message;
        },
        error: "Failed to send verification email",
      });

      res = await res;
      return res.data;
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  }
);

// function to update user profile
export const updateProfile = createAsyncThunk(
  "/user/update/profile",
  async (data) => {
    try {
      let res = axiosInstance.put(`/user/update/${data[0]}`, data[1]);

      toast.promise(res, {
        loading: "Updating...",
        success: (data) => {
          return data?.data?.message;
        },
        error: "Failed to update profile",
      });
      
      res = await res;
      return res.data;
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  }
);

// function to reset the password
export const resetPassword = createAsyncThunk("/user/reset", async (data) => {
  try {
    let res = axiosInstance.post(`/user/reset/${data.resetToken}`, {
      password: data.password,
    });

    toast.promise(res, {
      loading: "Resetting...",
      success: (data) => {
        return data?.data?.message;
      },
      error: "Failed to reset password",
    });
    
    res = await res;
    return res.data;
  } catch (error) {
    toast.error(error?.response?.data?.message);
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // for user login
      .addCase(login.fulfilled, (state, action) => {
        if (action?.payload?.user) {
          localStorage.setItem("data", JSON.stringify(action.payload.user));
          localStorage.setItem("isLoggedIn", "true");
          localStorage.setItem("role", action.payload.user.role);
          state.isLoggedIn = true;
          state.data = action.payload.user;
          state.role = action.payload.user.role;
        }
      })
      // for user logout
      .addCase(logout.fulfilled, (state) => {
        localStorage.clear();
        state.isLoggedIn = false;
        state.data = {};
        state.role = "";
      })
      // for user details
      .addCase(getUserData.fulfilled, (state, action) => {
        if (action?.payload?.user) {
          localStorage.setItem("data", JSON.stringify(action.payload.user));
          localStorage.setItem("isLoggedIn", "true");
          localStorage.setItem("role", action.payload.user.role);
          state.isLoggedIn = true;
          state.data = action.payload.user;
          state.role = action.payload.user.role;
        }
      });
  },
});

export default authSlice.reducer;