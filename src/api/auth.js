import axios from "axios";
import { API_URL } from "./constant";


export const loginUser = async (email, password) => {
    try {
        console.log("type-==-=-=-=-=-=->", typeof email, typeof password)
        const response = await axios.post(`${API_URL}/login`, {
            emailId: email,
            password,
        }, {
            withCredentials: true
        });
        console.log("res=-=--==-=-=-==-=-=-=->", response);

        return response.data;
    } catch (error) {
        console.log("error-==-=-=-=--=-=>", error)
    }

};