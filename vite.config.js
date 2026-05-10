const fs = require('node:fs');
const path = require('node:path');

module.exports = {
  plugins: [
    {
      name: 'copy-scene-assets',
      closeBundle() {
        const source = path.resolve(__dirname, 'scene');
        const target = path.resolve(__dirname, 'dist', 'scene');

        fs.rmSync(target, { recursive: true, force: true });
        fs.cpSync(source, target, { recursive: true });
      },
    },
  ],
};
