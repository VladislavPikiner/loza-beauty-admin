import {
  Box,
  Button,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../App";
import CreateService from "./CreateService";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";

import axios from "../axios.js";
import Service from "./Service";

const token = window.localStorage.getItem("token");
const Services = () => {
  const { isAuth } = useContext(AuthContext);
  const [services, setServices] = useState([]);
  const [consumables, setConsumables] = useState([]);
  const [openForm, setOpenForm] = useState(false);

  useEffect(() => {
    async function fetchServices() {
      try {
        const servicesFromServer = await axios.get("/service");
        setServices(servicesFromServer.data);
      } catch (error) {
        console.log(error);
      }
    }

    fetchServices();
  }, []);

  useEffect(() => {
    async function fetchConsumable() {
      try {
        const reqConsumable = await axios.get("/consumable");
        setConsumables(reqConsumable.data);
      } catch (error) {
        console.log(error);
      }
    }
    fetchConsumable();
  }, []);

  const changeAvailable = async (id) => {
    try {
      if (
        window.confirm("Ви впевнені що хочете змінити доступність процедури?")
      ) {
        const updServices = await axios.put(
          `/service/available/${id}`,
          {},
          {
            headers: { authorization: token },
          }
        );

        if (updServices.status === 200) {
          setServices((prevServices) =>
            prevServices.map((service) =>
              service._id === id
                ? {
                    ...service,
                    available: updServices.data.available,
                    name: updServices.data.name,
                  }
                : service
            )
          );
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const onUpdate = async (updatedData) => {
    try {
      if (window.confirm("Ви впевнені що хочете зберегти зміни?")) {
        const updatedServiceFromServer = await axios.patch(
          `/service/${updatedData.id}`,
          { updatedData },
          {
            headers: { authorization: token },
          }
        );
        if (updatedServiceFromServer.status === 200) {
          setServices((prev) =>
            prev.map((service) =>
              service._id === updatedServiceFromServer.data._id
                ? updatedServiceFromServer.data
                : service
            )
          );
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const deleteForever = async (id) => {
    if (window.confirm("Ви впевнені що хочете видалити процедуру назавжди?")) {
      const deletedService = await axios.delete(`/service/${id}`, {
        headers: { authorization: token },
      });

      if (deletedService.status === 200) {
        setServices((prevServices) =>
          prevServices.filter((service) => service._id !== id)
        );
      }
    }
  };

  return isAuth ? (
    <Grid container component={"section"} direction="column">
      <Button
        variant={openForm ? "outlined" : "contained"}
        color={openForm ? "error" : "primary"}
        onClick={() => setOpenForm(!openForm)}
        startIcon={
          openForm ? <RemoveCircleOutlineIcon /> : <AddCircleOutlineIcon />
        }
        size="large"
        sx={{ margin: "15px auto" }}
      >
        {openForm ? "Приховати" : "Створити"}
      </Button>
      {openForm ? <CreateService /> : null}
      {services &&
        services.map((service) => {
          return (
            <Service
              key={service._id}
              service={service}
              availableSwitcher={changeAvailable}
              deleteForever={deleteForever}
              consumablesFromServer={consumables}
              updateOnServer={onUpdate}
            />
          );
        })}
    </Grid>
  ) : (
    <Navigate to="/" replace={true} />
  );
};

export default Services;
