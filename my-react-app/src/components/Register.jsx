import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../contexts/Context";
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Container,
  CircularProgress,
  Alert,
  Link,
  InputAdornment,
  IconButton
} from '@mui/material';
import { PersonAdd as RegisterIcon, Visibility, VisibilityOff } from '@mui/icons-material';

export default function Register() {
  const navigate = useNavigate();
  const { register: contextRegister, loading: contextLoading, error: contextError, clearError } = useUser();

  const [form, setForm] = useState({ email: "", password: "", first_name: "", last_name: "" });
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
    if (contextError) {
      clearError();
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await contextRegister(form);
      navigate('/login');
    } catch (error) {
      console.log("Register error:", error);
    }
  };

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <RegisterIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
            <Typography variant="h4" component="h1" gutterBottom>
              Create Account
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Fill in your details to register
            </Typography>
          </Box>

          {contextError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {contextError}
            </Alert>
          )}

          <Box component="form" onSubmit={handleRegister} noValidate>
            <TextField
              margin="normal"
              required
              fullWidth
              label="First Name"
              name="first_name"
              value={form.first_name}
              onChange={handleChange}
              variant="outlined"
              disabled={contextLoading}
              sx={{ mb: 2 }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              label="Last Name"
              name="last_name"
              value={form.last_name}
              onChange={handleChange}
              variant="outlined"
              disabled={contextLoading}
              sx={{ mb: 2 }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              label="Email Address"
              name="email"
              type="email"
              autoComplete="email"
              value={form.email}
              onChange={handleChange}
              variant="outlined"
              disabled={contextLoading}
              sx={{ mb: 2 }}
            />

            <TextField
              margin="normal"
              required
              fullWidth
              label="Password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              value={form.password}
              onChange={handleChange}
              variant="outlined"
              disabled={contextLoading}
              sx={{ mb: 3 }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label={showPassword ? "Hide password" : "Show password"}
                      onClick={handleClickShowPassword}
                      edge="end"
                      tabIndex={-1}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={contextLoading}
              sx={{
                py: 1.5,
                position: 'relative'
              }}
            >
              {contextLoading ? (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CircularProgress size={20} color="inherit" />
                  <Typography>Registering...</Typography>
                </Box>
              ) : (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <RegisterIcon />
                  <Typography>Register</Typography>
                </Box>
              )}
            </Button>
          </Box>

          <Box sx={{ textAlign: 'center', mt: 3 }}>
            <Typography variant="body2" color="text.secondary">
              Already have an account?{' '}
              <Link
                href="/login"
                variant="body2"
                sx={{
                  cursor: 'pointer',
                  textDecoration: 'none',
                  '&:hover': {
                    textDecoration: 'underline'
                  }
                }}
              >
                Sign in here
              </Link>
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Container>
  )
}

