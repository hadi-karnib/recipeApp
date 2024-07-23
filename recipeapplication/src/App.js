import "./App.css";
import Register from "./pages/register/register";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  Outlet,
} from "react-router-dom";
import Recipe from "./pages/userPages/recipe";
import { RouterProvider } from "react-router-dom";
import Login from "./pages/login/login";
import Home from "./pages/userPages/home";
import AddRecipe from "./pages/userPages/addRecipe";
function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        <Route path="/" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/recipe/:id" element={<Recipe />} />
        <Route path="add-recipe" element={<AddRecipe />} />
      </>
    )
  );
  return (
    <div className="App">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
