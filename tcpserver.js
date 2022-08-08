const net = require("net");
const tcpServer = net.createServer();
const tcpPort = 1500;

// クライアントの情報を配列で管理する
const clients = [];
// clients[0]:host
// clients[1]:IchigoJam

// Webサーバー（webServer.js）にエクスポート
exports.relayServer = (tcpPort) => {
    
    // クライアントからTCP接続した時の処理
    tcpServer.on("connection", (socket) => {
        
        // 1台目のクライアントが接続した時
        if(clients.length == 0){
            clients.push(socket);
            console.log("host is conected.")
            console.log("wait IchigoJam connection...");
        // 2台目のクライアントが接続した時
        }else if(clients.length == 1){
            clients.push(socket);
            console.log("IchigoJam is connected.");
            console.log("Ready to connect!");
        // 3台目以上のクライアントが接続しようとした時
        }else {
            console.log("aleady to conected...");
            socket.write("'another ichigojam alrady conected...\n");
        }

        // クライアントからデータを受信した時
        socket.on("data", (data) => {
            let DATA = data.toString();

            //データの送信先がない時
            if(clients.length == 1) return true;
            
            // 送信元がブラウザの時
            if(socket == clients[0]){
                clients[1].write(DATA + "\n");
                console.log("host > " + DATA);
            // 送信元がIchigoJamの時
            }else{
                console.log("IchigoJam > " + DATA);
            }
       });

    });

    tcpServer.listen(tcpPort, () => {
        console.log(`listening on tcp server ${tcpPort}`);
    });

}
