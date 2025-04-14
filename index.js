
const express = require('express');
const franc = require('franc');
const app = express();
app.use(express.json());

app.post('/webhook', (req, res) => {
    const message = req.body.messages?.[0]?.text || "";
    const lang = franc(message || ''); // 检测语言代码
    const detected = lang === 'cmn' || /[\u4e00-\u9fa5]/.test(message) ? 'zh' : 'en';

    console.log("用户输入：", message, "→ 检测语言：", detected);

    res.json({
        metadata: {
            language: detected
        }
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Webhook listening on port ${PORT}`);
});
