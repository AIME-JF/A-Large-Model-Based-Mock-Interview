# 问题诊断与解决方案

## HTTP 400 Bad Request 错误解决方案

### 问题描述
前端调用 `/analyze-interview` 接口时出现 HTTP 400 Bad Request 错误。

### 问题原因
1. **缺少必要参数**: 前端调用时没有传递 `useStaticData` 和 `includeMultimodal` 参数
2. **参数验证失败**: 后端 Pydantic 模型验证失败
3. **字段名不匹配**: 前端发送的字段名与后端期望的不一致

### 解决方案

#### 1. 已修复的问题
- ✅ 在 `TestAnalysis.vue` 中添加了缺失的参数
- ✅ 在 `apiService.js` 中添加了参数验证
- ✅ 在后端添加了详细的错误日志

#### 2. 测试步骤
```bash
# 1. 启动后端服务器
cd q
python main.py

# 2. 测试API是否正常
python debug_request.py

# 3. 启动前端服务
cd ../realtime-quickstart-vue
npm run serve
```

#### 3. 验证修复
1. 打开浏览器访问 `http://localhost:8080`
2. 点击"测试分析功能"
3. 选择领域和岗位
4. 点击"测试静态数据分析"或"测试星火API分析"
5. 查看分析结果

### 常见问题排查

#### 1. 后端服务器无法启动
```bash
# 检查依赖
pip install -r requirements.txt

# 检查端口占用
netstat -ano | findstr :8000
```

#### 2. 前端无法连接后端
```bash
# 检查后端是否运行
curl http://localhost:8000/health

# 检查CORS配置
curl -X OPTIONS http://localhost:8000/analyze-interview
```

#### 3. API调用失败
```bash
# 使用测试脚本验证
python test_api.py

# 查看详细错误信息
python debug_request.py
```

### 调试工具

#### 1. API测试脚本
- `test_api.py`: 全面测试所有API端点
- `debug_request.py`: 简单调试单个请求
- `start_system.py`: 系统启动和测试脚本

#### 2. 浏览器开发者工具
- 打开 F12 开发者工具
- 查看 Network 标签页
- 检查请求和响应详情

#### 3. 后端日志
- 查看控制台输出的详细日志
- 检查错误堆栈信息

### 预防措施

#### 1. 前端参数验证
```javascript
// 确保所有必要参数都存在
const requestData = {
  chatHistory: params.chatHistory,
  domain: params.domain,
  role: params.role,
  useStaticData: params.useStaticData !== undefined ? params.useStaticData : false,
  includeMultimodal: params.includeMultimodal !== undefined ? params.includeMultimodal : false
};
```

#### 2. 后端错误处理
```python
# 添加详细的错误日志
print(f"收到分析请求: domain={request.domain}, role={request.role}")
print(f"聊天记录数量: {len(request.chatHistory)}")
```

#### 3. 测试覆盖
- 单元测试所有API端点
- 集成测试前后端交互
- 端到端测试完整流程

### 联系支持
如果问题仍然存在，请提供以下信息：
1. 错误日志截图
2. 浏览器开发者工具的网络请求详情
3. 后端服务器控制台输出
4. 系统环境信息（操作系统、Node.js版本、Python版本） 