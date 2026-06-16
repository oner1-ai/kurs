import fs from 'fs/promises';
import readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const ask = (q) => new Promise(resolve => {
  rl.question(q, resolve);
});

async function main() {
  let data = [];
  try { 
    data = JSON.parse(await fs.readFile('data.json')); 
  } catch(e) {}

  while (true) {
    console.log('\n1. Создать 2. Список 3. Найти 4. Удалить 5. Выход');
    const choice = await ask('> ');
    
    if (choice === '1') {
      const title = await ask('Название: ');
      const content = await ask('Текст: ');
      const tagsInput = await ask('Теги (через запятую): ');
      const tags = tagsInput.split(',').map(t => t.trim());
      data.push({ id: Date.now(), title, content, tags });
      await fs.writeFile('data.json', JSON.stringify(data, null, 2));
      console.log(' Создано!');
    }
    else if (choice === '2') {
      if (data.length === 0) {
        console.log(' Нет записей');
      } else {
        data.forEach((item, i) => {
          console.log(`${i+1}. ${item.title} [${item.tags.join(', ')}]`);
        });
      }
    }
    else if (choice === '3') {
      const tag = await ask('Тег для поиска: ');
      const found = data.filter(item => item.tags.includes(tag));
      if (found.length === 0) {
        console.log(' Не найдено');
      } else {
        console.log(` Найдено ${found.length}:`);
        found.forEach(item => console.log(`${item.title}: ${item.content}`));
      }
    }
    else if (choice === '4') {
      if (data.length === 0) {
        console.log(' Нет записей');
      } else {
        data.forEach((item, i) => console.log(`${i+1}. ${item.title}`));
        const num = parseInt(await ask('Номер для удаления: ')) - 1;
        if (num >= 0 && num < data.length) {
          data.splice(num, 1);
          await fs.writeFile('data.json', JSON.stringify(data, null, 2));
          console.log(' Удалено!');
        } else {
          console.log(' Неверный номер');
        }
      }
    }
    else if (choice === '5') {
      console.log(' Пока!');
      rl.close();
      process.exit();
    }
  }
}

main();