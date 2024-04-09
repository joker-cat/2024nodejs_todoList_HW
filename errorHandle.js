function errorHandle(res, status, error) {
  const headers = {
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, Content-Length, X-Requested-With',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'PATCH, POST, GET,OPTIONS,DELETE',
    'Content-Type': 'application/json'
  }
  res.writeHead(status, headers);
  res.write(JSON.stringify({ 'status': 'fail', 'message': `${error}` }));
  res.end();
}

module.exports = errorHandle;
