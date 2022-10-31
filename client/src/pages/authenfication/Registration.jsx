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
import usersService from "../../service/users.service";
import { Link, useNavigate } from 'react-router-dom';
import "./auth.css";

import {useTranslation} from "react-i18next";
import "../../tranlations/i18next";

function Registration() {

  const {t} = useTranslation();

  const [showPassword, setShowPassword] = useState(false);
  const { register, handleSubmit } = useForm();
  const [errorMessage, setErrorMessage] = useState(null);
  const [disableSubmit, setDisableSubmit] = useState(false);
  const navigate = useNavigate();

  const onSubmit = data => {
    setDisableSubmit(true);
    const { password, confirm_password } = data;

    if (password !== confirm_password) {

    } else {
      usersService
        .createUser(data)
        .then(() => {
          navigate("/login");
          setDisableSubmit(false);
        })
        .catch(err => {
          setErrorMessage(err.response.data);
          setDisableSubmit(false);
        });
    }
  };

  const handleShowPassword = () => setShowPassword(!showPassword);

  return (
    <div className="auth-form-container">
      <Paper component="form" elevation={3} onSubmit={handleSubmit(onSubmit)}>

        <TextField
          size="small"
          label={t("authenfication.registration.lastName")}
          variant="outlined"
          className="auth-form__input"
          required
          disabled={disableSubmit}
          {...register("last_name", { required: true })}
        />

        <TextField
          size="small"
          label={t("authenfication.registration.firstName")}
          variant="outlined"
          className="auth-form__input"
          required
          disabled={disableSubmit}
          {...register("first_name", { required: true })}
        />

        <TextField
          size="small"
          label={t("authenfication.registration.email")}
          variant="outlined"
          className="auth-form__input"
          autoComplete="off"
          required
          disabled={disableSubmit}
          {...register("email", { required: true })}
        />

        <FormControl size="small" variant="outlined" className="auth-form__input">
          <InputLabel htmlFor="outlined-adornment-password">{t("authenfication.registration.password")}</InputLabel>
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

        <TextField
          type="password"
          size="small"
          label={t("authenfication.registration.confirm")}
          variant="outlined"
          className="auth-form__input"
          required
          disabled={disableSubmit}
          {...register("confirm_password", { required: true })}
        />

        <Button
          variant="contained"
          type="submit"
          className="auth-form__submit-button"
          style={{ marginRight: 15 }}
          disabled={disableSubmit}
        >
          {t("authenfication.registration.create")}
        </Button>
        <span style={{color:"white" }}>{t("authenfication.registration.or")}</span>
        <Link style={{marginRight: "8rem"}} className="link" to="/login">{t("authenfication.registration.login")}</Link>

        {errorMessage && <div className="error-message">{errorMessage}</div>}
        <Button
        variant="contained"
        className="continue-button"
        endIcon={<ArrowRightAltIcon />}
        onClick={() => navigate("/")}
        disableElevation
      >
        {t("authenfication.registration.noLogin")}
      </Button>
      </Paper>
    </div>
  );
}

export default Registration;
