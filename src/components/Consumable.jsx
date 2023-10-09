import { Box, Button, Grid } from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../App";
import CreateConsumable from "./CreateConsumable";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";

import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import axios from "../axios.js";

const token = window.localStorage.getItem("token");
const Consumable = () => {
  const { isAuth } = useContext(AuthContext);
  const [consumable, setConsumable] = useState([]);
  const [openForm, setOpenForm] = useState(false);
  const [nomenclature, setNomenclature] = useState("");
  const [consumableCost, setConsumableCost] = useState("");

  useEffect(() => {
    async function fetchConsumable() {
      try {
        const consumableFromServer = await axios.get("/consumable");
        console.log(consumableFromServer.data);
        setConsumable(consumableFromServer.data);
        setConsumableCost(
          consumableFromServer.data
            .reduce((sum, item) => sum + item.totalCost, 0)
            .toFixed(2)
        );
        setNomenclature(consumableFromServer.data.length);
      } catch (error) {
        console.log(error);
      }
    }

    fetchConsumable();
  }, []);

  const deleteConsumable = async (id) => {
    console.log(id);
    try {
      if (window.confirm("Ви впевнені що хочете видалити матеріал назавжди?")) {
        axios.delete(`/consumable/${id}`, {
          headers: { authorization: token },
        });
        setConsumable((prev) =>
          prev.filter((consumable) => consumable._id !== id)
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  return isAuth ? (
    <Grid container component={"section"} direction="column">
      <Grid container sx={{ marginTop: "15px", paddingX: "15px", gap: "10px" }}>
        <Grid item>
          <Typography color={"grey"} fontSize={"14px"}>
            Номенклатура матеріалів
          </Typography>
          <Typography fontSize={"18px"}>{nomenclature} од.</Typography>
        </Grid>
        <Grid item>
          <Typography color={"grey"} fontSize={"14px"}>
            Загальна вартість
          </Typography>
          <Typography fontSize={"16px"}>{consumableCost} грн</Typography>
        </Grid>
      </Grid>
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
      {openForm ? <CreateConsumable /> : null}
      {consumable &&
        consumable.map(({ _id, name, units, amount, totalCost, price }) => {
          return (
            <Accordion key={_id}>
              <AccordionSummary
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    width: "100%",
                    paddingX: "5px",
                  }}
                >
                  <Typography>{name}</Typography>
                  <Typography color={"text.secondary"}>
                    {amount} {units}
                  </Typography>
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                <Grid
                  container
                  justifyContent={"space-around"}
                  alignItems={"center"}
                  gap={"5px"}
                >
                  <Grid item>
                    <Typography color={"grey"} fontSize={"14px"}>
                      Кількість
                    </Typography>
                    <Typography fontSize={"18px"}>{amount}</Typography>

                    <Typography color={"grey"} fontSize={"14px"}>
                      Одиниці виміру
                    </Typography>
                    <Typography fontSize={"16px"}>{units}</Typography>
                  </Grid>
                  <Grid item>
                    <Typography color={"grey"} fontSize={"14px"}>
                      Вартість
                    </Typography>
                    <Typography fontSize={"16px"}>
                      {totalCost.toFixed(2)} грн
                    </Typography>

                    <Typography color={"grey"} fontSize={"14px"}>
                      Ціна за одиницю
                    </Typography>
                    <Typography fontSize={"16px"}>
                      {price.toFixed(2)} грн / {units}
                    </Typography>
                  </Grid>
                  <Box sx={{ textAlign: "end" }}>
                    <Button
                      variant="outlined"
                      size="small"
                      color="error"
                      onClick={() => deleteConsumable(_id)}
                      startIcon={<DeleteForeverIcon />}
                      sx={{
                        fontSize: "16px",
                      }}
                    >
                      видалити
                    </Button>
                  </Box>
                </Grid>
              </AccordionDetails>
            </Accordion>
          );
        })}
    </Grid>
  ) : (
    <Navigate to="/" replace={true} />
  );
};

export default Consumable;
