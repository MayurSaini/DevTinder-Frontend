import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const baseApi = createApi({
  reducerPath: "api",

  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:4321",

    credentials: "include",
  }),

  tagTypes: [
    "User",
    "Feed",
    "Connections",
    "Requests",
  ],

  endpoints: () => ({}),
});