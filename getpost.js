//1. Импортируем модули.
const http = require('node:http');
const fs= require ('node:fs')

// 2.создание файла
const content = `Це нові дані для запису у файл.`;
fs.writeFile('user.txt', content,'utf8', (err) => { 
  if (err) {
    console.error(`Помилка запису файла:`, err);
    return;
  }
  console.log(`Файл user.txt записан успішно!`);
}
);

// 3.Cоздаем  HTTP сервер.
const server = http.createServer((req, res) => {
    //req - то что посылаем на сервер 
    // res- то что сервер отвечате
    console.log(`Запит до сервера`); //запрос на сервер о том что он работает 
    res.setHeader('Content-Type', 'text/plain; charset=utf-8'); //для чтения кирилицы
        //GET
    if (req.method == 'GET') {
        console.log(req.method)//получаем информацию из request , это может быть что угодно url,.. 
        // в данном случае выводится название метода GET
        fs.readFile('user.txt', 'utf8', (err, data) => { //используя File System читаем файл user.txt
            //utf8 кодировка 
            // UTF-8 (Unicode Transformation Format, 8-bit) — это система кодирования, работающая по стандарту Unicode.
            if (err) {
                console.log(`Помилка читання файлу:`, err);
                res.end();//Этот метод сигнализирует серверу, что все заголовки и тело ответа были отправлены; 
                //любой ответ нужно завершать этим методом , чтобы вернуть контроль браузеру.
            }
            else {
                res.write(`Вміст файлу: ${data}`); // данные виводятся в браузере
                res.end();
            }
            
        });
        
    }
    else if (req.method == 'POST'){
        //POST
        let body = ''; //переменная пустая для накопления информации поступающей меленькими пакетами 
        // пример: в процессе ввода текста информация передается обрывками , не ждем окончания введения всего текста 
        // т.к. объем может исчисляться в Г
        req.on('data', chunk => { //req.on('data', callback) – вызывается каждый раз, когда сервер получает кусочек данных от клиента.
            //кусочки информации -chunk-
            body += chunk.toString(); //пример из JS в "тело" добавляются кусочки информации полученной сервером и записываются
        });
        req.on('end', () => {
            console.log(body);
            fs.appendFile('user.txt', `\n${body}`, 'utf8', (err) => { //`\n${body}` - что бы данные в браузере писались с новой строки
                if (err) {
                    console.log(`Помилка запису файлу:`, err);
                    res.end();
                } else {
                    res.write(`Вміст файлу: ${body}`); // данные виводятся в браузере
                    res.end();
                }
            });
        });
    }
});

//4.создаем порт для прослушивания
server.listen(3001, 'localhost', (err) => {
    if (err) {
        console.log(`Server error:`, err);
    } else {
        console.log(`listening port 3001`);
    }
}); 