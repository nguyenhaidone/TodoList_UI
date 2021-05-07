import axios from 'axios';
import queryString from 'querystring';

const axiosClient = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
    headers:{
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
    },
    paramsSerializer: params => queryString.stringify(params),
});

axiosClient.interceptors.request.use(async (config)=>{
    //handle token here. . .
    return config;
})

axiosClient.interceptors.response.use((response)=>{
    if(response && response.data){
        return response.data;
    }

    return response;
},(error)=>{
    throw error;
})

export default axiosClient;