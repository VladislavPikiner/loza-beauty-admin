import React, { useState } from "react";
import { Route, Routes } from "react-router-dom";
import Login from "./components/Login.jsx";
import "./App.css";
import CreateService from "./components/CreateService.jsx";
import Services from "./components/Services.jsx";
import Records from "./components/Records.jsx";
import Home from "./components/Home.jsx";
import Navbar from "./components/Navbar.jsx";
import { Box, CssBaseline } from "@mui/material";
import { styled, ThemeProvider } from "@mui/material/styles";
import Archive from "./components/Archive.jsx";
import { theme } from "./theme.js";
import Vacation from "./components/Vacation.jsx";
import Settings from "./components/Settings.jsx";
export const AuthContext = React.createContext();

function App() {
  const [isAuth, setIsAuth] = useState(false);

  return (
    <ThemeProvider theme={theme}>
      <AuthContext.Provider value={{ isAuth, setIsAuth }}>
        <Box sx={{ display: "flex" }}>
          <CssBaseline />
          <Navbar />
          <Box component="main" sx={{ flexGrow: 1, mt: 7 }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/records" element={<Records />} />
              <Route path="/services" element={<Services />} />
              <Route path="/archive" element={<Archive />} />
              <Route path="/vacations" element={<Vacation />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </Box>
        </Box>
      </AuthContext.Provider>
    </ThemeProvider>
  );
}

export default App;
