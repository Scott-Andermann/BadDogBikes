import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import "./index.css";
import ClickAndDrag from "./ClickAndDrag";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/resources",
    element: <App />,
  },
  {
    path: "/test",
    element: <ClickAndDrag />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
       <RouterProvider router={router} />
  </React.StrictMode>
);
