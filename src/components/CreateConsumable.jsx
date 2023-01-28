import {
  MenuItem,
  Select,
  TextField,
  Typography,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Divider,
  Alert,
} from "@mui/material";
import { Box } from "@mui/system";
import React, { useContext, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../App";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import axios from "../axios.js";

const token = window.localStorage.getItem("token");

const CreateConsumable = () => {
  const { isAuth } = useContext(AuthContext);
  const [name, setName] = useState("");
  const [units, setUnits] = useState("");
  const [amount, setAmount] = useState("");
  const [totalCost, setTotalCost] = useState("");
  const [createSuccess, setCreateSuccess] = useState(false);

  const clearForm = () => {
    setName("");
    setUnits("");
    setAmount("");
    setTotalCost("");
  };

  const createConsumable = async () => {
    console.log(token);
    const consumableInfo = { name, units, amount, totalCost };
    try {
      await axios.post("/consumable", consumableInfo, {
        headers: { authorization: token },
      });
      clearForm();
      setCreateSuccess(true);
      setTimeout(() => setCreateSuccess(false), 5000);
    } catch (error) {
      console.error(error);
      alert("Не удалось создать запись");
    }
  };

  return isAuth ? (
    <Grid container>
      <Box
        sx={{
          margin: "5px auto",
          padding: "10px",
          textAlign: "center",
          height: "370px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          border: "1px solid #242424",
          borderRadius: "5px",
        }}
      >
        <TextField
          label="Назва матеріалу"
          value={name}
          onChange={(e) => setName(e.currentTarget.value)}
          size="small"
        />

        <TextField
          label="Початкова кількість"
          value={amount}
          onChange={(e) => setAmount(e.currentTarget.value)}
          size="small"
        />

        <FormControl sx={{ paddingTop: "7px" }}>
          <InputLabel id="selectUnits">Одиниці виміру</InputLabel>
          <Select
            labelId="selectUnits"
            value={units}
            onChange={(e) => setUnits(e.target.value)}
            label="Одиниці виміру"
            size="small"
          >
            <MenuItem value={"гр"}>грамми</MenuItem>
            <MenuItem value={"мл"}>мілілітри</MenuItem>
            <MenuItem value={"шт"}>штуки</MenuItem>
          </Select>
        </FormControl>

        <TextField
          label="Загальна вартість, грн"
          value={totalCost}
          onChange={(e) => setTotalCost(e.currentTarget.value)}
          size="small"
        />

        <Divider sx={{ paddingBottom: "8px" }} />

        {createSuccess ? (
          <Alert severity="success">Новий матеріал створено успішно!</Alert>
        ) : (
          <Button
            color={"success"}
            variant="outlined"
            size="large"
            onClick={createConsumable}
            sx={{ margin: "20px auto" }}
            startIcon={<AddIcon />}
          >
            Створити
          </Button>
        )}
      </Box>
    </Grid>
  ) : (
    <Navigate to="/" replace={true} />
  );
};

export default CreateConsumable;
