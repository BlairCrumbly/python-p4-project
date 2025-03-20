import React from 'react';
import { useOutletContext } from "react-router-dom";
import TaskCategoryBarChart from './TaskCategoryBarChart';
import '../styles/Stats.css';

const Statistics = () => {
  // Get tasks from the context
  const { tasks } = useOutletContext();

  return (
    <div className="statistics-container">
      <TaskCategoryBarChart tasks={tasks} />
    </div>
  );
};

export default Statistics;