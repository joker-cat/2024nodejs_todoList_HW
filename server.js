const http = require('http');
const { title } = require('process');
const { v4: uuidv4 } = require('uuid')
const errorHandle = require('./errorHandle')

const myLists = [];
const headers = {
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, Content-Length, X-Requested-With',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'PATCH, POST, GET,OPTIONS,DELETE',
  'Content-Type': 'application/json'
}

const resServer = (req, res) => {
  if (req.url === '/favicon.ico') return;
  let body = '';

  req.on('data', chunk => {
    body += chunk;
  });

  if (req.url === '/todos' && req.method === 'GET') {
    res.writeHead(200, headers);
    res.write(JSON.stringify({ 'status': 'success', 'message': myLists }));
    res.end();
  }
  else if (req.url === '/todos' && req.method === 'POST') {
    req.on('end', () => {
      try {
        const title = JSON.parse(body).title;
        if (title !== undefined) {
          const id = uuidv4();
          myLists.push({ title, id });
          res.writeHead(200, headers);
          res.write(JSON.stringify({ 'status': 'success', 'message': myLists }));
          res.end();
        } else {
          errorHandle(res, 400, '輸入應為具有 title key 值的 JSON 格式');
        }
      } catch (error) {
        errorHandle(res, 400, '資料應為JSON格式')
      }
    })
  }
  else if (req.url === '/todos' && req.method === 'DELETE') {
    myLists.length = 0;
    res.writeHead(200, headers);
    res.write(JSON.stringify({ 'status': 'success', 'message': myLists }));
    res.end();
  }
  else if (req.url.startsWith('/todos/') && req.method === 'DELETE') {
    const urlId = req.url.split('/').pop();
    const index = myLists.findIndex(ele => ele.id === urlId);
    if (index > -1) {
      myLists.splice(index, 1);
      res.writeHead(200, headers);
      res.write(JSON.stringify({ 'status': 'success', 'message': myLists }));
      res.end();
    } else {
      errorHandle(res, 400, '找不到指定刪除的資料')
    }
  }
  else if (req.url.startsWith('/todos/') && req.method === 'PATCH') {
    console.log(req.url);
    req.on('end', () => {
      try {
        const getTitle = JSON.parse(body).title;
        const id = req.url.split('/').pop();
        const index = myLists.findIndex(ele => ele.id === id);
        if (getTitle !== undefined && index !== -1) {
          myLists[index].title = getTitle;
          res.writeHead(200, headers);
          res.write(JSON.stringify({ 'status': 'success', 'message': myLists }));
          res.end();
        } else {
          errorHandle(res, 400, '缺少title，或是找不到修改事項')
        }
      } catch (error) {
        errorHandle(res, 400, '更改格式錯誤')
      }
    })
  }
  else if (req.method === 'OPTIONS') {
    res.writeHead(200, headers);
    res.end();
  }
  else {
    res.writeHead(404, headers);
    res.write(JSON.stringify({ 'status': 'success', 'data': 'not found' }));
    res.end();
  }
}

const server = http.createServer(resServer);
server.listen(3005, () => {
  console.log('listen port: 3005');
});
