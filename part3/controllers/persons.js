const personsRouter = require('express').Router();
const Person = require('../models/person');

personsRouter.get('/', (request, response) => {
  Person.find({}).then((persons) => {
    response.json(persons);
  });
});

personsRouter.post('/', (request, response, next) => {
  const { name, number } = request.body;

  Person.find({ name })
    .then((persons) => {
      if (persons.length > 0) {
        console.log('something...');
        return response.status(400).json({
          error: 'name must be unique',
        });
      }

      const person = new Person({
        name,
        number,
      });

      person
        .save()
        .then((savedPerson) => {
          response.json(savedPerson);
        })
        .catch((error) => next(error));
    })
    .catch((error) => {
      console.log(error);
      return response.status(500).end();
    });
});

personsRouter.get('/info', async (request, response) => {
  const currentTime = new Date();
  const persons = await Person.find({}); // 异步函数, 等待查询完成
  response.send(
    `<p>Phonebook has info for ${persons.length} people<br/>${currentTime}</p>`,
  );
});

personsRouter.get('/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then((person) => {
      console.log(person);
      if (person) return response.json(person);
      return response.status(404).end();
    })
    .catch((error) => next(error));
});

personsRouter.put('/:id', (request, response, next) => {
  const { name, number } = request.body;

  Person.findByIdAndUpdate(
    request.params.id,
    { number },
    { new: true, runValidators: true, context: 'query' },
  )
    .then((updatedPerson) => {
      response.json(updatedPerson);
    })
    .catch((error) => next(error));
});

personsRouter.delete('/:id', (request, response) => {
  Person.findByIdAndDelete(request.params.id)
    .then(() => {
      // 成功删除/删除不存在资源都会返回 204
      response.status(204).end();
    })
    .catch((error) => {
      console.log(error);
      response.status(500).end();
    });
});

module.exports = personsRouter;
