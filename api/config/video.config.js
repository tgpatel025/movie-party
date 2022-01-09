const videoSizes = ['426x240', '640x360', '854x480', '1280x720', '1920x1080'];
const videoBitrates = ['64k', '128k', '320k', '640k', '1024k'];
const videoCodec = 'libvpx-vp9';
const vp9DashParams = '-keyint_min 150 -g 150 -tile-columns 4 -frame-parallel 1 -an -f webm -dash 1'
const ffmpegPath = 'C:/Data/Uploads';
const generateVideos = `${ffmpegPath}/ffmpeg -i input_filename -c:v ${videoCodec} -s size -b:v bitrate ${vp9DashParams} output_folder/video_size_bitrate.webm`;
const generateAudio = `${ffmpegPath}/ffmpeg -i input_filename -c:a libvorbis -b:a 128k -vn -f webm -dash 1 output_folder/audio_128k.webm`;

function getVideoPlaybackCommand(input, output) {
    let video = '', audio = '', 
        manifest = `${ffmpegPath}/ffmpeg `;

    audio += generateAudio
        .replace('input_filename', input)
        .replace('output_folder', output);

    for (let i = 0; i < videoSizes.length; i++) {
        video += generateVideos
            .replace('input_filename', input)
            .replace(/size/g, videoSizes[i])
            .replace(/bitrate/g, videoBitrates[i])
            .replace('output_folder', output);
        if (i < videoSizes.length - 1) {
            video += ' && ';
        }
        manifest += `-f webm_dash_manifest -i ${output}/video_${videoSizes[i]}_${videoBitrates[i]}.webm `;
    }
    
    manifest += `-f webm_dash_manifest -i ${output}/audio_128k.webm `;
    manifest += '-c copy -map 0 -map 1 -map 2 -map 3 -map 4 -map 5 -f webm_dash_manifest ';
    manifest += '-adaptation_sets "id=0,streams=0,1,2,3,4 id=1,streams=5" ';
    manifest += `${output}/manifest.mpd`;
    return { video, audio, manifest };
}

module.exports = {
    getVideoPlaybackCommand
}