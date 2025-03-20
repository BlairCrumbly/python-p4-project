const handleSortByName = (tasks) => {
  tasks.name.sort((a, b) => a.name.localeCompare(b.name))


};

console.log(handleSortByName())