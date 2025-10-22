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
import { Login as LoginIcon, Visibility, VisibilityOff } from '@mui/icons-material';

export default function Login() {
  const navigate = useNavigate();
  const { login: contextLogin, loading: contextLoading, error: contextError, clearError } = useUser();

  const [form, setForm] = useState({ email: "", password: "" });
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

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await contextLogin(form);
      navigate('/vacations');
    } catch (error) {
      console.log("Login error:", error);
    }
  };

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <LoginIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
            <Typography variant="h4" component="h1" gutterBottom>
              Welcome Back
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Sign in to your account to continue
            </Typography>
          </Box>

          {contextError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {contextError}
            </Alert>
          )}

          <Box component="form" onSubmit={handleLogin} noValidate>
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
              autoComplete="current-password"
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
                  <Typography>Signing In...</Typography>
                </Box>
              ) : (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <LoginIcon />
                  <Typography>Sign In</Typography>
                </Box>
              )}
            </Button>
          </Box>

          <Box sx={{ textAlign: 'center', mt: 3 }}>
            <Typography variant="body2" color="text.secondary">
              Don't have an account?{' '}
              <Link
                href="/register"
                variant="body2"
                sx={{
                  cursor: 'pointer',
                  textDecoration: 'none',
                  '&:hover': {
                    textDecoration: 'underline'
                  }
                }}
              >
                Sign up here
              </Link>
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}