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

const CreateService = () => {
  const durationStep = 1800000;
  const maxDuration = 14400000;
  const { isAuth } = useContext(AuthContext);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");
  const [duration, setDuration] = useState(durationStep);
  const [price, setPrice] = useState("");
  const [durationView, setDurationView] = useState("");
  const [createSuccess, setCreateSuccess] = useState(false);

  useEffect(() => {
    switch (duration / 1000 / 60) {
      case 30:
        setDurationView("30 хвилин");
        break;
      case 60:
        setDurationView("1 година");
        break;
      case 90:
        setDurationView("1 година 30 хвилин");
        break;
      case 120:
        setDurationView("2 години");
        break;
      case 150:
        setDurationView("2 години 30 хвилин");
        break;
      case 180:
        setDurationView("3 години");
        break;
      case 210:
        setDurationView("3 години 30 хвилин");
        break;
      case 240:
        setDurationView("4 години");
        break;
    }
  }, [duration]);

  const clearForm = () => {
    setAddress("");
    setDescription("");
    setName("");
    setPrice("");
  };

  const createService = async () => {
    console.log(token);
    const serviceInfo = {
      name,
      description,
      duration,
      durationView,
      address,
      price,
    };
    console.log(serviceInfo);
    try {
      await axios.post("/service", serviceInfo, {
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
    <Grid container sx={{ margin: "10px" }}>
      <Box
        sx={{
          margin: "5px auto",
          padding: "5px",
          textAlign: "center",
          height: "600px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          border: "1px solid #242424",
          borderRadius: "5px",
          boxShadow: "0 1px 3px rgba(0,0,0,.6)",
        }}
      >
        <TextField
          label="Назва процедури "
          value={name}
          onChange={(e) => setName(e.currentTarget.value)}
          size="small"
        />
        <TextField
          label="Опис процедури "
          value={description}
          onChange={(e) => setDescription(e.currentTarget.value)}
          multiline
          rows={3}
        />
        <TextField
          label="Вартість, грн "
          value={price}
          onChange={(e) => setPrice(e.currentTarget.value)}
          size="small"
        />
        <FormControl>
          <InputLabel id="selectAddress">Адреса надання</InputLabel>
          <Select
            labelId="selectAddress"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            label="Адреса надання "
            size="small"
          >
            <MenuItem value={"taromskoe"}>taromskoe</MenuItem>
            <MenuItem value={"centr"}>centr</MenuItem>
          </Select>
        </FormControl>
        <Box>
          <Typography variant="h5">Тривалість</Typography>
          <Button
            variant="contained"
            onClick={() =>
              duration < maxDuration
                ? setDuration(duration + durationStep)
                : null
            }
            size="small"
            startIcon={<AddIcon />}
          >
            30 хв
          </Button>
          <Typography variant="h6">{durationView} </Typography>
          <Button
            variant="contained"
            onClick={() =>
              duration > durationStep
                ? setDuration(duration - durationStep)
                : null
            }
            size="small"
            startIcon={<RemoveIcon />}
          >
            30 хв
          </Button>
          <Divider sx={{ paddingBottom: "8px" }} />
          {createSuccess ? (
            <Alert severity="success">Нову процедуру створено успішно!</Alert>
          ) : (
            <Button
              variant="contained"
              size="large"
              onClick={createService}
              sx={{ margin: "20px auto" }}
            >
              ✨ Створити
            </Button>
          )}
        </Box>
      </Box>
    </Grid>
  ) : (
    <Navigate to="/" replace={true} />
  );
};

export default CreateService;
