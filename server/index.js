const http = require('http');
const url = require('url');

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

// Данные пользователей (в памяти)
const users = [
    { id: 1, username: 'user', password: 'password', email: 'user@example.com', name: 'User' },
    { id: 2, username: 'admin', password: 'admin123', email: 'admin@example.com', name: 'Admin' }
];

// Данные заказов (в памяти)
let orders = [];
let orderIdCounter = 1;

// Токены авторизации (в памяти)
const activeTokens = new Map();

const server = http.createServer((req, res) => {
    // Логирование запросов
    console.log(`${req.method} ${req.url}`);
    
    // Настройка CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
    // Обработка preflight запросов
    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }
    
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;
    
    // Обработка API запросов
    if (pathname.startsWith('/api')) {
        console.log(`API Request: ${pathname}`);
        
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
                    console.log(`Login attempt: ${username} / ${password}`);
                    
                    // Поиск пользователя
                    const user = users.find(u => 
                        u.username === username && u.password === password
                    );
                    
                    if (user) {
                        // Создание токена
                        const token = 'fake-jwt-token-' + Date.now() + '-' + user.id;
                        activeTokens.set(token, user.id);
                        
                        console.log(`Login successful for user: ${username}`);
                        
                        res.writeHead(200, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({
                            success: true,
                            token: token,
                            user: { 
                                id: user.id,
                                username: user.username, 
                                name: user.name,
                                email: user.email
                            }
                        }));
                    } else {
                        console.log(`Login failed for user: ${username}`);
                        
                        res.writeHead(401, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({
                            success: false,
                            error: 'Неверное имя пользователя или пароль'
                        }));
                    }
                } catch (error) {
                    console.error('Login error:', error);
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({
                        success: false,
                        error: 'Неверный формат запроса'
                    }));
                }
            });
            
            return;
        }
        
        // Эндпоинт для регистрации
        if (pathname === '/api/register' && req.method === 'POST') {
            let body = '';
            req.on('data', chunk => {
                body += chunk.toString();
            });
            
            req.on('end', () => {
                try {
                    const { username, password, email } = JSON.parse(body);
                    console.log(`Register attempt: ${username}`);
                    
                    // Проверка существования пользователя
                    const existingUser = users.find(u => u.username === username);
                    if (existingUser) {
                        res.writeHead(400, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({
                            success: false,
                            error: 'Пользователь с таким именем уже существует'
                        }));
                        return;
                    }
                    
                    // Проверка email
                    const existingEmail = users.find(u => u.email === email);
                    if (existingEmail) {
                        res.writeHead(400, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({
                            success: false,
                            error: 'Email уже используется'
                        }));
                        return;
                    }
                    
                    // Создание нового пользователя
                    const newUser = {
                        id: users.length + 1,
                        username: username,
                        password: password,
                        email: email,
                        name: username
                    };
                    
                    users.push(newUser);
                    console.log(`User registered: ${username}`);
                    
                    res.writeHead(201, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({
                        success: true,
                        user: {
                            id: newUser.id,
                            username: newUser.username,
                            email: newUser.email,
                            name: newUser.name
                        }
                    }));
                } catch (error) {
                    console.error('Register error:', error);
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({
                        success: false,
                        error: 'Неверный формат запроса'
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
                const userId = activeTokens.get(token);
                
                if (userId) {
                    const user = users.find(u => u.id === userId);
                    if (user) {
                        res.writeHead(200, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({
                            authenticated: true,
                            user: { 
                                id: user.id,
                                username: user.username, 
                                name: user.name,
                                email: user.email
                            }
                        }));
                        return;
                    }
                }
            }
            
            res.writeHead(401, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ authenticated: false }));
            return;
        }
        
        // Эндпоинт для создания заказа
        if (pathname === '/api/orders' && req.method === 'POST') {
            const authHeader = req.headers.authorization;
            
            if (!authHeader || !authHeader.startsWith('Bearer ')) {
                res.writeHead(401, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Требуется авторизация' }));
                return;
            }
            
            const token = authHeader.substring(7);
            const userId = activeTokens.get(token);
            
            if (!userId) {
                res.writeHead(401, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Недействительный токен' }));
                return;
            }
            
            const user = users.find(u => u.id === userId);
            
            let body = '';
            req.on('data', chunk => {
                body += chunk.toString();
            });
            
            req.on('end', () => {
                try {
                    const orderData = JSON.parse(body);
                    console.log(`Creating order for user: ${user.username}`);
                    
                    // Создание нового заказа
                    const newOrder = {
                        id: orderIdCounter++,
                        userId: userId,
                        userName: user.name,
                        items: orderData.items,
                        totalAmount: orderData.totalAmount,
                        customerInfo: orderData.customerInfo,
                        paymentMethod: orderData.paymentMethod,
                        status: 'pending',
                        createdAt: new Date().toISOString(),
                        updatedAt: new Date().toISOString()
                    };
                    
                    orders.push(newOrder);
                    
                    res.writeHead(201, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({
                        success: true,
                        order: newOrder
                    }));
                } catch (error) {
                    console.error('Create order error:', error);
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({
                        success: false,
                        error: 'Неверный формат запроса'
                    }));
                }
            });
            
            return;
        }
        
        // Эндпоинт для получения заказов пользователя
        if (pathname === '/api/orders' && req.method === 'GET') {
            const authHeader = req.headers.authorization;
            
            if (!authHeader || !authHeader.startsWith('Bearer ')) {
                res.writeHead(401, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Требуется авторизация' }));
                return;
            }
            
            const token = authHeader.substring(7);
            const userId = activeTokens.get(token);
            
            if (!userId) {
                res.writeHead(401, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Недействительный токен' }));
                return;
            }
            
            // Фильтрация заказов для текущего пользователя
            const userOrders = orders
                .filter(order => order.userId === userId)
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({
                orders: userOrders
            }));
            
            return;
        }
        
        // Если API маршрут не найден
        console.log(`API endpoint not found: ${pathname}`);
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'API endpoint not found' }));
        return;
    }
    
    // Обработка остальных запросов
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('MusicShop Server is running');
});

const PORT = 3001;
server.listen(PORT, () => {
    console.log(`=================================`);
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
    console.log(`📦 API available at http://localhost:${PORT}/api`);
    console.log(`=================================`);
    console.log(`Available API endpoints:`);
    console.log(`  GET    /api/goods          - Получение списка товаров`);
    console.log(`  POST   /api/login          - Авторизация`);
    console.log(`  POST   /api/register       - Регистрация`);
    console.log(`  GET    /api/check-auth     - Проверка авторизации`);
    console.log(`  POST   /api/orders         - Создание заказа`);
    console.log(`  GET    /api/orders         - Получение списка заказов`);
    console.log(`=================================`);
    console.log(`Test credentials:`);
    console.log(`  Username: user     Password: password`);
    console.log(`  Username: admin    Password: admin123`);
    console.log(`=================================`);
});

// Обработка ошибок сервера
server.on('error', (error) => {
    if (error.code === 'EADDRINUSE') {
        console.error(`Port ${PORT} is already in use. Please close the application using this port or use a different port.`);
    } else {
        console.error('Server error:', error);
    }
});