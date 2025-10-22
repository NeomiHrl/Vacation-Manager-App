import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getVacationById, updateVacation, uploadVacationImage, getVacationImageUrl } from "../../api/apiVacations"; // ← הסר deleteVacation ו-createVacation
import { getCountries } from "../../api/apiCountry";
import { Box, Paper, Typography, FormControl, InputLabel, Select, MenuItem, TextField, Button, CircularProgress, Alert, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Fade } from "@mui/material";

export default function EditVacation() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [countries, setCountries] = useState([]);
    const [previewUrl, setPreviewUrl] = useState("");
    const fileInputRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);
    const [showCancelDialog, setShowCancelDialog] = useState(false);
    const [showSuccessDialog, setShowSuccessDialog] = useState(false);

    const [vacationData, setVacationData] = useState({
        country_id: "",
        description: "",
        start_date: "",
        finish_day: "",
        price: "",
        image_filename: "",
        hasNewFile: false,
        imageRemoved: false,
        originalImageFilename: "" // לזכור את התמונה המקורית
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                console.log('🔥 Fetching vacation with ID:', id);
                
                const [vacation, countriesList] = await Promise.all([
                    getVacationById(id),
                    getCountries(),
                ]);

                console.log('🔥 Raw vacation data:', vacation);
                setCountries(countriesList);

                // פונקציה לתיקון פורמט תאריך לשדה input
                const formatDateForInput = (dateStr) => {
                    if (!dateStr) return "";
                    try {
                        if (typeof dateStr === 'string' && dateStr.match(/^\d{4}-\d{2}-\d{2}$/)) {
                            return dateStr;
                        }
                        
                        const date = new Date(dateStr);
                        if (isNaN(date.getTime())) {
                            console.warn('🔥 Invalid date:', dateStr);
                            return "";
                        }
                        
                        const year = date.getFullYear();
                        const month = String(date.getMonth() + 1).padStart(2, '0');
                        const day = String(date.getDate()).padStart(2, '0');
                        
                        const formatted = `${year}-${month}-${day}`;
                        console.log('🔥 Formatted date:', dateStr, '→', formatted);
                        return formatted;
                    } catch (error) {
                        console.error('🔥 Error formatting date:', dateStr, error);
                        return "";
                    }
                };

                // פורמט מחיר למספר שלם בלבד
                const formatPrice = (price) => {
                    if (!price) return "";
                    return Math.floor(Number(price)).toString();
                };

                const formattedData = {
                    country_id: (vacation.country_id ?? "").toString(),
                    description: vacation.description ?? "",
                    start_date: formatDateForInput(vacation.start_date),
                    finish_day: formatDateForInput(vacation.finish_day),
                    price: formatPrice(vacation.price),
                    image_filename: vacation.image_filename ?? "",
                    originalImageFilename: vacation.image_filename ?? "", // ← שמור את התמונה המקורית
                    hasNewFile: false,
                    imageRemoved: false
                };

                console.log('🔥 Formatted vacation data:', formattedData);
                setVacationData(formattedData);

                // הצג תמונה קיימת אם יש
                if (vacation.image_filename && !previewUrl) {
                    setPreviewUrl(getVacationImageUrl(vacation.image_filename));
                }

            } catch (e) {
                console.error('🔥 Error loading vacation:', e);
                setError("Failed to load vacation data: " + e.message);
            } finally {
                setLoading(false);
            }
        };
        
        if (id) {
            fetchData();
        }
    }, [id]);

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
                hasNewFile: true,
                imageRemoved: false
            }));
            
            setError("");
        } catch (err) {
            console.error("Failed to process image", err);
            setError("Failed to process image");
        }
    };

    const handleRemoveImage = async () => {
        try {
            console.log('🔥 Removing image...');
            
            // אם יש תמונה קיימת - צור חופשה זמנית כדי למחוק רק את התמונה
            if (vacationData.originalImageFilename && vacationData.originalImageFilename.trim() !== "") {
                // כאן נשתמש בפונקציה הקיימת של מחיקת חופשה כדי למחוק את התמונה
                // אבל לא באמת נמחק את החופשה, רק נתרים את הקוד לטפל בזה
                console.log('🔥 Will delete image on save:', vacationData.originalImageFilename);
            }
            
            // נקה preview URL אם קיים
            if (previewUrl && previewUrl.startsWith('blob:')) {
                URL.revokeObjectURL(previewUrl);
            }
            
            // נקה את כל נתוני התמונה
            setPreviewUrl("");
            setVacationData((prev) => ({ 
                ...prev, 
                image_filename: "",
                hasNewFile: false,
                imageRemoved: true
            }));
            
            // נקה את input הקובץ
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
            
            console.log('🔥 Image marked for removal');
        } catch (error) {
            console.error('🔥 Error marking image for removal:', error);
            setError("Failed to remove image");
        }
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
        
        try {
            console.log('🔥 Submitting vacation update...');
            
            const payload = {
                country_id: Number(vacationData.country_id),
                description: vacationData.description.trim(),
                start_date: vacationData.start_date,
                finish_day: vacationData.finish_day,
                price: Number(vacationData.price)
            };
            
            // טיפול בתמונה - פתרון פשוט יותר
            if (vacationData.hasNewFile && fileInputRef.current?.files[0]) {
                // אם יש קובץ חדש - העלה אותו
                console.log('🔥 Uploading new image...');
                const uploadResult = await uploadVacationImage(fileInputRef.current.files[0]);
                payload.image_filename = uploadResult.filename;
                
                // שלח את שם התמונה הישנה למחיקה (השרת יטפל בזה)
                if (vacationData.originalImageFilename && vacationData.originalImageFilename.trim() !== "") {
                    payload.old_image_filename = vacationData.originalImageFilename;
                }
                
                console.log('🔥 New image uploaded:', uploadResult.filename);
                console.log('🔥 Old image to delete:', vacationData.originalImageFilename);
            } else if (vacationData.imageRemoved) {
                // אם התמונה הוסרה - שלח מחרוזת ריקה
                payload.image_filename = "";
                
                // שלח את שם התמונה הישנה למחיקה
                if (vacationData.originalImageFilename && vacationData.originalImageFilename.trim() !== "") {
                    payload.old_image_filename = vacationData.originalImageFilename;
                }
                
                console.log('🔥 Image removed');
            } else if (vacationData.image_filename && vacationData.image_filename.trim() !== "" && !vacationData.imageRemoved) {
                // אם יש תמונה קיימת ולא הוסרה - שמור אותה
                payload.image_filename = vacationData.image_filename;
                console.log('🔥 Keeping existing image:', vacationData.image_filename);
            } else {
                // אם אין תמונה - שלח מחרוזת ריקה
                payload.image_filename = "";
                console.log('🔥 No image - setting empty string');
            }
            
            console.log('🔥 Final payload:', payload);
            
            await updateVacation(id, payload);
            console.log('🔥 Vacation updated successfully!');
            
            // הצג הודעת הצלחה
            setShowSuccessDialog(true);
            
        } catch (e) {
            console.error('🔥 Update error:', e);
            setError(e?.message || "Failed to update vacation");
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
                    Edit Vacation
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
                            min: vacationData.start_date
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
                        {(previewUrl || (vacationData.image_filename && vacationData.image_filename.trim() !== "" && !vacationData.imageRemoved)) ? (
                            <Box sx={{ position: "relative", width: "100%", height: "100%" }}>
                                <img
                                    src={previewUrl || getVacationImageUrl(vacationData.image_filename)}
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
                        Save Changes
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
                        Are you sure you want to cancel? All unsaved changes will be lost.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setShowCancelDialog(false)} color="primary">
                        No, Continue Editing
                    </Button>
                    <Button onClick={confirmCancel} color="error" autoFocus>
                        Yes, Cancel Changes
                    </Button>
                </DialogActions>
            </Dialog>

            {/* דיאלוג הצלחה */}
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
                                ✅ Success!
                            </Typography>
                        </DialogTitle>
                        
                        <DialogContent sx={{ py: 4 }}>
                            <Box sx={{ textAlign: 'center' }}>
                                <Typography variant="h6" sx={{ mb: 2, opacity: 0.9 }}>
                                    Vacation updated successfully!
                                </Typography>
                                
                                <Typography variant="body1" sx={{ 
                                    color: 'rgba(255,255,255,0.9)',
                                    fontWeight: 500 
                                }}>
                                    All changes have been saved and the vacation is now available with the updated information.
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
                                ✨ Back to Vacations
                            </Button>
                        </DialogActions>
                    </Box>
                </Fade>
            </Dialog>
        </Box>
    );
}
