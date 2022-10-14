import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Badge from '@mui/material/Badge';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbUpOutlinedIcon from '@mui/icons-material/ThumbUpOutlined';
import ChatIcon from '@mui/icons-material/Chat';
import { Divider, IconButton, Stack, Paper, Chip, Button, Popover, TextField } from "@mui/material";
import itemsService from "../../shared/api/items.service";
import SendIcon from '@mui/icons-material/Send';
import DeleteIcon from '@mui/icons-material/Delete';
import "./item.css";

function Item({ currentUser }) {
  const location = useLocation();
  const [currentUserLike, setCurrentUserLike] = useState(null);
  const [likes, setLikes] = useState([]);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [comment, setComment] = useState("");
  const [errorComment, setErrorComment] = useState(false);
  const [disabled, setDisabled] = useState(false);

  const item = location.state.item;
  const {
    id,
    collection_name,
    name,
    tags,
    optionalFields,
    created_date,
    last_edit
  } = item;

  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleOpenPopover = (event) => {
    setAnchorEl(event.currentTarget);
  }

  const handleClosePopup = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const popupId = open ? 'simple-popover' : undefined;

  useEffect(() => {
    const getItemStats = () => {
      itemsService
        .getItemLikes(id)
        .then(res => {
          const dbLikes = res.data.likes;
          setLikes(dbLikes);

          if (currentUser) {
            dbLikes.forEach(like => {
              if (like.user_id === currentUser?.id)
                setCurrentUserLike(like);
            });
          }
          setLoading(false);
        })
        .catch(err => console.log(err));

      itemsService
        .getItemComments(id)
        .then(res => setComments(res.data.comments))
        .catch(err => console.log(err));
    }

    getItemStats();
    setInterval(getItemStats, 5000);
  }, []);

  const infoFields = [
    {
      name: "Collection name",
      value: collection_name
    },
    {
      name: "Tags",
      value: (
        <Stack direction="row" spacing={1}>
          {tags.map((tag, index) => (
            <Chip key={index} label={tag.name} variant="outlined" />
          ))}
        </Stack>
      )
    },
  ];

  const getDateFormat = (date) => {
    const newDate = new Date(date);
    const datePart = newDate.toLocaleDateString();
    const timePart = newDate.toLocaleTimeString();

    return `${datePart} ${timePart}`;
  }

  const created = getDateFormat(created_date);
  const lastEdit = getDateFormat(last_edit);

  if (optionalFields.length) {
    for (const field of optionalFields) {
      let value = field.value;
      if (field.type_name === "Checkbox")
        value = value === "true" ? "✔" : "✖";

      infoFields.push({
        name: field.name,
        value
      });
    }

    infoFields.push(
      {
        name: "Last edit",
        value: lastEdit
      },
      {
        name: "Created",
        value: created
      },
    )
  }

  const handleLikeButton = async () => {
    if (!currentUser || loading) return;

    if (currentUserLike) {
      await itemsService.removeLike(id, currentUserLike.id);
      setLikes(likes.filter(like => like.id !== currentUserLike.id));
      setCurrentUserLike(null);
    } else {
      const response = await itemsService.likeItem(id, currentUser.id);
      const like = response.data.like;
      setCurrentUserLike(like);
      setLikes(likes.concat(like));
    }
  }

  const handleCommentInput = event => {
    setErrorComment(event.target.value === "");
    setComment(event.target.value.toString().trim())
  }

  const handleCreateComment = async () => {
    if (comment === "") {
      setErrorComment(true);
      return;
    }
    setErrorComment(false);
    setDisabled(true);

    const response = await itemsService.sendComment(id, {
      user_id: currentUser.id,
      body: comment
    });
    const newComment = response.data.comment;

    setDisabled(false);
    setComment("");
    setComments(comments.concat([newComment]));
  }

  const handleRemoveComment = async (comment_id) => {
    await itemsService.removeComment(id, comment_id);
    setComments(comments.filter(c => c.id !== comment_id));
  }

  return (
    <div className="item__container">
      <header className="info__header">
        <div className="info__title">
          <h1>{name}</h1>
        </div>
        { infoFields.map((field, index) => (
          <div key={index} className="info__field">
            <div className="field__header">{field.name}</div>
            <p>{field.value}</p>
          </div>
        )) }
      </header>
      <div className="item__stats">
        <div>
          <IconButton sx={{ marginRight: "10px" }} onClick={handleLikeButton}>
            <Badge color="primary" max={999} badgeContent={likes.length} showZero>
              {currentUserLike ? (
                <ThumbUpIcon sx={{ margin: "3px" }} />
              ) : (
                <ThumbUpOutlinedIcon sx={{ margin: "3px" }} />
              )}
            </Badge>
          </IconButton>
          <IconButton>
            <Badge color="primary" max={999} badgeContent={comments.length} showZero>
              <ChatIcon sx={{ margin: "3px" }} />
            </Badge>
          </IconButton>
        </div>
        {currentUser && (
          <div>
            <Button aria-describedby={id} variant="contained" onClick={handleOpenPopover}>
              Create comment
            </Button>
            <Popover
              id={popupId}
              open={open}
              anchorEl={anchorEl}
              onClose={handleClosePopup}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              style={{ display: "flex", flexDirection: "column" }}
            >
              <Stack spacing={2} sx={{ m: 2 }}>
                <TextField
                  label="Comment"
                  error={errorComment}
                  multiline
                  rows={3}
                  value={comment}
                  onInput={handleCommentInput}
                  disabled={disabled}
                />
                <Button
                  variant="contained"
                  endIcon={<SendIcon />}
                  onClick={handleCreateComment}
                  disabled={disabled}
                >
                  Send
                </Button>
              </Stack>
            </Popover>
          </div>
        )}
      </div>
      <Divider>Comments</Divider>
      <Stack className="item__comments" spacing={2} alignItems="flex-start">
        { comments.map((comment, index) => (
          <Paper key={index} className="comments__comment">
            <header className="comment__header">
              <small>
                <strong color="primary">{comment.user_name}</strong> ・ {getDateFormat(comment.created_date)}
              </small>
              {currentUser && currentUser?.id === comment.user_id && (
                <IconButton size="small" onClick={() => handleRemoveComment(comment.id)} sx={{ marginLeft: 3, p: 0 }}>
                  <DeleteIcon fontSize="small" />
                </IconButton>
              )}
            </header>
            <p>{comment.body}</p>
          </Paper>
        ))}
      </Stack>
    </div>
  );
}

export default Item;
