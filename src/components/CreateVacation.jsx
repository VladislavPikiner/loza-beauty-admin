import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import ru from "date-fns/locale/ru";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { Button, Grid } from "@mui/material";
import axios from "../axios.js";
import AddIcon from "@mui/icons-material/Add";
const CreateVacation = () => {
  const initialDate = new Date();
  const [fromDate, setFromDate] = useState(
    new Date(initialDate.setDate(initialDate.getDate() + 1))
  );
  const [toDate, setToDate] = useState(
    new Date(initialDate.setDate(initialDate.getDate() + 1))
  );

  const submitHandler = async () => {
    console.log(fromDate < toDate);
    if (fromDate > toDate) {
      return alert(
        "Дата завершення відпустки, може бути тільки після Дати початку. Будь ласка, перевірте введені данні"
      );
    }
    let from = fromDate.toISOString().split("T")[0] + "T00:00";
    let to = toDate.toISOString().split("T")[0] + "T00:00";
    const unavailableSlot = {
      from,
      to,
    };
    console.log(unavailableSlot);
    await axios.post("/vacations", unavailableSlot);
  };

  const dateTimePaperPropsStyles = {
    sx: {
      ".MuiPickersCalendarHeader-label": {
        marginRight: "0",
      },
    },
  };

  return (
    <Grid
      sx={{
        display: "grid",
        gap: "15px",
        maxWidth: "270px",
        alignSelf: "center",
        marginBlock: "25px",
      }}
    >
      <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ru}>
        <DatePicker
          disablePast
          label="Дата начала"
          value={fromDate}
          onChange={(newValue) => {
            setFromDate(newValue);
          }}
          renderInput={(params) => <TextField {...params} />}
          PaperProps={dateTimePaperPropsStyles}
        />
      </LocalizationProvider>
      <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ru}>
        <DatePicker
          disablePast
          label="Дата конца"
          value={toDate}
          onChange={(newValue) => {
            setToDate(newValue);
          }}
          renderInput={(params) => <TextField {...params} />}
        />
      </LocalizationProvider>
      <Button
        startIcon={<AddIcon />}
        onClick={submitHandler}
        variant="outlined"
      >
        Добавить отпуск
      </Button>
    </Grid>
  );
};

export default CreateVacation;
