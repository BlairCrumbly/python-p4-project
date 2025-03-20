import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Paper, Typography } from '@mui/material';
import '../styles/TaskCategoryBarChart.css';

// TaskCategoryBarChart Component
const TaskCategoryBarChart = ({ tasks }) => {
  const [chartHeight, setChartHeight] = useState(300);
  const [containerWidth, setContainerWidth] = useState('70%');
  const [typographySize, setTypographySize] = useState('h4');
  
  // Handle responsive sizing
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        setChartHeight(250);
        setContainerWidth('100%');
        setTypographySize('h5');
      } else {
        setChartHeight(300);
        setContainerWidth('70%');
        setTypographySize('h4');
      }
    };
    
    handleResize(); // Initial check
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  const colorPriority = (task) => {
    const today = new Date();
    const dueDate = new Date(task.dueDate);
    const redZone = 7;
    const yellowZone = 14;

    if (dueDate < today && dueDate.getDay() !== today.getDay()) {
      return 'overdue';
    }
    const differenceInDays = Math.floor((dueDate - today) / (1000 * 60 * 60 * 24));

    if (differenceInDays < redZone) {
      return 'red';
    } else if (differenceInDays < yellowZone && differenceInDays >= redZone) {
      return 'yellow';
    } else {
      return 'green';
    }
  };
  
  const categories = {
    green: 0,
    red: 0,
    yellow: 0,
    overdue: 0,
  };

  // Categorize tasks
  tasks.forEach((task) => {
    const priority = colorPriority(task);
    if (priority === 'overdue') {
      categories.overdue++;
    } else if (priority === 'red') {
      categories.red++;
    } else if (priority === 'yellow') {
      categories.yellow++;
    } else if (priority === 'green') {
      categories.green++;
    }
  });

  // Prepare data for the bar chart
  const data = [
    { category: 'Green', count: categories.green },
    { category: 'Red', count: categories.red },
    { category: 'Yellow', count: categories.yellow },
    { category: 'Overdue', count: categories.overdue },
  ];

  return (
    <Paper elevation={3} style={{ padding: '20px', marginBottom: '20px' }} className="chart-paper">
      <Typography variant={typographySize} align="center" gutterBottom className="chart-title">
        Task Category Overview
      </Typography>
      <ResponsiveContainer width={containerWidth} height={chartHeight} style={{ marginLeft: window.innerWidth <= 768 ? '0' : '15%' }} className="chart-container">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="category" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="count" fill="purple" />
        </BarChart>
      </ResponsiveContainer>
    </Paper>
  );
};

export default TaskCategoryBarChart;