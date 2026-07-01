import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useStore = create(
    persist(
        (set) => ({
            authorLoginData: {
                author_id: null,
                name:      null,
                email:     null,
                phone:     null,
                access_token: null,
                token_type: null,
            },
            setAuthorLoginData: (data) => set({ authorLoginData: data }),
            logoutAuthor: () => set({
                authorLoginData: {
                    author_id: null,
                    name:      null,
                    email:     null,
                    phone:     null,
                    access_token: null,
                    token_type: null,
                }
            }),

            tkt_data: {},
            setTktData: (data) => set({ tkt_data: data }),


            // Admin data start
            adminLoginData: {
                admin_id:   null,
                admin_code: null,
                name:       null,
                email:      null,
                access_token: null,
                token_type: null,
            },
            setAdminLoginData: (data) => set({ adminLoginData: data }),
            logoutAdmin: () => set({
                adminLoginData: {
                    admin_id:   null,
                    admin_code: null,
                    name:       null,
                    email:      null,
                    access_token: null,
                    token_type: null,
                }
            }),

            adminTktData: {},
            setAdminTktData: (data) => set({ adminTktData: data }),
        }),
        { name: "loginData" }
    )
)