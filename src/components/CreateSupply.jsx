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

const CreateSupply = () => {
  const { isAuth } = useContext(AuthContext);
  const [name, setName] = useState("");
  const [consumable, setConsumable] = useState("");
  const [amount, setAmount] = useState("");
  const [totalCost, setTotalCost] = useState("");
  const [consumables, setConsumables] = useState([]);
  const [createSuccess, setCreateSuccess] = useState(false);

  useEffect(() => {
    async function fetchConsumable() {
      const reqConsumable = await axios.get("/consumable");
      setConsumables(reqConsumable.data);
    }
    fetchConsumable();
  }, []);

  const clearForm = () => {
    setConsumable("");
    setAmount("");
    setTotalCost("");
  };

  const createSupply = async () => {
    console.log(token);
    const supplyInfo = { consumable, amount, totalCost };
    try {
      await axios.post("/supply", supplyInfo, {
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
        <FormControl sx={{ paddingTop: "7px" }}>
          <InputLabel id="selectUnits">Матеріал</InputLabel>
          <Select
            labelId="selectUnits"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setConsumable(
                consumables.find((el) => el.name === e.target.value)._id
              );
            }}
            label="Матеріал"
            size="small"
          >
            {consumables.map((item) => {
              return (
                <MenuItem key={item._id} value={item.name}>
                  {item.name}
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>

        <TextField
          label="Кількість"
          value={amount}
          onChange={(e) => setAmount(e.currentTarget.value)}
          size="small"
        />

        <TextField
          label="Вартість, грн"
          value={totalCost}
          onChange={(e) => setTotalCost(e.currentTarget.value)}
          size="small"
        />

        <Divider sx={{ paddingBottom: "8px" }} />

        {createSuccess ? (
          <Alert severity="success">Надходження створено успішно!</Alert>
        ) : (
          <Button
            color={"success"}
            variant="outlined"
            size="large"
            onClick={createSupply}
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

export default CreateSupply;
