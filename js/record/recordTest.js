import { getUserMeida } from "../media/UserMedia.js";

//A组视频缓存
let recordedBlobsA = [];
let recordedStartTimeA;
let recordedEndTimeA;

//B组视频缓存
let recordedBlobsB = [];
let recordedStartTimeB;
let recordedEndTimeB;

//切换缓存
let flagA = true;
let mediaRecorderA;
let mediaRecorderB;
// let firstBlob;
let init = false;

//录制切片
let timeslice = 1000;

//保存视频时长
let recordDuration = 1000 * 5;

//保存视频定时器
let recordInterval;

/**
 * 录制音视频流
 * @param {*} stream 流
 * @returns 
 */
async function reocord(stream) {
    let SupportedMimeTypes = getSupportedMimeTypes();
    if (SupportedMimeTypes.length == 0) {
        console.info("没有支持的录制类型");
        return;
    }
    console.info("支持的录制类型" + SupportedMimeTypes);
    try {
        mediaRecorderA = new MediaRecorder(stream, { mimeType: SupportedMimeTypes[0] });
        mediaRecorderB = new MediaRecorder(stream.clone(), { mimeType: SupportedMimeTypes[0] });
    } catch (e) {
        console.error('Exception while creating MediaRecorder:', e);
        return;
    }

    mediaRecorderA.ondataavailable = handleDataAvailableA;
    mediaRecorderB.ondataavailable = handleDataAvailableB;
    mediaRecorderA.onstop = (event) => {
        downloadBlob(recordedBlobsA, recordedStartTimeA);
        recordedBlobsA = [];
    };
    mediaRecorderB.onstop = (event) => {
        downloadBlob(recordedBlobsB, recordedStartTimeB);
        recordedBlobsB = [];
    };



    //切换视频缓存
    console.debug(`【视频录制】A组开始${new Date()}`);
    mediaRecorderA.start(timeslice);
    recordInterval = setInterval(() => {
        if (flagA) {
            mediaRecorderA.stop();
            console.debug(`【视频录制】A组开始${new Date()}`);
            mediaRecorderB.start(timeslice);
        } else {
            mediaRecorderB.stop();
            console.debug(`【视频录制】A组开始${new Date()}`);
            mediaRecorderA.start(timeslice);
        }
        flagA = !flagA;

    }, recordDuration);

}


/**
 * 处理视频切片
 * @param {*} event 
 */
function handleDataAvailableA(event) {
    console.log('handleDataAvailable', event);
    console.debug("【视频录制】处理视频切片，时间" + new Date(event.timecode));
    if (event.data && event.data.size > 0) {

        if (recordedBlobsA.length == 0) {
            recordedStartTimeA = new Date(event.timecode);
        }
        recordedEndTimeA = new Date(event.timecode);
        recordedBlobsA.push(event.data);


    }
}

function handleDataAvailableB(event) {
    console.log('handleDataAvailable', event);
    // console.debug("【视频录制】处理视频切片，时间" + new Date(event.timecode));
    if (event.data && event.data.size > 0) {
        if (recordedBlobsB.length == 0) {
            recordedStartTimeB = new Date(event.timecode);
        }
        recordedEndTimeB = new Date(event.timecode);
        recordedBlobsB.push(event.data);
    }
}
/**
 * 获取有效的录制格式和编码格式
 * @returns 有效的录制和编码格式
 */
function getSupportedMimeTypes() {
    const possibleTypes = [
        'video/webm;codecs=vp9,opus',
        'video/webm;codecs=vp8,opus',
        'video/webm;codecs=h264,opus',
        'video/mp4;codecs=h264,aac',
    ];
    return possibleTypes.filter(mimeType => {
        return MediaRecorder.isTypeSupported(mimeType);
    });
}
/**
 * 下载blobs视频
 * @param {*} blobs  视频缓存
 * @param {*} fileName  下载文件名
 */
function downloadBlob(blobs, fileName) {
    const blob = new Blob(blobs, { type: 'video/webm;codecs=vp9,opus' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = `${fileName.toLocaleDateString()} - ${fileName.toLocaleTimeString()}`;
    // a.download = `a`;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    }, 100);
}


const downloadButton = document.querySelector('button#record');
downloadButton.addEventListener('click', async(event) => {
    let buttonText = event.currentTarget.innerText;
    if (buttonText === "开启录制") {
        let stream = await getUserMeida();
        await reocord(stream);
        event.currentTarget.innerText = "停止录制";
    } else {
        if (recordInterval != undefined) {
            clearInterval(recordInterval);

        }
        if (mediaRecorderA.state === "recording") {
            mediaRecorderA.stop();
        }
        if (mediaRecorderB.state === "recording") {
            mediaRecorderB.stop();
        }

        event.currentTarget.innerText = "开启录制";
    }

});

export { reocord }