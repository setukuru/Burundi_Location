import HomePage from "./routes/homePage/homePage.jsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ListPage from "./routes/listPage/listPage";
import {
  Layout,
  RequireAuth,
  RequireAuthProprietaire,
  RequireAuthAdmin,
} from "./routes/layout/layout";
import SinglePage from "./routes/singlePage/singlePage";
import ProfilePage from "./routes/profilePage/profilePage";
import Login from "./routes/login/login.jsx";
import Register from "./routes/register/register";
import ProfileUpdatePage from "./routes/profileUpdatePage/profileUpdatePage";
// import NewPostPage from "./routes/newPostPage/newPostPage";
import {
  listPageLoader,
  profilePageLoader,
  singlePageLoader,
} from "./lib/loaders";
// import UpdatePostPage from "./routes/UpdatePostPage/UpdatePostPage.jsx";
import ProprietaireHome from "./routes/homePageProprietaire/ProprietaireHome.jsx";
// import AdminDashboard from "./routes/admin/AdminDashboard.jsx"; // new admin dashboard
import Dashboard from "./routes/dashboard/Dashboard.jsx";

function App() {
  const router = createBrowserRouter([
    // Public routes
    {
      path: "/",
      element: <Layout />,
      children: [
        { path: "/", element: <HomePage /> },
        { path: "/list", element: <ListPage />, loader: listPageLoader },
        { path: "/login", element: <Login /> },
        { path: "/register", element: <Register /> },
        { path: "/:id", element: <SinglePage />, loader: singlePageLoader },
      ],
    },

    // Authenticated routes (all logged-in users)
    {
      path: "/",
      element: <RequireAuth />, // locataire, proprietaire, or admin
      children: [
        { path: "/profile", element: <ProfilePage />, loader: profilePageLoader },
        { path: "/profile/update", element: <ProfileUpdatePage /> },
      ],
    },

    // Proprietaire-only routes
    {
      path: "/proprietaire",
      element: <RequireAuthProprietaire />,
      children: [
        { path: "/proprietaire/home", element: <ProprietaireHome /> },
        { path: "/proprietaire/profile", element: <ProfilePage />, loader: profilePageLoader },
        { path: "/proprietaire/profile/update", element: <ProfileUpdatePage /> },
      ],
    },

    // Admin-only routes
    {
      path: "/admin",
      element: <RequireAuthAdmin />, // new component: protects only admins
      children: [
        { path: "/admin/dashboard", element: <Dashboard /> },
        // add more admin routes here
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
