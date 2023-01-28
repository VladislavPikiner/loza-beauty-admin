import { Box, Button, Divider, Grid, Paper, Typography } from "@mui/material";
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
            <Grid
              key={i}
              sx={{
                display: "flex",
                justifyContent: "space-around",
                gap: "3px",
                alignItems: "center",
                marginBottom: "10px",
                paddingX: "5px",
              }}
              container
            >
              <Grid item>
                <Box sx={{ verticalAlign: "middle" }}>
                  <Typography
                    sx={{
                      fontSize: "16px",
                    }}
                  >
                    {i + 1}
                  </Typography>
                </Box>
              </Grid>

              <Grid item>
                <Typography color={"grey"} fontSize={"14px"}>
                  Початок:
                </Typography>
                <Typography>
                  {new Date(vacation.from).toLocaleDateString()}
                </Typography>
              </Grid>

              <Grid item>
                <Typography color={"grey"} fontSize={"14px"}>
                  Завершення:
                </Typography>
                <Typography>
                  {new Date(vacation.to).toLocaleDateString()}
                </Typography>
              </Grid>

              <Grid item>
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
              </Grid>
            </Grid>
          );
        })}
      <Divider />
    </Grid>
  ) : (
    <Navigate to="/" replace={true} />
  );
};

export default Vacation;
