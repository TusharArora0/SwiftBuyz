import { useState, useEffect } from 'react';
import { Box, Typography, Button, Alert, CircularProgress } from '@mui/material';
import { testApiConnection } from '../utils/apiConfig';

const ApiTest = () => {
  const [testResult, setTestResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const runTest = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await testApiConnection();
      setTestResult(result);
      if (!result.success) {
        setError(result.message || result.error);
      }
    } catch (err) {
      setError(err.message);
      setTestResult({ success: false });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ mt: 4, p: 2, border: '1px solid #eee', borderRadius: 2 }}>
      <Typography variant="h6" gutterBottom>
        API Connection Test
      </Typography>
      
      <Button 
        variant="contained" 
        onClick={runTest}
        disabled={loading}
        sx={{ mb: 2 }}
      >
        {loading ? <CircularProgress size={24} /> : 'Test API Connection'}
      </Button>
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      {testResult && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="body1">
            Status: {testResult.success ? 'Connected' : 'Failed'}
          </Typography>
          {testResult.data && (
            <Typography variant="body2" component="pre" sx={{ mt: 1, p: 1, bgcolor: '#f5f5f5', borderRadius: 1, overflow: 'auto' }}>
              {JSON.stringify(testResult.data, null, 2)}
            </Typography>
          )}
        </Box>
      )}
    </Box>
  );
};

export default ApiTest; 