const express = require('express');
const { fileSocket } = require('../FileSocketClient.js');

const router = express.Router();
const userFiles = {}; 

router.post('/', async (req, res) => {
  const { userId, name, type, content, parentId } = req.body;
  
  if (!userId || !name || !type) return res.status(400).send("Missing Fields");
  if (!userFiles[userId]) userFiles[userId] = [];

  try {
    if (type === 'file') {
      const cppResponse = await fileSocket.sendCommand(`POST ${name} ${content || ''}`);

      // If C++ sends an error string, we return it and STOP (don't save)
      if (cppResponse.includes("404") || cppResponse.toLowerCase().includes("error")) {
        return res.status(400).send(cppResponse);
      }

      // Success: Save to memory and only print the C++ response
      userFiles[userId].push({ id: Date.now(), name, type, folderId: parentId || null });
      return res.send(cppResponse);
    }

    if (type === 'folder') {
      userFiles[userId].push({ id: Date.now(), name, type, parentId: parentId || null });
      return res.send("Folder created");
    }

  } catch (error) {
    return res.status(500).send(error.message);
  }
});

router.get('/', (req, res) => {
  const userId = req.query.userId;
  if (!userId || !userFiles[userId]) return res.json({ files: [] });

  const topLevel = userFiles[userId].filter(item => !item.parentId && !item.folderId);
  res.json({ files: topLevel });
});

module.exports = router;