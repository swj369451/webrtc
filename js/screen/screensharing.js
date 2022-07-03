/*
 * @Author: swj369451 swj369451@163.com
 * @Date: 2022-07-03 14:25:43
 * @LastEditors: swj369451 swj369451@163.com
 * @LastEditTime: 2022-07-03 16:04:21
 * @FilePath: \webrtc\js\screen\screensharing.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
let screenStream;
let screensharingConfig = { video: true, audio: true };
/**
 * 投射屏幕流到指定视频标签
 * @Param VideoLabel 要展示的视频标签
 */
async function castScreenStream(VideoLabel) {
    if (screenStream == undefined && screenStream == null) {
        await getScreenStream();
    }
    if (VideoLabel == undefined || VideoLabel == null) {
        console.warn("视频控件为空，不能展示屏幕共享");
    } else {
        VideoLabel.srcObject = screenStream;
    }

}

function handleSuccess(stream) {
    screenStream = stream;
}

function handleError(error) {
    console.error(`getDisplayMedia error: ${error.name}`, error);
}

/**
 * 获取屏幕流
 */
async function getScreenStream() {
    if (screenStream != undefined && screenStream != null) {
        return screenStream;
    }
    await navigator.mediaDevices.getDisplayMedia(screensharingConfig)
        .then(handleSuccess, handleError);

}

export { castScreenStream, getScreenStream }