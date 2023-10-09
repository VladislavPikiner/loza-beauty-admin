import React, { useEffect, useState } from "react";
import { Close } from "@mui/icons-material";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { styled } from "@mui/material/styles";
import { LockOutlined, Mode, Save, Sync } from "@mui/icons-material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import {
  Alert,
  Box,
  Button,
  Divider,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";
import axios from "../axios.js";
import {
  addressList,
  backendURL,
  durationStep,
  maxDuration,
} from "./serviceConfig.js";
import UploadButton from "./UploadButton.jsx";

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

const Service = ({
  service,
  consumablesFromServer,
  availableSwitcher,
  deleteForever,
  updateOnServer,
}) => {
  const [serviceState, setServiceState] = useState({
    name: service.name,
    description: service.description,
    duration: service.duration,
    durationView: service.durationView,
    address: service.address,
    price: service.price,
    imageUrl: service.imageUrl,
  });

  const [isEdit, setIsEdit] = useState(false);
  const [isImage, setIsImage] = useState(false);

  const [currentConsumable, setCurrentConsumable] = useState({
    consumableId: "",
    name: "",
    amount: "",
    units: "",
  });

  const [consumableList, setConsumableList] = useState([]);

  useEffect(() => {
    switch (serviceState.duration / 1000 / 60) {
      case 30:
        setServiceState({ ...serviceState, durationView: "30 хвилин" });
        break;
      case 60:
        setServiceState({ ...serviceState, durationView: "1 година" });
        break;
      case 90:
        setServiceState({
          ...serviceState,
          durationView: "1 година 30 хвилин",
        });
        break;
      case 120:
        setServiceState({ ...serviceState, durationView: "2 години" });
        break;
      case 150:
        setServiceState({
          ...serviceState,
          durationView: "2 години 30 хвилин",
        });
        break;
      case 180:
        setServiceState({ ...serviceState, durationView: "3 години" });
        break;
      case 210:
        setServiceState({
          ...serviceState,
          durationView: "3 години 30 хвилин",
        });
        break;
      case 240:
        setServiceState({ ...serviceState, durationView: "4 години" });
        break;
    }
  }, [serviceState.duration]);

  const updateService = async () => {
    const updatedData = {
      ...serviceState,
      consumable: consumableList,
      id: service._id,
    };
    updateOnServer(updatedData);
    cancelEditService();
  };

  const cleanConsumableForm = () => {
    setCurrentConsumable({
      id: "",
      name: "",
      amount: "",
      units: "",
    });
  };

  const editService = (service) => {
    setIsEdit(true);
    service.consumable.map((consumable) => {
      const consumableItem = {
        consumableId: consumable.consumableId._id,
        amount: consumable.amount,
        name: consumable.consumableId.name,
        units: consumable.consumableId.units,
      };
      setConsumableList((prev) => [...prev, consumableItem]);
    });
  };

  const cancelEditService = () => {
    setIsEdit(false);
    setConsumableList([]);

    isImage && deleteWrongImage();

    setIsImage(false);
  };

  const deleteWrongImage = async () => {
    try {
      setServiceState({ ...serviceState, imageUrl: service.imageUrl });
      await axios.delete("/uploads", {
        data: { imageUrl: "." + serviceState.imageUrl },
      });
    } catch (error) {
      console.error(error);
    }
  };

  const addConsumable = () => {
    console.log(typeof currentConsumable.units);
    const clone = consumableList.find(
      (el) => el.name === currentConsumable.name
    );
    if (currentConsumable.name && currentConsumable.amount && !clone) {
      const consumableItem = {
        consumableId: currentConsumable.consumableId,
        amount: currentConsumable.amount,
        name: currentConsumable.name,
        units: currentConsumable.units,
      };
      setConsumableList((prev) => [...prev, consumableItem]);
      cleanConsumableForm();
    } else if (clone) {
      alert(clone.name + " вже додано до списку");
    } else {
      alert("Заповніть назву та кількість матеріалу");
    }
  };

  const removeConsumableItem = (id) => {
    setConsumableList((prev) =>
      prev.filter((item) => item.consumableId !== id)
    );
    console.log(consumableList);
  };

  const handleChangeFile = async (event) => {
    try {
      const formData = new FormData();
      const imageFile = event.target.files[0];
      formData.append("image", imageFile);
      const { data } = await axios.post("/uploads", formData);

      setServiceState({ ...serviceState, imageUrl: data.url });
      setIsImage(true);
    } catch (error) {
      console.error(error);
      alert("Не удалось загрузить изображение:" + error);
    }
  };

  const numberValidation = (e) => {
    const regex = /^[0-9\b]+$/;

    if (e.target.value === "" || regex.test(e.target.value)) {
      setCurrentConsumable({
        ...currentConsumable,
        amount: Number(e.target.value),
      });
    }
  };

  return (
    <Accordion>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel1a-content"
        id="panel1a-header"
      >
        {isEdit ? (
          <TextField
            label="Назва процедури"
            defaultValue={serviceState.name}
            onChange={(e) =>
              setServiceState({
                ...serviceState,
                name: e.target.value,
              })
            }
          />
        ) : (
          <Typography>{service.name}</Typography>
        )}
      </AccordionSummary>
      <AccordionDetails>
        <Grid
          container
          sx={{
            justifyContent: "space-between",
            alignItems: "self-start",
            justifyItems: "center",
            gap: "15px",
          }}
        >
          <Grid item>
            {isEdit ? (
              <TextField
                label="Опис процедури"
                defaultValue={serviceState.description}
                onChange={(e) =>
                  setServiceState({
                    ...serviceState,
                    description: e.target.value,
                  })
                }
                multiline
              />
            ) : (
              <>
                <Typography color={"grey"} fontSize={"14px"}>
                  Опис процедури
                </Typography>
                <Typography sx={{ textAlign: "justify", fontSize: "18px" }}>
                  {serviceState.description}
                </Typography>
              </>
            )}
          </Grid>

          <Grid item>
            {isEdit ? (
              <>
                <Typography color={"grey"} fontSize={"1rem"}>
                  Тривалість
                </Typography>

                <Typography variant="h6">
                  {serviceState.durationView}{" "}
                </Typography>
                <Button
                  variant="outlined"
                  onClick={() =>
                    serviceState.duration < maxDuration
                      ? setServiceState({
                          ...serviceState,
                          duration: serviceState.duration + durationStep,
                        })
                      : null
                  }
                  size="small"
                  sx={{ fontSize: "1rem", marginRight: "15px" }}
                  startIcon={<AddIcon />}
                >
                  30 хв
                </Button>
                <Button
                  variant="outlined"
                  onClick={() =>
                    serviceState.duration > durationStep
                      ? setServiceState({
                          ...serviceState,
                          duration: serviceState.duration - durationStep,
                        })
                      : null
                  }
                  size="small"
                  fontSize={"12px"}
                  startIcon={<RemoveIcon />}
                >
                  30 хв
                </Button>
              </>
            ) : (
              <>
                <Typography color={"grey"} fontSize={"14px"}>
                  Тривалість
                </Typography>
                <Typography fontSize={"16px"}>
                  {serviceState.durationView}
                </Typography>
              </>
            )}
          </Grid>

          <Grid item>
            {isEdit ? (
              <FormControl sx={{ paddingTop: "7px", width: "250px" }}>
                <InputLabel id="selectAddress">Адреса надання</InputLabel>
                <Select
                  labelId="selectAddress"
                  value={serviceState.address}
                  onChange={(e) =>
                    setServiceState({
                      ...serviceState,
                      address: e.target.value,
                    })
                  }
                  label="Адреса надання "
                  size="small"
                >
                  {addressList.map((addressPoint) => (
                    <MenuItem key={addressPoint} value={addressPoint}>
                      {addressPoint}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            ) : (
              <>
                <Typography color={"grey"} fontSize={"14px"}>
                  Адреса салону
                </Typography>
                <Typography fontSize={"16px"}>
                  {serviceState.address}
                </Typography>
              </>
            )}
          </Grid>
          {isEdit ? (
            <>
              <Grid item sx={{ minWidth: 120 }}>
                <Typography color={"grey"}>Матеріали</Typography>
                {consumableList &&
                  consumableList.map((el) => {
                    return (
                      <Box key={el.consumableId}>
                        <Divider sx={{ marginY: "10px" }} />
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-around",
                            fontSize: "14px",
                          }}
                        >
                          <Typography>
                            {" "}
                            {el.name} {el.amount} {el.units}
                          </Typography>
                          <IconButton
                            size="small"
                            color="primary"
                            onClick={() =>
                              removeConsumableItem(el.consumableId)
                            }
                            sx={{ marginTop: "-3px", marginLeft: "5px" }}
                          >
                            <Close />
                          </IconButton>
                        </Box>
                      </Box>
                    );
                  })}
                <Box
                  sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    alignItems: "end",
                    justifyContent: "space-between",
                    width: "300px",
                  }}
                >
                  <FormControl variant="standard" sx={{ minWidth: 120 }}>
                    <InputLabel id="select-consumable">Матеріал</InputLabel>
                    <Select
                      labelId="select-consumable"
                      id="select-consumable"
                      value={currentConsumable.name}
                      onChange={(e) => {
                        const consumableData = consumablesFromServer.find(
                          (el) => el.name === e.target.value
                        );

                        setCurrentConsumable({
                          ...currentConsumable,
                          name: e.target.value,
                          consumableId: consumableData._id,
                          units: consumableData.units,
                        });
                      }}
                      label="Матеріал"
                      size="small"
                    >
                      {consumablesFromServer.map((item) => {
                        return (
                          <MenuItem key={item._id} value={item.name}>
                            {item.name}
                          </MenuItem>
                        );
                      })}
                    </Select>
                  </FormControl>

                  <TextField
                    label="К-ть"
                    variant="standard"
                    inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
                    value={currentConsumable.amount}
                    onChange={(e) => numberValidation(e)}
                    sx={{ maxWidth: "70px" }}
                    size="small"
                  />

                  <Typography>{currentConsumable.units}</Typography>
                  <Button
                    size="small"
                    variant="outlined"
                    startIcon={<AddIcon />}
                    onClick={addConsumable}
                    sx={{ margin: "10px auto" }}
                  >
                    додати
                  </Button>
                </Box>
              </Grid>
            </>
          ) : (
            <Grid item>
              <Typography color={"grey"} fontSize={"14px"}>
                Матеріaли
              </Typography>
              {service.consumable.map((item) => {
                return (
                  <Typography key={item._id} fontSize={"12px"}>
                    {item.consumableId
                      ? item.consumableId.name
                      : "матеріал видалено"}{" "}
                    {item.consumableId && item.amount}{" "}
                    {item.consumableId && item.consumableId.units}
                  </Typography>
                );
              })}
            </Grid>
          )}
          <Grid item>
            {isEdit ? (
              <TextField
                label="Ціна"
                onChange={(e) =>
                  setServiceState({
                    ...serviceState,
                    price: Number(e.target.value),
                  })
                }
                defaultValue={serviceState.price}
              />
            ) : (
              <>
                <Typography color={"grey"} fontSize={"14px"}>
                  Ціна
                </Typography>
                <Typography fontSize={"16px"}>
                  {serviceState.price} грн
                </Typography>
              </>
            )}
          </Grid>
          {isEdit && (
            <Grid item>
              <img src={backendURL + serviceState.imageUrl} width={"250px"} />
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
                    <VisuallyHiddenInput
                      type="file"
                      onChange={handleChangeFile}
                    />
                  </Button>
                )}
              </FormControl>
            </Grid>
          )}
        </Grid>
        <Box sx={{ textAlign: "center" }}>
          {service.available && (
            <Button
              variant="outlined"
              size="small"
              color="success"
              onClick={() => (isEdit ? updateService() : editService(service))}
              startIcon={isEdit ? <Save /> : <Mode />}
              sx={{
                fontSize: "12px",
                textAlign: "center",
                marginTop: "15px",
                marginRight: "10px",
              }}
            >
              {isEdit ? "зберегти" : "редагувати"}
            </Button>
          )}
          {isEdit && (
            <Button
              variant="outlined"
              size="small"
              color="error"
              onClick={cancelEditService}
              startIcon={<Close />}
              sx={{
                fontSize: "12px",
                textAlign: "center",
                marginTop: "15px",
                marginRight: "10px",
              }}
            >
              скасувати
            </Button>
          )}
          {service.available ? (
            <Button
              variant="outlined"
              size="small"
              color="error"
              onClick={() => availableSwitcher(service._id)}
              startIcon={<LockOutlined />}
              sx={{
                fontSize: "12px",
                textAlign: "center",
                marginTop: "15px",
                marginRight: "10px",
              }}
            >
              заблокувати
            </Button>
          ) : (
            <Button
              variant="outlined"
              size="small"
              color="success"
              onClick={() => availableSwitcher(service._id)}
              startIcon={<Sync />}
              sx={{
                fontSize: "12px",
                textAlign: "center",
                marginTop: "15px",
                marginRight: "10px",
              }}
            >
              відновити
            </Button>
          )}
          <Button
            variant="outlined"
            size="small"
            color="error"
            onClick={() => deleteForever(service._id)}
            startIcon={<DeleteForeverIcon />}
            sx={{
              fontSize: "12px",
              textAlign: "center",
              marginTop: "15px",
            }}
          >
            видалити
          </Button>
        </Box>
      </AccordionDetails>
    </Accordion>
  );
};

export default Service;
