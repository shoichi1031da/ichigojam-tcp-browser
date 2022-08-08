// フレームワーク（express）の読み込み
const express = require("express");
const app = express();
const webPort = 3000;

// POSTメソッドによるJSON形式のデータを取得するためのミドルウェア
app.use(express.json());
app.use(express.urlencoded({
    extended: false
}));

// TCPサーバー（tcpSerber.js）の設定、モジュールの読み込み
const tcpPort = 1500;
const tcpServer = require("./tcpServer.js");
tcpServer.relayServer(tcpPort);

// TCPサーバー（tcpServer.js）とクライアント（host）の接続
const net = require("net");
const client = new net.Socket();
client.connect(tcpPort,"localhost");

// ブラウザからのGETリクエストに対する処理
app.get("/", (req,res) => {
    res.sendFile(__dirname + "/index.html");
})

// ブラウザからのPOSTリクエストに対する処理
app.post("/", (req,res) => {
    const code = req.body.code;
    client.write(code);
    res.sendFile(__dirname + "/index.html");
})

// webサーバーの起動
app.listen(webPort, () => {
    console.log(`listening on web server ${webPort}`);
})