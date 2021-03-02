let thoughtsArray = [{timestamp: 'today', id: '3', thought: 'hello'}];

const findThought = (id) => thoughtsArray.find((item) => item.id === id);

const addThought = (req, res) => {
  const thoughtObj = {
    thought: req.body.thought,
    timestamp: Date.now(),
    id: Math.floor(Math.random() * 1000),
  };
  thoughtsArray.push(thoughtObj);
  res.json(thoughtObj);
}
const getThoughts = (_, res) => {
  res.send(thoughtsArray);
}

const deleteThought = (req, res) => {
  const { id } = req.params.id;
  const found = findThought(id);
  if (!found) {
    res.status(400).json({ msg: `No member with the id of ${id}` });
  } else {
    thoughtsArray = thoughtsArray.filter((item) => item.id !== id);
    res.json(found);
  }
}

const editThought = (req, res) => {
  const { id } = req.params.id;
  const found = findThought(id);

  if (!found) {
    res.status(400).json({ msg: `No member with the id of ${id}` });
    return;
  }
  const { thought } = req.body;

  if (typeof thought !== 'string') {
    res.status(400).json({ msg: 'thought is not a valid string' });
    return;
  }

  thoughtsArray = thoughtsArray.map((item) => (item.id === id ? { ...item, thought } : item));
  res.json(thoughtsArray);
}

module.exports = (app) => {
  app.get('/thoughts', getThoughts);
  app.post('/thoughts', addThought);
  app.delete('/thoughts/:id', deleteThought);
  app.patch('/thoughts/:id', editThought);
}
