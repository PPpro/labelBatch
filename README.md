# 文本合批简单 demo

实现的关键点：
- 将纹理提交到不同的纹理单元
- 提交之前需要执行一次 label.updateRenderData 以更新文字纹理
- 将 texture_idx 提交到 a_position.z 上
- fillBuffer 禁止填充 a_position.z
- texture.getHash 强制返回相同的哈希值，防止打断合批