import { Box, Button, Grid } from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../App";
import CreateSupply from "./CreateSupply";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";

import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import axios from "../axios.js";

const token = window.localStorage.getItem("token");
const Supply = () => {
  const { isAuth } = useContext(AuthContext);
  const [supply, setSupply] = useState([]);
  const [openForm, setOpenForm] = useState(false);

  useEffect(() => {
    async function fetchSupply() {
      try {
        const supplyFromServer = await axios.get("/supply");
        console.log(supplyFromServer.data);
        setSupply(supplyFromServer.data);
      } catch (error) {
        console.log(error);
      }
    }

    fetchSupply();
  }, []);

  const deleteSupply = async (id) => {
    console.log(id);
    try {
      if (
        window.confirm("Ви впевнені що хочете видалити надходження назавжди?")
      ) {
        await axios.delete(`/supply/${id}`, {
          headers: { authorization: token },
        });
        setSupply((prev) => prev.filter((supply) => supply._id !== id));
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
        {openForm ? "Приховати" : "Додати"}
      </Button>
      {openForm ? <CreateSupply /> : null}
      {supply.length > 0 &&
        supply.map((item) => {
          return (
            <Accordion key={item._id}>
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
                  <Typography>{item.consumable.name}</Typography>
                  <Typography color={"text.secondary"}>
                    {new Date(item.createdAt).toLocaleDateString()}
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
                    <Typography fontSize={"18px"}>{item.amount}</Typography>

                    <Typography color={"grey"} fontSize={"14px"}>
                      Одиниці виміру
                    </Typography>
                    <Typography fontSize={"16px"}>
                      {item.consumable.units}
                    </Typography>
                  </Grid>
                  <Grid item>
                    <Typography color={"grey"} fontSize={"14px"}>
                      Вартість
                    </Typography>
                    <Typography fontSize={"16px"}>{item.cost} грн</Typography>

                    <Typography color={"grey"} fontSize={"14px"}>
                      Ціна за одиницю
                    </Typography>
                    <Typography fontSize={"16px"}>
                      {(item.cost / item.amount).toFixed(2)} грн /{" "}
                      {item.consumable.units}
                    </Typography>
                  </Grid>
                  <Box sx={{ textAlign: "end" }}>
                    <Button
                      variant="outlined"
                      size="small"
                      color="error"
                      onClick={() => deleteSupply(item._id)}
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

export default Supply;
