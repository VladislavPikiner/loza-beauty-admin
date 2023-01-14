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
                  <Typography sx={{ marginTop: "10px" }}>
                    {record.service.name}
                  </Typography>
                  <Typography color={"grey"} sx={{ marginLeft: "40px" }}>
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
                    sx={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Box>
                      <Typography>Клієнт</Typography>
                      <Typography>+{record.clientPhone}</Typography>
                    </Box>
                    <Box>
                      <Typography>Ціна</Typography>
                      <Typography>{record.service.price}</Typography>
                    </Box>
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
