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
  IconButton,
} from "@mui/material";
import { Box } from "@mui/system";
import React, { useContext, useEffect, useState } from "react";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../App";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import axios from "../axios.js";
import InputFileUpload from "./UploadButton";
import { styled } from "@mui/material/styles";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { Close } from "@mui/icons-material";
import {
  addressList,
  backendURL,
  durationStep,
  maxDuration,
} from "./serviceConfig";

const token = window.localStorage.getItem("token");

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

const CreateService = () => {
  const { isAuth } = useContext(AuthContext);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");
  const [duration, setDuration] = useState(durationStep);
  const [durationView, setDurationView] = useState("");
  const [price, setPrice] = useState("");
  const [createSuccess, setCreateSuccess] = useState(false);
  const [currentConsumable, setCurrentConsumable] = useState("");
  const [consumables, setConsumables] = useState([]);
  const [currentUnit, setCurrentUnit] = useState("");
  const [currentAmount, setCurrentAmount] = useState("");
  const [consumableList, setConsumableList] = useState([]);
  const [currentName, setCurrentName] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isImage, setIsImage] = useState(false);

  useEffect(() => {
    async function fetchConsumable() {
      const reqConsumable = await axios.get("/consumable");
      setConsumables(reqConsumable.data);
    }
    fetchConsumable();
  }, []);

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

  const createService = async () => {
    const consumable = consumableList.map((item) => {
      let res = {
        consumableId: item.currentConsumable,
        amount: item.currentAmount,
      };
      return res;
    });

    const serviceInfo = {
      name,
      description,
      duration,
      durationView,
      address,
      price,
      consumable,
      imageUrl,
    };
    console.log(serviceInfo);
    try {
      await axios.post("/service", serviceInfo, {
        headers: { authorization: token },
      });
      clearForm();
      setCreateSuccess(true);
      setTimeout(() => {
        setCreateSuccess(false);
        setConsumableList([]);
      }, 5000);
    } catch (error) {
      console.error(error);
      alert("Не удалось создать запись");
    }
  };

  const clearForm = () => {
    setAddress("");
    setDescription("");
    setName("");
    setPrice("");
    setIsImage(false);
    setImageUrl("");
  };

  const cleanConsumableForm = () => {
    setCurrentConsumable("");
    setCurrentName("");
    setCurrentUnit("");
    setCurrentAmount("");
  };

  const addConsumable = () => {
    const clone = consumableList.find((el) => el.currentName === currentName);
    if (currentName && currentAmount && !clone) {
      const consumableItem = {
        currentConsumable,
        currentAmount,
        currentName,
        currentUnit,
      };
      setConsumableList((prev) => [...prev, consumableItem]);
      cleanConsumableForm();
    } else if (clone) {
      alert(clone.currentName + " вже додано до списку");
    } else {
      alert("Заповніть назву та кількість матеріалу");
    }
  };

  const removeConsumableItem = (id) => {
    setConsumableList((prev) =>
      prev.filter((item) => item.currentConsumable !== id)
    );
    console.log(consumableList);
  };

  const handleChangeFile = async (event) => {
    try {
      const formData = new FormData();
      const imageFile = event.target.files[0];
      formData.append("image", imageFile);
      const { data } = await axios.post("/uploads", formData);
      console.log(data);
      setImageUrl(data.url);
      setIsImage(true);
    } catch (error) {
      console.error(error);
      alert("Не удалось загрузить изображение:" + error);
    }
  };

  const deleteFile = async () => {
    await axios.delete("/uploads", {
      data: { imageUrl: "." + imageUrl },
    });
    setIsImage(false);
    setImageUrl("");
  };

  return isAuth ? (
    <Grid container>
      <Box
        sx={{
          margin: "10px auto",
          padding: "25px",
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          gap: "5px",
          border: "1px solid #242424",
          borderRadius: "5px",
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
        <FormControl sx={{ paddingTop: "7px" }}>
          <InputLabel id="selectAddress">Адреса надання</InputLabel>
          <Select
            labelId="selectAddress"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            label="Адреса надання "
            size="small"
          >
            {addressList.map((address) => (
              <MenuItem key={address} value={address}>
                {address}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Box>
          <Typography variant="h5">Тривалість</Typography>
          <Button
            variant="outlined"
            onClick={() =>
              duration < maxDuration
                ? setDuration(duration + durationStep)
                : null
            }
            size="small"
            fontSize={"12px"}
            startIcon={<AddIcon />}
          >
            30 хв
          </Button>
          <Typography variant="h6">{durationView} </Typography>
          <Button
            variant="outlined"
            onClick={() =>
              duration > durationStep
                ? setDuration(duration - durationStep)
                : null
            }
            size="small"
            fontSize={"12px"}
            startIcon={<RemoveIcon />}
          >
            30 хв
          </Button>
          <Typography sx={{ marginTop: "10px" }}>
            Додавання матеріалів
          </Typography>

          <Grid
            container
            sx={{
              justifyContent: "flex-start",
              gap: "10px",
              marginBottom: "15px",
            }}
          >
            {consumables && (
              <Grid item>
                <FormControl variant="standard" sx={{ minWidth: 120 }}>
                  <InputLabel id="select-consumable">Матеріал</InputLabel>
                  <Select
                    labelId="select-consumable"
                    id="select-consumable"
                    value={currentName}
                    onChange={(e) => {
                      setCurrentName(e.target.value);
                      setCurrentConsumable(
                        consumables.find((el) => el.name === e.target.value)._id
                      );
                      setCurrentUnit(
                        consumables.find((el) => el.name === e.target.value)
                          .units
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
              </Grid>
            )}

            <Grid item sx={{ display: "flex", alignItems: "end", gap: "3px" }}>
              <TextField
                label="К-ть"
                variant="standard"
                value={currentAmount}
                onChange={(e) => setCurrentAmount(e.target.value)}
                sx={{ maxWidth: "70px" }}
                size="small"
              />

              <Typography>{currentUnit}</Typography>
            </Grid>
          </Grid>

          <Button
            size="small"
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={addConsumable}
          >
            додати
          </Button>

          <FormControl
            formEncType="multipart/form-data"
            sx={{
              display: "block",
              padding: "2px",
              marginBlock: "10px",
            }}
          >
            {isImage ? (
              <>
                <Alert severity="success">Фото завантажено успішно!</Alert>
                <img
                  src={backendURL + imageUrl}
                  alt="service image"
                  style={{ width: "250px", margin: "0 auto", display: "block" }}
                />
                <IconButton color="error" size="small" onClick={deleteFile}>
                  <Close sx={{ fontSize: "1rem" }} />
                </IconButton>
              </>
            ) : (
              <Button
                component="label"
                variant="contained"
                startIcon={<CloudUploadIcon />}
                type="submit"
                sx={{ fontSize: "1rem" }}
              >
                завантажити фото
                <VisuallyHiddenInput type="file" onChange={handleChangeFile} />
              </Button>
            )}
          </FormControl>

          {consumableList &&
            consumableList.map((el) => {
              return (
                <Box key={el.currentConsumable}>
                  <Divider sx={{ marginY: "10px" }} />
                  <Box
                    sx={{
                      display: "flex",
                      width: "100%",
                      justifyContent: "space-around",
                      fontSize: "14px",
                    }}
                  >
                    <Typography> {el.currentName} </Typography>
                    <Typography>
                      {el.currentAmount} {el.currentUnit}
                    </Typography>
                    <Button
                      variant="outlined"
                      size="small"
                      color="error"
                      onClick={() => removeConsumableItem(el.currentConsumable)}
                      startIcon={<DeleteForeverIcon />}
                      sx={{
                        fontSize: "12px",
                      }}
                    >
                      видалити
                    </Button>
                  </Box>
                </Box>
              );
            })}

          <Divider sx={{ paddingBottom: "8px" }} />
          {createSuccess ? (
            <Alert severity="success">Нову процедуру створено успішно!</Alert>
          ) : (
            <Button
              color={"success"}
              variant="outlined"
              size="large"
              onClick={createService}
              sx={{ margin: "20px auto" }}
            >
              Створити
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
