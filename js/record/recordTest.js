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

//录制切片
let timeslice = 500;

//保存视频时长
let recordDuration = 1000 * 60 * 5;

//保存视频定时器
let recordInterval;

let SupportedMimeTypes;
/**
 * 录制音视频流
 * @param {*} stream 流
 * @returns 
 */
async function startRecord(stream) {
    SupportedMimeTypes = getSupportedMimeTypes();
    if (SupportedMimeTypes.length == 0) {
        console.info("没有支持的录制类型");
        return;
    }
    console.info("支持的录制类型" + SupportedMimeTypes.toString());
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
        downloadBlob(recordedBlobsA, recordedStartTimeA, "A");
        recordedBlobsA = [];
    };
    mediaRecorderB.onstop = (event) => {
        downloadBlob(recordedBlobsB, recordedStartTimeB, "B");
        recordedBlobsB = [];
    };
    mediaRecorderB.onstart = ((event) => {
        mediaRecorderA.stop();
    })
    mediaRecorderA.onstart = ((Event) => {
        if (mediaRecorderB.state === "recording") {
            mediaRecorderB.stop();
        }

    })

    //切换视频缓存
    console.debug(`【视频录制】A组开始${new Date().Format("yyyy-MM-dd hh:mm:ss:SS")}`);
    mediaRecorderA.start(timeslice);
    recordInterval = setInterval(() => {
        if (flagA) {
            mediaRecorderB.start(timeslice);
            // console.debug(`【视频录制】A组开始${new Date()}`);

        } else {
            mediaRecorderA.start(timeslice);
            // console.debug(`【视频录制】A组开始${new Date()}`);
        }
        flagA = !flagA;

    }, recordDuration);

}
/**
 * 停止录制
 */
async function stopRecord() {
    if (recordInterval != undefined) {
        clearInterval(recordInterval);
    }
    if (mediaRecorderA.state === "recording") {
        mediaRecorderA.stop();
    }
    if (mediaRecorderB.state === "recording") {
        mediaRecorderB.stop();
    }
}

/**
 * 处理视频切片A
 * @param {*} event 
 */
function handleDataAvailableA(event) {
    console.log('handleDataAvailable', event);
    console.debug("【视频录制】A处理视频切片，时间" + new Date(event.timecode).Format("yyyy-MM-dd hh:mm:ss:SS"));
    if (event.data && event.data.size > 0) {

        if (recordedBlobsA.length == 0) {
            recordedStartTimeA = new Date(event.timecode - timeslice);
        }
        recordedEndTimeA = new Date(event.timecode - timeslice);
        recordedBlobsA.push(event.data);


    }
}
/**
 * 处理视频切片B
 * @param {*} event 
 */
function handleDataAvailableB(event) {
    console.log('handleDataAvailable', event);
    console.debug("【视频录制】B处理视频切片，时间" + new Date(event.timecode).Format("yyyy-MM-dd hh:mm:ss:SS"));
    if (event.data && event.data.size > 0) {
        if (recordedBlobsB.length == 0) {
            recordedStartTimeB = new Date(event.timecode - timeslice);


        }
        recordedEndTimeB = new Date(event.timecode - timeslice);
        recordedBlobsB.push(event.data);
    }
}
/**
 * 获取有效的录制格式和编码格式
 * @returns 有效的录制和编码格式
 */
function getSupportedMimeTypes() {
    const possibleTypes = [
        'video/webm;codecs=h264,opus',
        'video/mp4;codecs=h264,aac',
        'video/webm;codecs=vp9,opus',
        'video/webm;codecs=vp8,opus',
        "video/mpeg"

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
async function downloadBlob(blobs, fileName, slice) {

    const blob = new Blob(blobs, { type: SupportedMimeTypes });
    const url = window.URL.createObjectURL(blob);
    let android = window.Android;
    if (android != undefined) {
        console.log(`安卓设备下载录制视频`);
        // android.getBase64StringFromBlobUrl(url);
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.responseType = 'blob';
        xhr.onload = function (e) {
            if (this.status == 200) {
                var blobFile = this.response;
                var reader = new FileReader();
                reader.readAsDataURL(blobFile);
                reader.onloadend = function () {
                    let base64data = reader.result;
                    android.getBase64FromBlobData(base64data, `${fileName.Format("yyyy-MM-dd-hh-mm-ss-S")}.webm`);
                }
            }
        };
        xhr.send();
    } else {
        console.log(`pc设备下载录制视频`);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = fileName + slice;
        // a.download = `a`;
        document.body.appendChild(a);
        a.click();
        setTimeout(() => {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        }, 100);
    }

}




export { startRecord, stopRecord }