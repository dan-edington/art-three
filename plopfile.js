module.exports = function (plop) {
  // controller generator
  plop.setGenerator('controller', {
    description: 'new sketch',
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: 'name',
      },
    ],
    actions: [
      {
        type: 'add',
        path: 'src/sketches/{{name}}/{{name}}.ts',
        templateFile: 'plop-templates/sketch.hbs',
      },
    ],
  });
};
