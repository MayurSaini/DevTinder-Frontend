import { baseApi } from "./baseApi";

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    login: builder.mutation({
      query: (credentials) => ({
        url: "/login",
        method: "POST",
        body: credentials,
      }),
    }),

    signup: builder.mutation({
      query: (userData) => ({
        url: "/signup",
        method: "POST",
        body: userData,
      }),
    }),

    logout: builder.mutation({
      query: () => ({
        url: "/logout",
        method: "POST",
      }),
    }),

    getProfile: builder.query({
      query: ({ requestId }) => `/profile/view/${requestId}`,
      providesTags: ["User"],
    }),
    updateProfile: builder.mutation({
      query: (userData) => ({
        url: "/profile/edit",
        method: "PATCH",
        body: userData
      }),
      invalidatesTags: ["User"],
    })
  }),
});

export const {
  useLoginMutation,
  useSignupMutation,
  useLogoutMutation,
  useGetProfileQuery,
  useLazyGetProfileQuery,
  useUpdateProfileMutation,
} = authApi;
