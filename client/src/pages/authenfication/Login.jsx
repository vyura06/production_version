import React, { useState } from "react";
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';
import { useForm } from "react-hook-form";
import { Link, useNavigate } from 'react-router-dom';
import usersService from "../../service/users.service";
import "./auth.css";

function Login({ setCurrentUser }) {
  const { register, handleSubmit } = useForm();
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [disableSubmit, setDisableSubmit] = useState(false);
  const navigate = useNavigate();

  const onSubmit = data => {
    setDisableSubmit(true);
    usersService
      .login(data.email, data.password)
      .then(response => {
        setCurrentUser(response.data.user)
        navigate("/");
        setDisableSubmit(false);
      })
      .catch(err => {
        setErrorMessage(err.response.data);
        setDisableSubmit(false);
      });
  };

  const handleShowPassword = () => setShowPassword(!showPassword);

  return (
    <div className="auth-form-container">
      <Paper component="form" elevation={3} onSubmit={handleSubmit(onSubmit)}>

        <TextField
          size="small"
          label="Email"
          variant="outlined"
          className="auth-form__input"
          autoComplete="off"
          required
          disabled={disableSubmit}
          {...register("email", { required: true })}
        />

        <FormControl size="small" variant="outlined" className="auth-form__input">
          <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
          <OutlinedInput
            id="outlined-adornment-password"
            type={showPassword ? 'text' : 'password'}
            required
            disabled={disableSubmit}
            {...register("password", { required: true })}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleShowPassword}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
            label="Password"
          />
        </FormControl>

        <Button
          variant="contained"
          type="submit"
          className="auth-form__submit-button"
          style={{ marginRight: 15 }}
          disabled={disableSubmit}
        >
          Login
        </Button>
        <span style={{ marginRight: 10 }}>Or</span>
        <Link to="/registration">Create new</Link>

        {errorMessage && <div className="error-message">{errorMessage}</div>}

        <Button
        variant="contained"
        className="continue-button"
        endIcon={<ArrowRightAltIcon />}
        onClick={() => navigate("/")}
        disableElevation
      >
        Continue without authentification
      </Button>
      </Paper>
    </div>
  );
}

export default Login;
