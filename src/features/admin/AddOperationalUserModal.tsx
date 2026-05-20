import { Alert, Box, Button, Grid, MenuItem, Modal, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { createOperationalUser } from "./adminApi";

type Props = {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
};

const defaultForm = {
  username: "",
  contactPerson: "",
  companyName: "",
  title: "",
  phoneNumber: "",
  address: "",
  city: "",
  state: "",
  role: "CHECKER",
};

const AddOperationalUserModal = ({ open, onClose, onCreated }: Props) => {
  const [formData, setFormData] = useState(defaultForm);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setError("");
    setSuccess("");
    try {
      await createOperationalUser(formData);
      setSuccess("Operational user created. Password setup email sent.");
      setFormData(defaultForm);
      onCreated();
    } catch (e: any) {
      setError(e?.response?.data?.message || e?.response?.data || "Failed to create operational user.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} className="special_modal2">
      <Box sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '70%',
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
      }}>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>
          Add Operational User
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={6}><TextField fullWidth label="Email" value={formData.username} onChange={(e) => handleChange("username", e.target.value)} /></Grid>
          <Grid item xs={6}><TextField fullWidth label="Contact Person" value={formData.contactPerson} onChange={(e) => handleChange("contactPerson", e.target.value)} /></Grid>
          <Grid item xs={6}><TextField fullWidth label="Company Name" value={formData.companyName} onChange={(e) => handleChange("companyName", e.target.value)} /></Grid>
          <Grid item xs={6}><TextField fullWidth label="Title" value={formData.title} onChange={(e) => handleChange("title", e.target.value)} /></Grid>
          <Grid item xs={6}><TextField fullWidth label="Phone Number" value={formData.phoneNumber} onChange={(e) => handleChange("phoneNumber", e.target.value)} /></Grid>
          <Grid item xs={6}><TextField fullWidth label="City" value={formData.city} onChange={(e) => handleChange("city", e.target.value)} /></Grid>
          <Grid item xs={6}><TextField fullWidth label="State" value={formData.state} onChange={(e) => handleChange("state", e.target.value)} /></Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              select
              label="Role"
              value={formData.role}
              onChange={(e) => handleChange("role", e.target.value)}
            >
              <MenuItem value="CHECKER">CHECKER</MenuItem>
              <MenuItem value="MAKER">MAKER</MenuItem>
              <MenuItem value="CHECKER,USERADMIN">CHECKER + USERADMIN</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={6}><TextField fullWidth label="Address" value={formData.address} onChange={(e) => handleChange("address", e.target.value)} /></Grid>
        </Grid>
        {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mt: 2 }}>{success}</Alert>}
        <Box sx={{ display: "flex", gap: 2, mt: 3 }}>
          <Button variant="outlined" onClick={onClose}>Close</Button>
          <Button variant="contained" onClick={handleSubmit} disabled={submitting}>
            {submitting ? "Creating..." : "Create User"}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default AddOperationalUserModal;
