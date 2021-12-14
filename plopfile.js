module.exports = function (plop) {
  plop.setGenerator('controller', {
    description: 'new sketch',
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: 'name',
      },
      {
        type: 'list',
        name: 'sketchtype',
        message: 'Type?',
        choices: ['three.js', 'p5.js'],
      },
      {
        type: 'list',
        name: 'copyshaders',
        message: 'Copy shaders?',
        choices: ['yes', 'no'],
      },
    ],
    actions: (data) => {
      const actions = [];

      if (data.sketchtype === 'three.js') {
        actions.push({
          type: 'add',
          path: 'src/sketches/{{name}}/{{name}}.ts',
          templateFile: 'plop-templates/sketch-threejs.hbs',
        });
      } else if (data.sketchtype === 'p5.js') {
        actions.push({
          type: 'add',
          path: 'src/sketches/{{name}}/{{name}}.ts',
          templateFile: 'plop-templates/sketch-p5js.hbs',
        });
      }

      if (data.copyshaders === 'yes') {
        actions.push({
          type: 'addMany',
          destination: 'src/sketches/{{name}}/shaders',
          templateFiles: 'plop-templates/shaders/*.*',
        });
      }

      return actions;
    },
  });
};
