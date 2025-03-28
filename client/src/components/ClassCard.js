import React from 'react';
import { Card, CardContent } from '@mui/material';
import '../styles/ClassCard.css'; 

const ClassCard = ({ klass, onClick }) => {
  if (!klass) {
    return <div>Loading...</div>; 
  }

  return (
    <Card onClick={onClick} className="class-card">
      <CardContent className="card-content">
        <div className="card-top">
          <h3 className="class-name">{klass.name || "Class Name"}</h3>
        </div>
        <div className="card-bottom">
          <p className="class-description">{klass.description || "No description available"}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ClassCard;
