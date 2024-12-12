import {create } from "zustand";
import axios from "axios";
import Cookies from "js-cookie";

const useAuthStore = create((set) =>({
    //datos para el backend
    token: !!Cookies.get("token") || null, 

    //nombre: JSON.parse(Cookies.get('nombre') || 'null'),
    isAuth: !!Cookies.get("token"),

    //peticiones del login
    login: async (data, navigate) => {
        try{
            const responde = await axios.post("http://localhost:8085/user/login", data)
            console.log(response.data)

            //guardar variables de api
            const {token } = response.data

            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

            //guardar cookies

            Cookies.set("token", token, {expires: 1, secure: true, sameSite: 'Strict'})

            
            //guardar estados globales
            set({token, isAuth: true})

            //navegaciones
            navigate("/admin")

        }catch(error){
            console.log(error)
            set({token: null, isAuth: false})
        }
    },

    logOut: () => {
        axios.defaults.headers.common['Authorization'] = ``;
        Cookies.remove("token")
        set({token: null, isAuth: false})
    }
}))

export default useAuthStore;