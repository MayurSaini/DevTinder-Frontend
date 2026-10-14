import axios from "axios";

const API_URL = "http://localhost:4321";

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