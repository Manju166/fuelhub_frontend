import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./form/Login";
import Register from "./form/Register";
import Dashboard from "./pages/Dashboard";
import PrivateRoute from "./routes/PrivateRoutes";
import { ThemeProvider } from "./components/ThemeContext";
import ConsumerBranch from "./SidebarComp/ConsumerBranch";

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route element={<PrivateRoute />}>
            <Route path="/dashboard/*" element={<Dashboard />} />
            <Route
              path="/consumerbranch/:consumerId"
              element={<ConsumerBranch />}
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
