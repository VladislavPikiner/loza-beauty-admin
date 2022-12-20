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
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import axios from "../axios.js";

const token = window.localStorage.getItem("token");
const Services = () => {
  const { isAuth } = useContext(AuthContext);
  const [services, setServices] = useState([]);
  const [openForm, setOpenForm] = useState(false);

  useEffect(() => {
    async function fetchServices() {
      try {
        const servicesFromServer = await axios.get("/service");
        console.log(servicesFromServer.data);
        setServices(servicesFromServer.data);
      } catch (error) {
        console.log(error);
      }
    }

    fetchServices();
  }, []);

  const deleteService = async (id) => {
    console.log(id);
    try {
      if (
        window.confirm("Ви впевнені що хочете видалити процедуру назавжди?")
      ) {
        axios.delete(`/service/${id}`, {
          headers: { authorization: token },
        });
        setServices((prev) => prev.filter((service) => service._id !== id));
      }
    } catch (error) {
      console.log(error);
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
        services.map(
          ({
            _id,
            name,
            description,
            duration,
            durationView,
            address,
            price,
          }) => {
            return (
              <Accordion key={_id}>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1a-content"
                  id="panel1a-header"
                >
                  <Typography>{name}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography>{description}</Typography>
                  <Typography>{durationView}</Typography>
                  <Typography>{address}</Typography>
                  <Typography>{price} гривен</Typography>
                  <Button
                    variant="outlined"
                    size="small"
                    color="error"
                    onClick={() => deleteService(_id)}
                  >
                    <DeleteForeverIcon />
                  </Button>
                </AccordionDetails>
              </Accordion>
            );
          }
        )}
    </Grid>
  ) : (
    <Navigate to="/" replace={true} />
  );
};

export default Services;
