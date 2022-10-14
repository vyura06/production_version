import React from "react";
import Paper from "@mui/material/Paper";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { IconButton } from "@mui/material";
import { useNavigate } from "react-router-dom";
import "../profile/profile.css";

function CollectionsTable({ columns, collections, onRemove, onEdit, readOnly }) {
  const navigate = useNavigate();

  const handleCollectionLink = (collection) => {
    navigate(`/collections/${collection.id}`, { state: { collection } });
  }

  const getDate = (date) => new Date(date).toLocaleString();

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
          {collections.map((collection, index) => (
            <TableRow
              key={index}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {index + 1}
              </TableCell>
              <TableCell align="left">{collection.name}</TableCell>
              <TableCell align="left">{collection.topic_name}</TableCell>

              { readOnly && <TableCell align="left">{collection.author}</TableCell> }

              <TableCell align="left">{collection.items_count}</TableCell>
              <TableCell align="left">{getDate(collection.created_date)}</TableCell>

              <TableCell align="left">
                <IconButton onClick={() => handleCollectionLink(collection)}>
                  <OpenInNewIcon />
                </IconButton>
              </TableCell>
              { !readOnly && (
                <>
                  <TableCell align="left">
                    <IconButton onClick={() => onEdit(collection.id)}>
                      <EditIcon />
                    </IconButton>
                  </TableCell>
                  <TableCell align="left">
                    <IconButton onClick={() => onRemove(collection.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </>
              ) }
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default CollectionsTable;
