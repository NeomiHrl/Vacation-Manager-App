import { useUser } from "../contexts/Context";
import { Box, Typography, Paper, Avatar, Fade } from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";

// Helper function to get user type in English
const getUserType = (role_id) => role_id === 1 ? "Admin" : "User";

// Format registration date
const formatDate = (dateStr) => {
    if (!dateStr) return "Unknown";
    const date = new Date(dateStr);
    return date.toLocaleDateString();
};

export default function Profile() {
    const { user } = useUser();
    const profileImg = user?.profile_img || null;

    if (!user) {
        return (
            <Box sx={{ mt: 6, display: "flex", justifyContent: "center" }}>
                <Typography variant="h5" color="error">
                    You must be logged in to view your profile.
                </Typography>
            </Box>
        );
    }

    return (
        <Fade in timeout={700}>
            <Box sx={{ mt: 6, display: "flex", justifyContent: "center" }}>
                <Paper elevation={6} sx={{
                    p: 4,
                    borderRadius: 4,
                    minWidth: 350,
                    background: "linear-gradient(135deg,#e3f2fd 60%,#bbdefb 100%)",
                    boxShadow: "0 8px 32px 0 rgba(33,150,243,0.18)"
                }}>
                    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mb: 2 }}>
                        <Avatar
                            src={profileImg}
                            sx={{
                                width: 100,
                                height: 100,
                                mb: 2,
                                boxShadow: "0 4px 16px 0 rgba(33,150,243,0.18)",
                                bgcolor: "#90caf9"
                            }}
                        >
                            {!profileImg && <AccountCircleIcon sx={{ fontSize: 80, color: "#1976d2" }} />}
                        </Avatar>
                    </Box>
                    <Typography variant="h4" align="center" color="primary" fontWeight="bold" gutterBottom>
                        User Profile
                    </Typography>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 2, justifyContent: "center" }}>
                        <Typography variant="subtitle1" color="primary" fontWeight="bold">
                            User Type: {getUserType(user.role_id)}
                        </Typography>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                        <AccountCircleIcon sx={{ mr: 1, color: "#1976d2" }} />
                        <Typography variant="h6" fontWeight="bold">
                            {user.first_name} {user.last_name}
                        </Typography>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                        <EmailIcon sx={{ mr: 1, color: "#1976d2" }} />
                        <Typography variant="h6">
                            {user.email}
                        </Typography>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                        <CalendarMonthIcon sx={{ mr: 1, color: "#1976d2" }} />
                        <Typography variant="body1" color="text.secondary">
                            Registration Date: {formatDate(user.registration_date)}
                        </Typography>
                    </Box>
                </Paper>
            </Box>
        </Fade>
    );
}
