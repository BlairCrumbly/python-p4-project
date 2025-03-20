import React, { useEffect, useState } from 'react';
import { PieChart } from '@mui/x-charts';

const ProgressCircle = ({ totalTasks, completedTasks }) => {
  const [chartSize, setChartSize] = useState({ width: 400, height: 200 });
  const [innerRadius, setInnerRadius] = useState(80);
  const [outerRadius, setOuterRadius] = useState(100);
  const [textPosition, setTextPosition] = useState({ x: 170, y: 90, y2: 110 });
  const [fontSize, setFontSize] = useState({ title: '16px', percentage: '14px' });

  // Handle responsive sizing
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        setChartSize({ width: 300, height: 150 });
        setInnerRadius(60);
        setOuterRadius(75);
        setTextPosition({ x: 120, y: 70, y2: 90 });
        setFontSize({ title: '14px', percentage: '12px' });
      } else {
        setChartSize({ width: 400, height: 200 });
        setInnerRadius(80);
        setOuterRadius(100);
        setTextPosition({ x: 170, y: 90, y2: 110 });
        setFontSize({ title: '16px', percentage: '14px' });
      }
    };

    handleResize(); // Initial check
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const remainingTasks = totalTasks - completedTasks;
  const percentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  const COMPLETED_COLOR = '#4CAF50';  // green
  const REMAINING_COLOR = '#E0E0E0';  // light gray ish
  const data = [
    { id: 0, value: completedTasks || 0, label: 'Completed', color: COMPLETED_COLOR },
    { id: 1, value: remainingTasks || 1, label: 'Remaining', color: REMAINING_COLOR},
  ];

  return (
    <div className="progress-circle-container">
      <PieChart
        series={[
          {
            data,
            innerRadius: innerRadius,
            outerRadius: outerRadius,
            highlightScope: { faded: 'global', highlighted: 'item' },
            faded: { innerRadius: innerRadius, additionalRadius: -30 },
          },
        ]}
        slotProps={{
          legend: { hidden: true }
        }}
        width={chartSize.width}
        height={chartSize.height}
        margin={{ right: 65 }}
      >
        <text
          x={textPosition.x}
          y={textPosition.y}
          textAnchor="middle"
          dominantBaseline="middle"
          style={{
            fontSize: fontSize.title,
            fontWeight: 'bold',
            fill: 'white' 
          }}
        >
          Completed
        </text>
        <text
          x={textPosition.x}
          y={textPosition.y2}
          textAnchor="middle"
          dominantBaseline="middle"
          style={{
            fontSize: fontSize.percentage,
            fill: 'white' 
          }}
        >
          {percentage}%
        </text>
      </PieChart>
    </div>
  );
};

export default ProgressCircle;