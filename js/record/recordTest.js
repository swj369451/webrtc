let recordedBlobs = [];
let mediaRecorder;

function reocord(stream) {
    let SupportedMimeTypes = getSupportedMimeTypes();
    if (SupportedMimeTypes.length == 0) {
        console.info("没有支持的录制类型");
        return;
    }

    console.info("支持的录制类型" + SupportedMimeTypes);
    try {
        mediaRecorder = new MediaRecorder(stream, { mimeType: SupportedMimeTypes[0] });
    } catch (e) {
        console.error('Exception while creating MediaRecorder:', e);
        return;
    }
    mediaRecorder.ondataavailable = handleDataAvailable;
    mediaRecorder.start(1000);
}

function handleDataAvailable(event) {
    console.log('handleDataAvailable', event);
    if (event.data && event.data.size > 0) {
        recordedBlobs.push(event.data);
    }
}

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
const downloadButton = document.querySelector('button#download');
downloadButton.addEventListener('click', () => {
    const blob = new Blob(recordedBlobs, { type: 'video/mp4' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = 'test.webm';
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    }, 100);
});
export { reocord }