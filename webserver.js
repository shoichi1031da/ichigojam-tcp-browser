// expressライブラリの読み込み
const express = require("express");
const app = express();
// ホストのポート
// const webPort = 3000;
const webPort = 80;

// POSTメソッドによるJSON形式のデータを取得するためのミドルウェア
app.use(express.json());
app.use(express.urlencoded({
    extended: false
}));

// TCPサーバー（tcpserber.js）の設定、モジュールの読み込み
const tcpPort = 1500;
const tcpServer = require("./tcpServer.js");
tcpServer.relayServer(tcpPort);

// TCPサーバー（tcpserver.js）とlocalhostの通信設定
const net = require("net");
const client = new net.Socket();
client.connect(tcpPort,"localhost");

// ブラウザからのGETリクエストに対する処理
app.get("/", (req,res) => {
    res.sendFile(__dirname + "/index.html");
})

// ブラウザからのPOSTリクエストに対する処理
app.post("/", (req,res) => {
    // formタグ内のテキストエリア（name="comannd"）内のテキストデータの取得
    const command = req.body.command;
    // TCPサーバー（tcpserver.js）に渡す
    client.write(command);
    // ブラウザ再読み込み
    res.sendFile(__dirname + "/index.html");
})

// webサーバーの起動
app.listen(webPort, () => {
    console.log(`listening on ${webPort}`);
})