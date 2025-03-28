import '../styles/TaskList.css';
import { useState, useEffect } from 'react';
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";

const TaskCard = ({task, handleTaskCompletion, priorityClass}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [iconSize, setIconSize] = useState(22);
    
    // Handle responsive sizing
    useEffect(() => {
      const handleResize = () => {
        setIconSize(window.innerWidth <= 768 ? 18 : 22);
      };
      
      handleResize(); // Initial check
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }, []);
    
    const toggleDetails = () => {
        setIsOpen(prevIsOpen => !prevIsOpen);
    };

  return (
    <li
      className={`taskcard ${priorityClass} ${task.fadingOut ? "fade-out" : "fade-in"}`}
      key={task.id}
    >     
        <div onClick={toggleDetails} className='arrows'>
            {isOpen ? <IoIosArrowUp size={iconSize} /> : <IoIosArrowDown size={iconSize}/> }
        </div>
      
      <div className="priority-strip"></div>

      <div className="task-header">
        <strong className={task.addingLineThrough ? "crossed-out" : ""} style={{ marginRight: '10px' }}>
          {task.title}
        </strong>- {task.dueDate}

        <input
          type="checkbox"
          checked={task.completed}
          onChange={() => handleTaskCompletion(task.id, task.completed)}
          className="task-checkbox"
        />
      </div>

      <div className={`task-details ${isOpen ? "open" : "closed"}`}>
        <p>{task.description}</p>
        <span>Estimated Time: {task.estimatedTime} hrs</span>

        {/* Display task categories when the arrow is clicked */}
        {task.categories && task.categories.length > 0 && (
          <div className="task-categories">
            <strong>Categories: </strong>
            <ul>
              {task.categories.map((category, index) => (
                <li key={index}>{category}</li>
              ))}
            </ul>
          </div>
)}
      </div>
    </li>
  );
};

export default TaskCard;
