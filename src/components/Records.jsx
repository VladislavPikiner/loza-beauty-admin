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
              <Accordion>
                <AccordionSummary>
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
                    {
                      new Date(record.startTime)
                        .toLocaleDateString()
                        .split("T")[0]
                    }
                    <br />
                    {record.startTime.split("T")[1].slice(0, -8)}-
                    {record.endTime.split("T")[1].slice(0, -8)}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Grid
                    sx={{
                      display: "flex",
                      justifyContent: "flex-start",
                      gap: "25px",
                    }}
                  >
                    <Box>
                      <Typography color={"grey"} fontSize={"14px"}>
                        Клієнт
                      </Typography>
                      <Typography>+{record.clientPhone}</Typography>
                    </Box>
                    <Box>
                      <Typography color={"grey"} fontSize={"14px"}>
                        Ціна
                      </Typography>
                      <Typography>{record.service.price} грн</Typography>
                    </Box>
                  </Grid>
                  <Grid
                    sx={{
                      display: "flex",
                      justifyContent: "flex-start",
                      gap: "15px",
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
