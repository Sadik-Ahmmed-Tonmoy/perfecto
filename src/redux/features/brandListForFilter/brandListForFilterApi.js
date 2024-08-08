import {baseApi} from "../../api/baseApi";

const brandListForFilterApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        // order: builder.mutation({
        //     query: (data) => {
        //         return {
        //             url: `order-store`,
        //             method: "POST",
        //             body: data,
        //         };
        //     },
        // }),
        brandListForFilter: builder.query({
            query: () => ({
                url: "brand-format",
                method: "GET",
            }),
        }),
        topBrandListForFilter: builder.query({
            query: () => ({
                url: "top-brand",
                method: "GET",
            }),
        }),
    }),
});

export const {useBrandListForFilterQuery, useTopBrandListForFilterQuery} = brandListForFilterApi;
