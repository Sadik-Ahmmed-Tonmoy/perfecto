import {useQuery} from "@tanstack/react-query";
import axios from "axios";

const useHomeData = () => {
    const {
        data: homeData,
        isLoading,
        isError,
        error,
    } = useQuery({
        queryKey: ["homeData"],
        queryFn: async () => {
            try {
                const res = await axios.get(`get-home-web`);
                return res.data;
            } catch (error) {
                throw new Error(error.response?.data?.message || "Failed to fetch banner data");
            }
        },
    });

    return {homeData, isLoading, isError, error};
};

export default useHomeData;
