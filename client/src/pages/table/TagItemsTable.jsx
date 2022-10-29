import React from "react";
import Paper from "@mui/material/Paper";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { Button } from "@mui/material";
import { IconButton } from "@mui/material";
import { useNavigate } from "react-router-dom";
import "../profile/profile.css";

import {useTranslation} from "react-i18next";
import "../../tranlations/i18next";

function TagItemsTable({ items }, {tags}) {

  const {t} = useTranslation();

  const navigate = useNavigate();

  const columns = ["#", t("columns.name"), t("columns.tags")];

  const handleItemLink = (item) => {
    navigate(`/collections/${item.collection_id}/items/${item.id}`, { state: { item } });
  }

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            {columns.map((column, index) => (
              <TableCell key={index} align="left">{column}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {
            items.map((item, index) => (
            <TableRow
              key={index}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {index + 1}
              </TableCell>
              <TableCell align="left">{item.name}</TableCell>

              <TableCell align="left">{item.tags.map((tag, i) => (
                
                <Button onClick={() => handleItemLink(item)} size="small" key={i} color="info" variant="outlined" sx={{ mr: 1, mb: 1, borderRadius: 40 }}>
                {tag.name}
                </Button>
              ))}</TableCell>

            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default TagItemsTable;
