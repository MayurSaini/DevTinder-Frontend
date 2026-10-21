import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_URL } from "./constant";

export const baseApi = createApi({
  reducerPath: "api",

  baseQuery: fetchBaseQuery({
    baseUrl: API_URL,

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