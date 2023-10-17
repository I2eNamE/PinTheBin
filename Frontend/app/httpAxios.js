import axios from 'axios';
import { redirect } from 'next/navigation'

const instance = axios.create({});


instance.interceptors.response.use(function (response) {
    return response;
}, function (error) {
    console.log("kanchu: this is not cute")
    redirect('/')
    return Promise.reject(error);
});

export default instance;