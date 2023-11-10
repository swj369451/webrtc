视频设置：
- width: 视频宽度（像素）
- height: 视频高度（像素）
- frameRate: 帧率（每秒显示的帧数）
- bitrate: 码率（每秒钟传输的比特数）
- resolution: 分辨率（宽高比，例如16:9或4:3）
- aspectRatio: 宽高比（与分辨率相同）
- minWidth: 最小视频宽度（像素）
- maxWidth: 最大视频宽度（像素）
- minHeight: 最小视频高度（像素）
- maxHeight: 最大视频高度（像素）
- facingMode: 摄像头方向（"user"、"environment"或"none"）
- deviceId: 设备ID（可选）
- groupId: 分组ID（可选）
- frameRateRange: 可用帧率范围（数组）
- videoConstraints: 视频约束对象（包含上述属性的对象）

音频设置：audio
- sampleRate: 采样率（每秒采样数）
- channels: 声道数（单声道为1，立体声为2）
- echoCancellation: 回声消除（布尔值）
- noiseSuppression: 噪声抑制（布尔值）
- autoGainControl: 自动增益控制（布尔值）
- gainControl: 增益控制（布尔值）
- latency: 延迟（毫秒）
- audioConstraints: 音频约束对象（包含上述属性的对象）
- enable:是否开启（自己定义的）

