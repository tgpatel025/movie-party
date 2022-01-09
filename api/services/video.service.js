const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffmpeg = require('fluent-ffmpeg');
ffmpeg.setFfmpegPath(ffmpegPath);

function generateAudio(input, file) {
    ffmpeg(input)
        .audioCodec("libvorbis")
        .audioBitrate("128k")
        .addOption("-dash 1")
        .output(`${file}_audio.webm`)
        .run();
}

function generateVideos(input, file) {
    return new Promise((resolve, reject) => {
        const promises = [];
        promises.push(generate180(input, file));
        promises.push(generate360(input, file));
        promises.push(generate720(input, file));
        promises.push(generate1080(input, file));
        Promise.all(promises).then(() => resolve());
    });
}

function generate180(input, file) {
    return new Promise((resolve, reject) => {
        ffmpeg(input)
            .videoCodec("libvpx-vp9")
            .format('webm')
            .addOption("-dash 1")
            .videoFilter("scale=320:180")
            .videoBitrate("500k")
            .addOutputOption("-dash 1")
            .output(`${file}_320x180_500k.webm`).on("end", () => {
                resolve();
            }).run();
    });
}

function generate360(input, file) {
    return new Promise((resolve, reject) => {
        ffmpeg(input).videoCodec("libvpx-vp9")
            .videoCodec("libvpx-vp9")
            .format('webm')
            .addOption("-dash 1")
            .videoFilter("scale=640:360")
            .videoBitrate("750k")
            .addOutputOption("-dash 1")
            .output(`${file}_640x360_750k.webm`).on("end", () => {
                resolve();
            }).run();
    });
}

function generate720(input, file) {
    return new Promise((resolve, reject) => {
        ffmpeg(input).videoCodec("libvpx-vp9")
            .videoCodec("libvpx-vp9")
            .format('webm')
            .addOption("-dash 1")
            .videoFilter("scale=1280:720")
            .videoBitrate("1000k")
            .addOutputOption("-dash 1")
            .output(`${file}_1280x720_1000k.webm`).on("end", () => {
                resolve();
            }).run();
    });
}

function generate1080(input, file) {
    return new Promise((resolve, reject) => {

        ffmpeg(input).videoCodec("libvpx-vp9")
            .videoCodec("libvpx-vp9")
            .format('webm')
            .addOption("-dash 1")
            .videoFilter("scale=1920:1080")
            .videoBitrate("1500k")
            .addOutputOption("-dash 1")
            .output(`${file}_1920x1080_1500k.webm`).on("end", () => {
                resolve();
            }).run();
    });
}

function generateManifestFile(file) {
    return new Promise((resolve, reject) => {
        ffmpeg()
            .format("webm_dash_manifest")
            .input(`${file}_320x180_500k.webm`)
            .format("webm_dash_manifest")
            .input(`${file}_640x360_750k.webm`)
            .format("webm_dash_manifest")
            .input(`${file}_1280x720_1000k.webm`)
            .format("webm_dash_manifest")
            .input(`${file}_1920x1080_1500k.webm`)
            .format("webm_dash_manifest")
            .input(`${file}_audio.webm`)
            .videoCodec("copy")
            .audioCodec("copy")
            .addOptions([
                "-map 0",
                "-map 1",
                "-map 2",
                "-map 3",
                "-map 4"
            ])
            .format("webm_dash_manifest")
            .outputOptions(["-adaptation_sets id=0,streams=0,1,2,3 id=1,streams=4"])
            .output(`${file}_manifest.mpd`).on("end", () => {
                resolve();
            }).run();
    });
}

module.exports = {
    generateAudio,
    generateVideos,
    generateManifestFile
}