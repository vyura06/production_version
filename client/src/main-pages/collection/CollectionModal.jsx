import React, { useEffect, useRef, useState } from "react";
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from "@mui/material/Button";
import Autocomplete from "@mui/material/Autocomplete";
import FormControlLabel from "@mui/material/FormControlLabel";
import { Checkbox } from "@mui/material";
import "./collection.css";
import tagsService from "../../shared/api/tags.service";

function CollectionModal(props) {
  const {
    optionalFields,
    openModal,
    closeModal,
    editItem,
    onAction
  } = props

  const editItemCopy = JSON.parse(JSON.stringify(editItem));

  const [name, setName] = useState(editItemCopy?.name || "");
  const [tags, setTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState(editItemCopy?.tags || [tags[0] || { name: "Interesting" }]);
  const [disabledForm, setDisabledForm] = useState(false);
  const [fields, setFields] = useState(editItemCopy?.optionalFields || [...optionalFields].map(field => {
    if (field.type_name === "Date") {
      const date = new Date();
      const year = date.getFullYear();
      let month = date.getMonth() + 1;
      let day = date.getDate();

      day = day < 10 ? "0" + day : day;
      month = month < 10 ? "0" + month : month;

      field.value = `${year}-${month}-${day}`
    }
    else if (field.type_name === "Checkbox")
      field.value = false;
    else field.value = "";

    return field;
  }));
  const submitButton = useRef(null);

  useEffect(() => {
    tagsService
      .getTags()
      .then(res => {
        setTags(res.data.tags);
        if (tags.length)
          setSelectedTags([tags[0]]);
      })
      .catch(err => console.log(err));
  }, []);

  const onSubmit = async (event) => {
    event.preventDefault();

    if (selectedTags.length === 0)
      return;

    setDisabledForm(true);

    const item = Object.assign(editItemCopy || {}, {
      name,
      tags: selectedTags,
      optionalFields: fields,
    });

    await onAction(item);
    setDisabledForm(false);
  }

  const handleSubmitButton = () => {
    if (document.createEvent) {
      var event = document.createEvent("MouseEvents");
      event.initMouseEvent("click", true, true, window,
        0, 0, 0, 0, 0,
        false, false, false, false,
        0, null);
      submitButton.current.dispatchEvent(event);
    }
    else if (submitButton.current.fireEvent) {
      submitButton.current.fireEvent("onclick");
    }
  }

  const handleChangeField = (newValue, index) => {
    setFields(fields.map(
      (field, i) => {
        if (i === index) {
          return Object.assign({}, field, { value: newValue.toString().trim() })
        } else {
          return field;
        }
      }
    ));
  }

  const handleSelectTags = (selected) => {
    const tags = selected.map(tag => {
      if (typeof(tag) === "string")
        return { name: tag };
      else return tag;
    });
    setSelectedTags(tags);
  }

  const handleChangeEvent = (event, type_name, index) => {
    if (type_name === "Date")
      handleChangeField(event.target.value, index);
  }

  const handleInputEvent = (event, type_name, index) => {
    if (type_name !== "Date")
      handleChangeField(event.target.value.toString(), index);
  }

  return (
    <Dialog open={openModal} onClose={(event) => closeModal(event)}>
      {editItem ? (
        <DialogTitle>Edit item</DialogTitle>
      ) : (
        <DialogTitle>New item</DialogTitle>
      )}
      <DialogContent className="item__modal">
        <form onSubmit={onSubmit}>
          <div className="item__info">
            <TextField
              autoFocus
              margin="dense"
              label="Item name"
              type="text"
              fullWidth
              size="small"
              variant="outlined"
              required
              disabled={disabledForm}
              value={name}
              onInput={event => setName(event.target.value)}
            />
            <Autocomplete
              multiple
              size="small"
              options={tags}
              value={selectedTags}
              onChange={(event, selected) => handleSelectTags(selected)}
              getOptionLabel={(option) => option.name}
              freeSolo
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Tags"
                  placeholder="Interesting"
                />
              )}
            />

            {
              fields.map((field, index) =>
                field.type_name === "Checkbox" ? (
                  <FormControlLabel
                    key={index}
                    disabled={disabledForm}
                    control={<Checkbox
                      checked={field.value === "true"}
                      onClick={(event) => handleChangeField(event.target.checked.toString(), index)}
                    />}
                    label={field.name}
                  />
                ) : (
                  <TextField
                    key={index}
                    label={field.name}
                    type={field.type_name === "Multiline text" ? "text" : field.type_name}
                    multiline={field.type_name === "Multiline text"}
                    variant="outlined"
                    size="small"
                    margin="dense"
                    required
                    fullWidth
                    disabled={disabledForm}
                    value={field.value}
                    onChange={(event) => handleChangeEvent(event, field.type_name, index)}
                    onInput={(event) => handleInputEvent(event, field.type_name, index)}
                    rows={4}
                  />
                )
              )
            }
          </div>

          <Button
            disabled={disabledForm}
            ref={submitButton}
            type="submit"
            style={{ position: "fixed", left: -10000 }}
          />
        </form>
    </DialogContent>
      <DialogActions>
        <Button onClick={(event) => closeModal(event)} disabled={disabledForm}>Cancel</Button>
        <Button onClick={handleSubmitButton} disabled={disabledForm}>
          {editItem ? "Edit" : "Create"}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default CollectionModal;
