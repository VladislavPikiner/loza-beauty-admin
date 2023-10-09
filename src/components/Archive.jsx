import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import axios from "../axios.js";
import React, { useContext, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../App";
const Archive = () => {
  const { isAuth } = useContext(AuthContext);
  const [archiveRecords, setArchiveRecords] = useState([]);

  useEffect(() => {
    async function fetchRecords() {
      const res = await axios.get("/archiveRecords");
      setArchiveRecords(res.data.reverse());
    }
    fetchRecords();
  }, []);
  return isAuth ? (
    <Grid
      container
      component={"section"}
      sx={{ display: "flex", flexDirection: "column", gap: "5px" }}
    >
      {archiveRecords &&
        archiveRecords.map((record) => {
          console.log(record);
          return (
            <Box key={record._id}>
              <Accordion>
                <AccordionSummary>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
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
                  <Grid container gap={"15px"}>
                    <Grid item>
                      <Typography color={"grey"} fontSize={"14px"}>
                        Клієнт
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

export default Archive;
