$(document).ready(function () {
    let mediaRecorder;
    let audioChunks = [];
    let audioBlob;
    let recordingTime = 0;
    let timerInterval;
    let audio = new Audio(); 
    const maxTime = 30; 
    function updateProgressBar() {
        $("#timer").text(recordingTime);
        let progressWidth = (recordingTime / maxTime) * 100;
        $("#progressBar").css("width", `${progressWidth}%`);
    }
    $("#startRecord").click(async function () {
        audioChunks = [];
        recordingTime = 0;
        $("#timer").text("0");
        $("#progressBar").css("width", "0%");
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorder = new MediaRecorder(stream);
        mediaRecorder.ondataavailable = event => {
            audioChunks.push(event.data);
        };
        mediaRecorder.onstop = async () => {
            clearInterval(timerInterval);
            audioBlob = new Blob(audioChunks, { type: "audio/wav" });
            const audioUrl = URL.createObjectURL(audioBlob);       
            audio.src = audioUrl;
            $("#audioPlayback").attr("src", audioUrl);
            $("#playRecord").prop("disabled", false);
        };
        mediaRecorder.start();
        $("#startRecord").prop("disabled", true);
        $("#stopRecord").prop("disabled", false);
        $("#playRecord").prop("disabled", true);
        timerInterval = setInterval(() => {
            if (recordingTime >= maxTime) {
                $("#stopRecord").click();
            } else {
                recordingTime++;
                updateProgressBar();
            }
        }, 1000);
        audio.src = "silence.mp3"; 
        audio.loop = true;
        audio.play();
    });
    $("#stopRecord").click(function () {
        mediaRecorder.stop();
        clearInterval(timerInterval);
        $("#startRecord").prop("disabled", false);
        $("#stopRecord").prop("disabled", true);
        audio.pause();
        audio.currentTime = 0;
    });
    $("#playRecord").click(function () {
        $("#audioPlayback")[0].play();
    });
});
