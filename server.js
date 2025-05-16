'use strict';

const express = require('express');
const store = require('./index');
require('dotenv').config();

// 检查API密钥是否设置
if (!process.env.API_KEY) {
  console.error('API_KEY environment variable is not set');
  process.exit(1);
}

const app = express();
const PORT = process.env.PORT || 8081;

// API密钥验证中间件
const authMiddleware = (req, res, next) => {
  const apiKey = req.headers['x-api-key'];

  if (!apiKey || apiKey !== process.env.API_KEY) {
    return res.status(401).json({
      error: 'Unauthorized - Invalid API Key'
    });
  }

  next();
};

// 应用中间件
app.use(express.json());
app.use(authMiddleware);

// 路由设置
app.get('/app/:id', async (req, res) => {
  try {
    const result = await store.app({ id: req.params.id, ...req.query });
    res.json(result);
  } catch (error) {
    res.status(error.message.includes('404') ? 404 : 500).json({ error: error.message });
  }
});

app.get('/list/:collection', async (req, res) => {
  try {
    const result = await store.list({ collection: req.params.collection, ...req.query });
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/search', async (req, res) => {
  try {
    const result = await store.search(req.query);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/developer/:devId', async (req, res) => {
  try {
    const result = await store.developer({ devId: req.params.devId, ...req.query });
    res.json(result);
  } catch (error) {
    res.status(error.message.includes('404') ? 404 : 500).json({ error: error.message });
  }
});

// 添加其他端点
app.get('/privacy/:id', async (req, res) => {
  try {
    const result = await store.privacy({ id: req.params.id, ...req.query });
    res.json(result);
  } catch (error) {
    res.status(error.message.includes('404') ? 404 : 500).json({ error: error.message });
  }
});

app.get('/reviews/:id', async (req, res) => {
  try {
    const result = await store.reviews({ id: req.params.id, ...req.query });
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/similar/:id', async (req, res) => {
  try {
    const result = await store.similar({ id: req.params.id, ...req.query });
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/version-history/:id', async (req, res) => {
  try {
    const result = await store.versionHistory({ id: req.params.id, ...req.query });
    res.json(result);
  } catch (error) {
    res.status(error.message.includes('404') ? 404 : 500).json({ error: error.message });
  }
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`App Store Scraper API running on port ${PORT}`);
});