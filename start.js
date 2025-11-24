const { spawn } = require('child_process');

console.log('Starting json-server and Ionic app: --===>');

// Iniciar json-server
const jsonServer = spawn('npx', ['json-server', '--watch', 'src/assets/data/characters.json', '--port', '3000'], {
  stdio: 'inherit',
  shell: true
});

// Esperar 2 segundos y luego iniciar Ionic
setTimeout(() => {
  const ionic = spawn('npx', ['ionic', 'serve'], {
    stdio: 'inherit',
    shell: true
  });

  ionic.on('close', (code) => {
    console.log(`Ionic process exited with code ${code}`);
    jsonServer.kill();
  });
}, 2000);

jsonServer.on('close', (code) => {
  console.log(`JSON Server process exited with code ${code}`);
});