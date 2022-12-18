import React, { useContext, useState } from "react";
import { AuthContext } from "../App";
import { Navigate } from "react-router-dom";
import {
  Grid,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";

const Records = () => {
  const { isAuth } = useContext(AuthContext);
  return isAuth ? (
    <Grid container component={"section"}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>
              <strong>Початок сеансу</strong>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <strong>Клієнт</strong>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <strong>Процедура</strong>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <strong>Адреса</strong>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <strong>Ціна</strong>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <strong>Тривалість</strong>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <strong>Готово</strong>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <strong>Скасувати</strong>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody></TableBody>
      </Table>
    </Grid>
  ) : (
    <Navigate to="/" replace={true} />
  );
};

export default Records;
