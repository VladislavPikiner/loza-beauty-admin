import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../App";
import { Navigate } from "react-router-dom";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Grid,
  Typography,
} from "@mui/material";
import axios from "../axios.js";

const Records = () => {
  const { isAuth } = useContext(AuthContext);
  const [records, setRecords] = useState([]);
  useEffect(() => {
    async function fetchRecords() {
      const res = await axios.get("/record");
      setRecords(res.data.reverse());
    }
    fetchRecords();
  }, []);

  const deleteRecord = async (id) => {
    try {
      if (window.confirm("Ви впевнені що хочете видалити запис назавжди?")) {
        await axios.delete(`/record/${id}`);
        setRecords((prev) => prev.filter((record) => record._id !== id));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const updateRecord = async (id) => {
    try {
      if (window.confirm("Замовлення виконано?")) {
        await axios.patch(`/record/${id}`);
        setRecords((prev) => prev.filter((record) => record._id !== id));
      }
    } catch (error) {
      console.log(error);
    }
  };
  return isAuth ? (
    <Grid
      container
      component={"section"}
      sx={{ display: "flex", flexDirection: "column", gap: "5px" }}
    >
      {records &&
        records.map((record) => {
          return (
            <Box key={record._id}>
              <Typography></Typography>
              <Accordion>
                <AccordionSummary>
                  <Box
                    sx={{
                      width: "90%",
                      display: "flex",
                      justifyContent: "space-around",
                    }}
                  >
                    <Typography sx={{ marginTop: "10px" }}>
                      {record.service.name}
                    </Typography>
                    <Typography
                      color={"grey"}
                      sx={{
                        marginLeft: "30px",
                        paddingTop: "12px",
                        textAlign: "center",
                      }}
                    >
                      {record.startDate}
                      <br />
                      {record.startTime}-{record.endTime}
                    </Typography>
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  <Grid
                    container
                    sx={{
                      justifyContent: "space-between",
                      gap: "15px",
                      width: "90%",
                      margin: "0 auto",
                    }}
                  >
                    <Grid item>
                      <Typography color={"grey"} fontSize={"14px"}>
                        Клієнт
                      </Typography>
                      <Typography>{record.clientName}</Typography>
                    </Grid>
                    <Grid item>
                      <Typography color={"grey"} fontSize={"14px"}>
                        Контакт
                      </Typography>
                      <Typography>+{record.clientPhone}</Typography>
                    </Grid>
                    <Grid item>
                      <Typography color={"grey"} fontSize={"14px"}>
                        Ціна
                      </Typography>
                      <Typography>{record.service.price} грн</Typography>
                    </Grid>
                    <Grid item>
                      <Typography color={"grey"} fontSize={"14px"}>
                        Комментар
                      </Typography>
                      <Typography>{record.comment}</Typography>
                    </Grid>
                  </Grid>
                  <Grid
                    sx={{
                      display: "flex",
                      justifyContent: "flex-start",
                      gap: "25px",
                      marginTop: "20px",
                    }}
                  >
                    <Button
                      color="success"
                      variant="outlined"
                      size="small"
                      startIcon={<AssignmentTurnedInIcon />}
                      onClick={() => updateRecord(record._id)}
                      sx={{ fontSize: "14px" }}
                    >
                      виконано
                    </Button>
                    <Button
                      color="error"
                      variant="outlined"
                      size="small"
                      startIcon={<DeleteForeverIcon />}
                      onClick={() => deleteRecord(record._id)}
                      sx={{ fontSize: "14px" }}
                    >
                      скасувати
                    </Button>
                  </Grid>
                </AccordionDetails>
              </Accordion>
            </Box>
          );
        })}
    </Grid>
  ) : (
    <Navigate to="/" replace={true} />
  );
};

export default Records;
