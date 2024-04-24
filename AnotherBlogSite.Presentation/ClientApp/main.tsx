import * as React from 'react'
import * as ReactDOM from 'react-dom/client'
import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import App from './App'
import './assets/index.css'
import SignInPage from "./pages/SignInPage.tsx";
import BlogsPage from "./pages/BlogsPage.tsx";
import BlogDetailsPage from "./pages/BlogDetailsPage.tsx";
import AuthContextProvider from "./components/AuthContext.tsx";
import BlogEditPage from "./pages/BlogEditPage.tsx";

const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            {
                index: true,
                element: <Navigate replace to={'blogPosts'} />
            },
            {
                path: "blogPosts",
                element: <BlogsPage />
            },
            {
                path: "blogPosts/new",
                element: <BlogEditPage />
            },
            {
                path: "signIn",
                element: <SignInPage />
            },
            {
                path: "blogPosts/:blogPostId",
                element: <BlogDetailsPage />
            },
            {
                path: "blogPosts/:blogPostId/edit",
                element: <BlogEditPage />
            }
        ]
    },
]);

const queryClient = new QueryClient({});

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <QueryClientProvider client={queryClient}>
            <AuthContextProvider>
                <RouterProvider router={router} />
            </AuthContextProvider>
        </QueryClientProvider>
    </React.StrictMode>,
)
