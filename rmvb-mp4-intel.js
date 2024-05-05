function parseBitrates(strffmpeg) {
    const lines = strffmpeg.trim().split('\n');
    let audioBitrate = null;
    let videoBitrate = null;

    for (const line of lines) {
        if (audioBitrate !== null && videoBitrate !== null) {
            break; // 如果已经解析到了音频和视频比特率，则跳出循环
        }

        if (line.includes('Stream #')) {
            const segments = line.split(',');
            for (const segment of segments) {
                if (segment.includes('b/s')) {
                    const bIndex = segment.indexOf('b/s');
                    if (bIndex === -1) {
                        // 如果不存在'b/s'，则跳过本次循环
                        continue;
                    }

                    const bitrate = segment.substring(0, bIndex).trim().replace(' ', ''); // 去除所有空格
                    if (line.includes('Audio') && audioBitrate === null) {
                        audioBitrate = bitrate;
                    } else if (line.includes('Video') && videoBitrate === null) {
                        videoBitrate = bitrate;
                    }
                }
            }
        }
    }

    return { audioBitrate, videoBitrate };
}

const { exec } = require('child_process');

const ffmpegPath = 'D:/Soft/ffmpeg-6.0-essentials_build/bin/ffmpeg';
//const filePath = 'D:/Soft/BaiduPCS-Go-Web-master/Downloads/旧版全职猎人-test/全职猎人-036.rmvb';

function processVideo(filePath) {
    const { exec } = require('child_process');
    const ffmpegPath = 'D:/Soft/ffmpeg-6.0-essentials_build/bin/ffmpeg';

    exec(`"${ffmpegPath}" -i "${filePath}"`, { encoding: 'utf8' }, (error, stdout, stderr) => {
        let strffmpeg;
        if (error) {
            strffmpeg = error.toString();
        } else if (stderr) {
            strffmpeg = stderr.toString();
        } else {
            strffmpeg = stdout.toString();
        }

        console.log('ffmpeg 输出信息:', strffmpeg);

        // 解析strffmpeg，检查是否同时包含了音频和视频流信息
        const hasAudio = strffmpeg.includes('Stream #0:0') && strffmpeg.includes('Audio:');
        const hasVideo = strffmpeg.includes('Stream #0:1') && strffmpeg.includes('Video:');

        if (!hasAudio || !hasVideo) {
            console.error('错误：文件不包含音频和视频流信息！');
            return;
        }

        // 解析strffmpeg，提取音频和视频流比特率信息
        const { audioBitrate, videoBitrate } = parseBitrates(strffmpeg);

        console.log('音频比特率信息:', audioBitrate);
        console.log('视频比特率信息:', videoBitrate);

        // 检查音频和视频比特率信息是否都存在
        if (audioBitrate === null || videoBitrate === null) {
            console.error('错误：音频或视频比特率信息缺失！');
            return;
        }

        // 获取文件名和后缀
        const filename = filePath.substring(filePath.lastIndexOf('/') + 1);
        const suffix = filename.substring(filename.lastIndexOf('.') + 1);

        // 组合 FFmpeg 命令
        const outputFilePath = filePath.replace(`.${suffix}`, '.mp4');
        const ffmpegCommand = `${ffmpegPath} -hwaccel qsv -i "${filePath}" -c:v hevc_qsv -b:v ${videoBitrate} -b:a ${audioBitrate} "${outputFilePath}"`;

        console.log('FFmpeg 命令:', ffmpegCommand);

        // 执行 FFmpeg 命令
        exec(ffmpegCommand, (error, stdout, stderr) => {
            if (error) {
                console.error('FFmpeg 命令执行失败:', error);
                return;
            }
            console.log('FFmpeg 命令执行成功:', stdout);
        });
    });
}

console.log(process.argv[0]);
console.log(process.argv[1]);
const filePath = process.argv[2];
if (!filePath) {
    console.error('错误：未提供文件路径！');
    return;
}
// 调用示例
processVideo(filePath);
