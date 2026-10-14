import { baseApi } from "./baseApi";

export const feedApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    getFeed: builder.query({
      query: () => "/feed",
      providesTags: ["Feed"],
    }),

    sendRequest: builder.mutation({
      query: ({ userId, status }) => ({
        url: `/request/send/${status}/${userId}`,
        method: "POST",
      }),

      invalidatesTags: ["Feed", "Requests"],
    }),

    getConnections: builder.query({
      query: () => "/user/connections",
      providesTags: ["Connections"],
    }),

    getReceivedRequests: builder.query({
      query: () => "/user/request/interested",
      providesTags: ["Requests"],
    }),

    reviewRequest: builder.mutation({
      query: ({ requestId, status }) => ({
        url: `/request/review/${status}/${requestId}`,
        method: "POST",
      }),
      invalidatesTags: ["Requests", "Connections", "Feed"],
    }),

  }),
});

export const {
  useGetFeedQuery,
  useSendRequestMutation,
  useGetConnectionsQuery,
  useGetReceivedRequestsQuery,
  useReviewRequestMutation,
} = feedApi;
