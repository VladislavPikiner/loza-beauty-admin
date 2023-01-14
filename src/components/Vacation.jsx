import { Box, Button, Grid, Paper, Typography } from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { AuthContext } from "../App";
import { Navigate } from "react-router-dom";
import axios from "../axios.js";
import CreateVacation from "./CreateVacation";

const token = window.localStorage.getItem("token");

const Vacation = () => {
  const { isAuth } = useContext(AuthContext);
  const [vacations, setVacations] = useState([]);
  const [openForm, setOpenForm] = useState(false);

  useEffect(() => {
    async function fetchVacations() {
      try {
        const vacationsFromServer = await axios.get("/vacations");
        setVacations(vacationsFromServer.data);
      } catch (error) {
        console.log(error);
      }
    }

    fetchVacations();
  }, []);

  const deleteVacation = async (id) => {
    try {
      if (
        window.confirm("Ви впевнені що хочете видалити відпустку назавжди?")
      ) {
        await axios.delete(`/vacations/${id}`);
        setVacations((prev) => prev.filter((vacation) => vacation._id !== id));
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
      {openForm ? <CreateVacation /> : null}
      {vacations &&
        vacations.map((vacation, i) => {
          return (
            <Grid key={i} sx={{ display: "flex", gap: "15px" }}>
              <Typography>{i + 1}</Typography>
              <Box>
                <Typography>
                  Початок: {new Date(vacation.from).toLocaleDateString()}
                </Typography>
                <Typography>
                  Завершення: {new Date(vacation.to).toLocaleDateString()}
                </Typography>
              </Box>
              <Box>
                <Button
                  variant="outlined"
                  color="error"
                  size="small"
                  onClick={() => deleteVacation(vacation._id)}
                  startIcon={<DeleteForeverIcon />}
                  sx={{ fontSize: "12px" }}
                >
                  Видалити
                </Button>
              </Box>
            </Grid>
          );
        })}
    </Grid>
  ) : (
    <Navigate to="/" replace={true} />
  );
};

export default Vacation;
