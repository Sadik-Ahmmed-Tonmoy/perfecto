import {baseApi} from "../../api/baseApi";

const contactApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        contact: builder.mutation({
            query: (data) => {
                return {
                    url: `contact-store`,
                    method: "POST",
                    body: data,
                };
            },
        }),
        getContact: builder.query({
            query: () => ({
                url: "get-general-setting",
                method: "GET",
            }),
        }),
    }),
});

export const {useContactMutation, useGetContactQuery} = contactApi;
