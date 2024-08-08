import {baseApi} from "../../api/baseApi";

const shippingChargeApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        shippingCharge: builder.query({
            query: () => ({
                url: "getShippingCharge",
                method: "GET",
            }),
        }),

    }),
});

export const {useShippingChargeQuery} = shippingChargeApi;
