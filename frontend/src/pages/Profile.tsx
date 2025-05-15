import React from 'react';
import { Container, Typography, Paper, Box } from '@mui/material';

const Profile: React.FC = () => {
  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Profile
          </Typography>
          <Typography variant="body1">
            Your profile information will be displayed here.
          </Typography>
        </Paper>
      </Box>
    </Container>
  );
};

export default Profile; 