import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createVacation, uploadVacationImage } from "../../api/apiVacations";
import { getCountries } from "../../api/apiCountry";
import { Box, Paper, Typography, FormControl, InputLabel, Select, MenuItem, TextField, Button, CircularProgress, Alert, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Fade } from "@mui/material";

export default function AddVacation() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [countries, setCountries] = useState([]);
    const [previewUrl, setPreviewUrl] = useState("");
    const fileInputRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);
    const [showCancelDialog, setShowCancelDialog] = useState(false);
    const [showSuccessDialog, setShowSuccessDialog] = useState(false); // ← הוסף את זה
    const [createdVacation, setCreatedVacation] = useState(null); // ← הוסף את זה לשמירת פרטי החופשה

    const [vacationData, setVacationData] = useState({
        country_id: "",
        description: "",
        start_date: "",
        finish_day: "",
        price: "",
        image_filename: "",
        hasNewFile: false
    });

    useEffect(() => {
        const fetchCountries = async () => {
            try {
                console.log('🔥 Fetching countries for add vacation...');
                const countriesList = await getCountries();
                setCountries(countriesList);
                console.log('🔥 Countries loaded:', countriesList.length);
            } catch (e) {
                console.error('🔥 Error loading countries:', e);
                setError("Failed to load countries: " + e.message);
            } finally {
                setLoading(false);
            }
        };
        
        fetchCountries();
    }, []);

    // ניקוי URL כשהקומפוננט נמחק
    useEffect(() => {
        return () => {
            if (previewUrl && previewUrl.startsWith('blob:')) {
                URL.revokeObjectURL(previewUrl);
            }
        };
    }, [previewUrl]);

    const handleFileSelected = async (file) => {
        if (!file) return;
        
        const validTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
        if (!validTypes.includes(file.type)) {
            setError("Unsupported file type. Please use JPEG, PNG, GIF, or WebP.");
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            setError("File too large. Please use an image smaller than 5MB.");
            return;
        }

        try {
            // נקה preview URL קודם אם קיים
            if (previewUrl && previewUrl.startsWith('blob:')) {
                URL.revokeObjectURL(previewUrl);
            }

            // צור preview URL חדש
            const nextPreviewUrl = URL.createObjectURL(file);
            setPreviewUrl(nextPreviewUrl);
            
            // סמן שיש קובץ חדש
            setVacationData((prev) => ({
                ...prev,
                hasNewFile: true
            }));
            
            setError("");
        } catch (err) {
            console.error("Failed to process image", err);
            setError("Failed to process image");
        }
    };

    const handleRemoveImage = () => {
        console.log('🔥 Removing image...');
        
        // נקה preview URL אם קיים
        if (previewUrl && previewUrl.startsWith('blob:')) {
            URL.revokeObjectURL(previewUrl);
        }
        
        // נקה את כל נתוני התמונה
        setPreviewUrl("");
        setVacationData((prev) => ({ 
            ...prev, 
            image_filename: "",
            hasNewFile: false
        }));
        
        // נקה את input הקובץ
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
        
        console.log('🔥 Image removed successfully');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        
        // בדיקת שדות חובה - תמונה לא חובה!
        if (!vacationData.country_id) {
            setError("Please select a destination");
            return;
        }
        if (!vacationData.description.trim()) {
            setError("Please enter a description");
            return;
        }
        if (!vacationData.start_date) {
            setError("Please select a start date");
            return;
        }
        if (!vacationData.finish_day) {
            setError("Please select an end date");
            return;
        }
        if (!vacationData.price || Number(vacationData.price) <= 0) {
            setError("Please enter a valid price");
            return;
        }

        // בדיקת תאריכים
        if (new Date(vacationData.start_date) >= new Date(vacationData.finish_day)) {
            setError("End date must be after start date");
            return;
        }

        // בדיקה שתאריך ההתחלה הוא מחר או יותר
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(0, 0, 0, 0);
        const startDate = new Date(vacationData.start_date);
        
        if (startDate < tomorrow) {
            setError("Start date must be tomorrow or later");
            return;
        }
        
        try {
            console.log('🔥 Creating new vacation...');
            
            const payload = {
                country_id: Number(vacationData.country_id),
                description: vacationData.description.trim(),
                start_date: vacationData.start_date,
                finish_day: vacationData.finish_day,
                price: Number(vacationData.price)
            };
            
            // טיפול בתמונה
            if (vacationData.hasNewFile && fileInputRef.current?.files[0]) {
                // אם יש קובץ חדש - העלה אותו
                console.log('🔥 Uploading new image...');
                const uploadResult = await uploadVacationImage(fileInputRef.current.files[0]);
                payload.image_filename = uploadResult.filename;
                console.log('🔥 New image uploaded:', uploadResult.filename);
            } else {
                // אם אין תמונה - שלח מחרוזת ריקה
                payload.image_filename = "";
                console.log('🔥 No image - setting empty string');
            }
            
            console.log('🔥 Final payload:', payload);
            
            const result = await createVacation(payload);
            console.log('🔥 Vacation created successfully!', result);
            
            // שמור את פרטי החופשה שנוצרה עם שם המדינה
            const selectedCountry = countries.find(c => c.country_id.toString() === vacationData.country_id);
            setCreatedVacation({
                ...payload,
                countryName: selectedCountry?.name || "Unknown",
                vacation_id: result.vacation_id || "New"
            });
            
            // הצג הודעת הצלחה
            setShowSuccessDialog(true);
            
        } catch (e) {
            console.error('🔥 Create error:', e);
            setError(e?.message || "Failed to create vacation");
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };

    const handleDrop = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        const file = e.dataTransfer?.files && e.dataTransfer.files[0];
        if (file) {
            await handleFileSelected(file);
        }
    };

    const handleCancel = () => {
        setShowCancelDialog(true);
    };

    const confirmCancel = () => {
        setShowCancelDialog(false);
        navigate("/vacations");
    };

    const handleSuccessDialogClose = () => {
        setShowSuccessDialog(false);
        navigate("/vacations");
    };

    // פונקציה לפורמט תאריך יפה
    const formatDateForDisplay = (dateStr) => {
        if (!dateStr) return "";
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
    };

    if (loading) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 6 }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ mt: 8, display: "flex", justifyContent: "center" }}>
            <Paper elevation={4} sx={{ p: 4, borderRadius: 4, minWidth: 400, background: "#e3f2fd", maxWidth: "sm" }}>
                <Typography variant="h4" align="center" color="primary" fontWeight="bold" gutterBottom>
                    Add New Vacation
                </Typography>
                
                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
                )}
                
                <form onSubmit={handleSubmit}>
                    <FormControl fullWidth required sx={{ mb: 2 }}>
                        <InputLabel>Destination</InputLabel>
                        <Select
                            value={vacationData.country_id}
                            label="Destination"
                            onChange={(e) => setVacationData({ ...vacationData, country_id: e.target.value })}
                        >
                            {countries.map((country) => (
                                <MenuItem key={country.country_id} value={country.country_id.toString()}>
                                    {country.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <TextField
                        label="Description"
                        value={vacationData.description}
                        onChange={(e) => setVacationData({ ...vacationData, description: e.target.value })}
                        fullWidth
                        required
                        multiline
                        rows={3}
                        sx={{ mb: 2 }}
                    />

                    <TextField
                        label="Start Date"
                        type="date"
                        value={vacationData.start_date}
                        onChange={(e) => setVacationData({ ...vacationData, start_date: e.target.value })}
                        fullWidth
                        required
                        InputLabelProps={{ shrink: true }}
                        sx={{ mb: 2 }}
                        inputProps={{
                            min: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split("T")[0] // מחר ומעלה
                        }}
                    />

                    <TextField
                        label="End Date"
                        type="date"
                        value={vacationData.finish_day}
                        onChange={(e) => setVacationData({ ...vacationData, finish_day: e.target.value })}
                        fullWidth
                        required
                        InputLabelProps={{ shrink: true }}
                        sx={{ mb: 2 }}
                        inputProps={{
                            min: vacationData.start_date || new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split("T")[0]
                        }}
                    />

                    <TextField
                        label="Price (₪)"
                        type="number"
                        value={vacationData.price}
                        onChange={(e) => {
                            const value = e.target.value;
                            // אפשר רק מספרים שלמים
                            if (value === "" || (/^\d+$/.test(value) && Number(value) >= 0)) {
                                setVacationData({ ...vacationData, price: value });
                            }
                        }}
                        fullWidth
                        required
                        inputProps={{ 
                            min: 1,
                            step: 1 // רק מספרים שלמים
                        }}
                        sx={{ mb: 2 }}
                    />

                    <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 'bold' }}>
                        Vacation Image (Optional)
                    </Typography>

                    <Box
                        onDrop={handleDrop}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        sx={{
                            mb: 3,
                            p: 2,
                            border: "2px dashed",
                            borderColor: isDragging ? "primary.main" : "grey.400",
                            borderRadius: 2,
                            backgroundColor: isDragging ? "#e3f2fd" : "#fafafa",
                            textAlign: "center",
                            cursor: "pointer",
                            position: "relative",
                            minHeight: 160,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            overflow: "hidden",
                        }}
                        onClick={() => fileInputRef.current && fileInputRef.current.click()}
                        role="button"
                        aria-label="Upload image (optional)"
                    >
                        {previewUrl ? (
                            <Box sx={{ position: "relative", width: "100%", height: "100%" }}>
                                <img
                                    src={previewUrl}
                                    alt="Vacation preview"
                                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                />
                                <Box sx={{ position: "absolute", top: 8, right: 8 }}>
                                    <Button
                                        variant="contained"
                                        color="error"
                                        size="small"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleRemoveImage();
                                        }}
                                    >
                                        Remove
                                    </Button>
                                </Box>
                            </Box>
                        ) : (
                            <Box>
                                <Typography variant="body1" sx={{ mb: 1 }}>
                                    📷 Add an image (Optional)
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                    Drag & drop or click to browse • JPEG, PNG, GIF, WEBP
                                </Typography>
                                <Button 
                                    variant="outlined" 
                                    onClick={(e) => { 
                                        e.stopPropagation(); 
                                        if (fileInputRef.current) fileInputRef.current.click(); 
                                    }}
                                >
                                    Choose Image
                                </Button>
                            </Box>
                        )}
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept=".jpg,.jpeg,.png,.gif,.webp"
                            style={{ display: "none" }}
                            onChange={async (e) => {
                                const file = e.target.files && e.target.files[0];
                                await handleFileSelected(file);
                            }}
                        />
                    </Box>

                    <Button 
                        type="submit" 
                        variant="contained" 
                        color="primary" 
                        fullWidth 
                        sx={{ mt: 1, mb: 2, fontWeight: "bold", fontSize: "1.1rem" }}
                    >
                        Add Vacation
                    </Button>
                    
                    <Button
                        type="button"
                        variant="outlined"
                        color="error"
                        fullWidth
                        onClick={handleCancel}
                    >
                        Cancel
                    </Button>
                </form>
            </Paper>

            {/* דיאלוג אישור ביטול */}
            <Dialog open={showCancelDialog} onClose={() => setShowCancelDialog(false)}>
                <DialogTitle>Cancel Changes</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to cancel? All entered data will be lost.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setShowCancelDialog(false)} color="primary">
                        No, Continue Adding
                    </Button>
                    <Button onClick={confirmCancel} color="error" autoFocus>
                        Yes, Cancel
                    </Button>
                </DialogActions>
            </Dialog>

            {/* דיאלוג הצלחת הוספה */}
            <Dialog 
                open={showSuccessDialog} 
                onClose={handleSuccessDialogClose}
                maxWidth="sm"
                fullWidth
                PaperProps={{
                    sx: {
                        borderRadius: 4,
                        background: 'linear-gradient(135deg, #4caf50 0%, #66bb6a 100%)',
                        color: 'white',
                        overflow: 'hidden',
                        boxShadow: '0 20px 60px rgba(76, 175, 80, 0.4)'
                    }
                }}
            >
                <Fade in={showSuccessDialog} timeout={500}>
                    <Box>
                        <DialogTitle sx={{ 
                            textAlign: 'center', 
                            pb: 2,
                            background: 'rgba(255,255,255,0.1)',
                            backdropFilter: 'blur(10px)'
                        }}>
                            <Typography variant="h4" sx={{ 
                                fontWeight: 'bold',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: 1
                            }}>
                                🎉 Vacation Added!
                            </Typography>
                        </DialogTitle>
                        
                        <DialogContent sx={{ py: 4 }}>
                            <Box sx={{ textAlign: 'center' }}>
                                <Typography variant="h6" sx={{ mb: 3, opacity: 0.9 }}>
                                    New vacation created successfully!
                                </Typography>
                                
                                {createdVacation && (
                                    <Box sx={{ 
                                        background: 'rgba(255,255,255,0.1)',
                                        borderRadius: 3,
                                        p: 3,
                                        mb: 3,
                                        backdropFilter: 'blur(10px)',
                                        border: '1px solid rgba(255,255,255,0.2)',
                                        textAlign: 'left'
                                    }}>
                                        <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, textAlign: 'center' }}>
                                            📍 {createdVacation.countryName}
                                        </Typography>
                                        
                                        <Typography variant="body1" sx={{ opacity: 0.9, mb: 2 }}>
                                            📝 {createdVacation.description?.length > 120 
                                                ? `${createdVacation.description.substring(0, 120)}...`
                                                : createdVacation.description
                                            }
                                        </Typography>
                                        
                                        <Box sx={{ 
                                            display: 'flex', 
                                            justifyContent: 'space-between', 
                                            flexWrap: 'wrap', 
                                            gap: 1,
                                            mb: 2 
                                        }}>
                                            <Typography variant="body2" sx={{ opacity: 0.8 }}>
                                                🗓️ {formatDateForDisplay(createdVacation.start_date)}
                                            </Typography>
                                            <Typography variant="body2" sx={{ opacity: 0.8 }}>
                                                ➡️ {formatDateForDisplay(createdVacation.finish_day)}
                                            </Typography>
                                        </Box>
                                        
                                        <Typography variant="h6" sx={{ 
                                            fontWeight: 'bold', 
                                            textAlign: 'center',
                                            background: 'rgba(255,255,255,0.2)',
                                            borderRadius: 2,
                                            py: 1
                                        }}>
                                            💰 {createdVacation.price} ₪
                                        </Typography>
                                    </Box>
                                )}
                                
                                <Typography variant="body1" sx={{ 
                                    color: 'rgba(255,255,255,0.9)',
                                    fontWeight: 500 
                                }}>
                                    The vacation is now available for users to discover and book!
                                </Typography>
                            </Box>
                        </DialogContent>
                        
                        <DialogActions sx={{ 
                            p: 3,
                            background: 'rgba(255,255,255,0.1)',
                            backdropFilter: 'blur(10px)'
                        }}>
                            <Button
                                onClick={handleSuccessDialogClose}
                                sx={{
                                    background: 'linear-gradient(45deg, #388e3c, #4caf50)',
                                    color: 'white',
                                    fontWeight: 'bold',
                                    borderRadius: 3,
                                    py: 1.5,
                                    '&:hover': {
                                        background: 'linear-gradient(45deg, #2e7d32, #388e3c)',
                                        transform: 'scale(1.05)',
                                        boxShadow: '0 8px 25px rgba(56, 142, 60, 0.6)'
                                    }
                                }}
                                variant="contained"
                                fullWidth
                            >
                                ✨ View All Vacations
                            </Button>
                        </DialogActions>
                    </Box>
                </Fade>
            </Dialog>
        </Box>
    );
}
