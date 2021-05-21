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
        path: 'src/sketches/{{kebabCase name}}/{{pascalCase name}}.js',
        templateFile: 'plop-templates/sketch.hbs',
      },
    ],
  });
};
