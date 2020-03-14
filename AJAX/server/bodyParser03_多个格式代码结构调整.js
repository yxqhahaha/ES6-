app.use(function(req, res, next){
	// 存储数据的数组
	let buffers = [];
	let contentType = req.headers["content-type"];
	if(req.method == "post"|| req.method == "POST"){
		req.on("data", function (data) {
			// 接收数据并存入数组中
			buffers.push(data);
		});
		req.on("end", function () {
			// 组合数据并转换成字符串
			let result = Buffer.concat(buffers).toString();
			console.log("result", result)
			// 处理数据并挂载 req.body 属性上
			if(contentType === "application/x-www-form-urlencoded"){
				req.body = querystring.parse(result);
			}else if(contentType === "application/json"){
				req.body = JSON.parse(result);
			}			
			next(); // 向下执行
		});
	}else{
		next(); // 向下执行
	}
})
