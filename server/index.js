const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');

// Данные о музыкальных инструментах
const instruments = [
    // Гитары
    { id: 1, name: 'Fender Stratocaster', releaseDate: '1970-01-15', price: 89999.99, category: 'guitars' },
    { id: 2, name: 'Gibson Les Paul', releaseDate: '1969-02-20', price: 129999.99, category: 'guitars' },
    { id: 3, name: 'Ibanez RG550', releaseDate: '2010-03-10', price: 74999.99, category: 'guitars' },
    { id: 4, name: 'Yamaha Pacifica', releaseDate: '2015-04-05', price: 39999.99, category: 'guitars' },
    { id: 5, name: 'Palker Berserker', releaseDate: '2023-05-12', price: 31999.99, category: 'guitars' },
    
    // Клавишные
    { id: 6, name: 'Yamaha P-125', releaseDate: '2018-01-25', price: 64999.99, category: 'keyboards' },
    { id: 7, name: 'Roland FP-30X', releaseDate: '2000-02-28', price: 79999.99, category: 'keyboards' },
    { id: 8, name: 'Korg B2', releaseDate: '1999-03-18', price: 54999.99, category: 'keyboards' },
    { id: 9, name: 'Casio PX-S1100', releaseDate: '1998-04-22', price: 59999.99, category: 'keyboards' },
    { id: 10, name: 'Nord Piano 5', releaseDate: '2005-05-08', price: 329999.99, category: 'keyboards' },
    { id: 11, name: 'Nord Piano 6', releaseDate: '2007-04-28', price: 429999.99, category: 'keyboards' }
];

const server = http.createServer((req, res) => {

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }
    
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;
    
    if (pathname.startsWith('/api')) {
        // Эндпоинт для получения товаров
        if (pathname === '/api/goods' && req.method === 'GET') {
            const page = parseInt(parsedUrl.query.page) || 1;
            const limit = parseInt(parsedUrl.query.limit) || 10;
            const category = parsedUrl.query.category;
            
            // Фильтрация по категории
            let filteredInstruments = instruments;
            if (category && category !== 'all' && category !== 'undefined') {
                filteredInstruments = instruments.filter(item => item.category === category);
            }
            
            // Пагинация
            const startIndex = (page - 1) * limit;
            const endIndex = page * limit;
            const paginatedItems = filteredInstruments.slice(startIndex, endIndex);
            
            setTimeout(() => {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({
                    items: paginatedItems,
                    total: filteredInstruments.length,
                    page: page,
                    limit: limit,
                    hasMore: endIndex < filteredInstruments.length
                }));
            }, 500);
            
            return;
        }
        
        // Эндпоинт для авторизации
        if (pathname === '/api/login' && req.method === 'POST') {
            let body = '';
            req.on('data', chunk => {
                body += chunk.toString();
            });
            
            req.on('end', () => {
                try {
                    const { username, password } = JSON.parse(body);
                    
                    if (username && password && username.length > 0 && password.length > 0) {
                        res.writeHead(200, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({
                            success: true,
                            token: 'fake-jwt-token-' + Date.now(),
                            user: { username: username, name: username }
                        }));
                    } else {
                        res.writeHead(401, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({
                            success: false,
                            error: 'Invalid credentials'
                        }));
                    }
                } catch (error) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({
                        success: false,
                        error: 'Invalid request'
                    }));
                }
            });
            
            return;
        }
        
        // Эндпоинт для проверки авторизации
        if (pathname === '/api/check-auth' && req.method === 'GET') {
            const authHeader = req.headers.authorization;
            
            if (authHeader && authHeader.startsWith('Bearer ')) {
                const token = authHeader.substring(7);
                if (token.startsWith('fake-jwt-token-')) {
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({
                        authenticated: true,
                        user: { username: 'user', name: 'Music Lover' }
                    }));
                } else {
                    res.writeHead(401, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ authenticated: false }));
                }
            } else {
                res.writeHead(401, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ authenticated: false }));
            }
            
            return;
        }
        
        // Если API маршрут не найден
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'API endpoint not found' }));
        return;
    }
    
    const filePath = path.join(__dirname, '../client/public', 'index.html');
    
    fs.readFile(filePath, (err, data) => {
        if (err) {
            res.writeHead(200, { 'Content-Type': 'text/plain' });
            res.end('MusicShop Server');
            return;
        }
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(data);
    });
});

const PORT = 3001;
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log(`API available at http://localhost:${PORT}/api/goods`);
});