import {
  Grid,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../App";
const Archive = () => {
  const { isAuth } = useContext(AuthContext);
  return isAuth ? (
    <Grid container component={"section"}>
      <Table>
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

export default Archive;
