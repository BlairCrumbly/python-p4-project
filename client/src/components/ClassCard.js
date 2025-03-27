import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';

const ClassCard = ({ klass, onClick }) => {
  if (!klass) {
    return <div>Loading...</div>; // Or return some fallback UI if klass is undefined
  }

  return (
    <Card onClick={onClick} style={{ cursor: 'pointer' }}>
      <CardContent>
        <Typography variant="h5">{klass.name || "Class Name"}</Typography>
        {/* Add any other details about the class */}
        <Typography variant="body2" color="textSecondary">
          {klass.description || "No description available"}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default ClassCard;
