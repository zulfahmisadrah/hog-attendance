import {useEffect, useState} from "react";
import axios from "axios";

const useAxios = (axiosParams) => {
    const [response, setResponse] = useState(null);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const fetchData = async (params) => {
        try {
            const result = await axios.request(params);
            setResponse(result.data);
        } catch (error) {
            setError(error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData(axiosParams);
    }, []);

    return {response, error, isLoading};
}

export default useAxios;