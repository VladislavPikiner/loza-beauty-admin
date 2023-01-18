import React, { useState, useContext } from "react";
import { AuthContext } from "../App.jsx";
import { Link, Navigate } from "react-router-dom";
import { Button, Grid, Paper, TextField, Typography, Box } from "@mui/material";

import LockIcon from "@mui/icons-material/Lock";
import axios from "../axios.js";

const Login = () => {
  const { isAuth, setIsAuth } = useContext(AuthContext);
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");

  const authHandler = async () => {
    try {
      const loginData = {
        login,
        password,
      };
      const { data } = await axios.post("/login", { login, password });
      console.log(data);
      const authToken = data.token;
      window.localStorage.setItem("token", authToken);

      authToken ? setIsAuth(true) : null;
    } catch (error) {
      console.error(error);
      alert(
        "Авторизация не удалась. Проверьте логин и пароль и повторите попытку."
      );
    }
  };
  return !isAuth ? (
    <Grid container sx={{ margin: "auto" }}>
      <Box
        sx={{
          margin: "0 auto",
          padding: "20px",
          textAlign: "center",
          height: "360px",
          maxWidth: "290px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          border: "1px solid #242424",
          borderRadius: "5px",
          boxShadow: "0 1px 3px rgba(0,0,0,.6)",
        }}
      >
        <Typography
          variant="h4"
          sx={{ margin: "5px auto", textAlign: "center" }}
        >
          Авторизація <LockIcon fontSize="large" color="success" />
        </Typography>
        <TextField
          label="Логін"
          value={login}
          onChange={(e) => setLogin(e.currentTarget.value)}
          sx={{ maxWidth: "290px" }}
        />
        <TextField
          variant="outlined"
          label="Пароль"
          value={password}
          onChange={(e) => setPassword(e.currentTarget.value)}
          type="password"
          sx={{ maxWidth: "290px" }}
        />
        <Button
          onClick={authHandler}
          variant="contained"
          color="success"
          endIcon="🚀"
        >
          Поїхали
        </Button>
      </Box>
    </Grid>
  ) : (
    <Navigate to={"/records"} replace={true} />
  );
};

export default Login;
