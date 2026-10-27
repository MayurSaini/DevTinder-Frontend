import io from "socket.io-client";
import { API_URL } from "../api/constant";
export const createSocketConnection = () => {
    if(location.hash === "localhost") {
        return io(API_URL)
    } else {
        return io("/", {path: "/api/socket.io"})
    }
    return io(API_URL)
}