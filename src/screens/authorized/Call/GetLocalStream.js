import {Platform} from 'react-native';
import {
    MediaStreamTrack,
    getUserMedia,
} from 'react-native-webrtc';

function GetLocalStream(isFront, video, callback) {

    let videoSourceId;

    // on android, you don't have to specify sourceId manually, just use facingMode
    // uncomment it if you want to specify
    if (Platform.OS === 'ios') {
        MediaStreamTrack.getSources(sourceInfos => {
            console.log("sourceInfos: ", sourceInfos);

            for (let i = 0; i < sourceInfos.length; i++) {
                const sourceInfo = sourceInfos[i];
                if (sourceInfo.kind === "video" && sourceInfo.facing === (isFront ? "front" : "back")) {
                    videoSourceId = sourceInfo.id;
                }
            }
        });
    }

    if (video) {
        getUserMedia({
            audio: true,
            video: {
                mandatory: {
                    minWidth: 1080, // Provide your own width, height and frame rate here
                    minHeight: 720,
                    minFrameRate: 50,
                },
                facingMode: (isFront ? "user" : "environment"),
                optional: (videoSourceId ? [{sourceId: videoSourceId}] : []),
            }
        }, function (stream) {
            console.log('getUserMedia success', stream);
            callback(stream);
        }, logError);
    }
    else {
        getUserMedia({
            audio: true,
            video: false,
        }, function (stream) {
            console.log('getUserMedia success', stream);
            callback(stream);
        }, logError);
    }
};

function logError(error) {
    console.log("logError", error);
}


module.exports = {
    GetLocalStream,
    logError,
};
