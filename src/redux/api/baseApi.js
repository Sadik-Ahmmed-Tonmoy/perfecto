import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import {getTokenFromLocalStorage} from "../../utilities/tokenHandler";

const baseQuery = fetchBaseQuery({
    baseUrl: "https://app.perfectoblog.com/api/",
    // credentials: 'include',
    tagTypes: ["User"],
    prepareHeaders: (headers, {getState}) => {
        // const token = getState().auth.token;
        const token = getTokenFromLocalStorage();
        headers.set("accept", "application/json");

        if (token) {
            headers.set("authorization", `Bearer ${token}`);
        }
        return headers;
    },
});

export const baseApi = createApi({
    reducerPath: "baseApi",
    baseQuery: baseQuery,
    tagTypes: ["User", "Cart", "order", "WishList", "Pathao", "Reviews"],
    endpoints: () => ({}),
});
