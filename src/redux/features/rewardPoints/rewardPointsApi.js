import {baseApi} from "../../api/baseApi";

const rewardPointsApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        //   offerProducts: builder.mutation({
        //         query: (data) => {
        //             return {
        //                 url: `offer-products`,
        //                 method: "POST",
        //                 body: data,
        //             };
        //         },
        //     }),
        getRewardPointsData: builder.query({
            query: () => ({
                url: "getRewardData",
                method: "GET",
            }),
        }),
        getRewardPointsHistory: builder.query({
            query: () => ({
                url: "reward-history",
                method: "GET",
            }),
        }),
    }),
});

export const {useGetRewardPointsDataQuery, useGetRewardPointsHistoryQuery} = rewardPointsApi;
