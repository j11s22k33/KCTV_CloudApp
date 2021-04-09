UI_VERSION='0.0.1'
HE_ENV='TEST'
LOG_LEVEL='DEBUG'
UI_UPDATE_DATE='2018.08.20'
LOG='true'
DEVICE='PC'

// 앱 진입 시 필요한 params
if (DEVICE === 'PC' && location.search.length === 0) {
    const mySearch = {
        pid: 1769, // 웹소켓
        port: 9001, // 웹소켓
        // device: 'pc',
        param: {
            "sceneId": "5101",
            "sceneValue": {
                "sourceId": 590,
                "releaseAdult": false
            },
            "isLive": true,
            "accessToken": "00ND0QTUQQD6SV8AVMARMTQVJS",
            "subscriberId": "1BC08AE8C1",
            "accountId": "30074315114821",
            "macAddress": "20d5bfdac0cf",
            "cugType": "normal",
            "groupId": "",
            "userName": "케이블TV제주방송(분배센터)",
            "currentChannel": 590,
            "rating": 0,
            "adultMenuUse": "1",
            "menuTransparency": "3",
            "menuDuration": "4",
            "blockVodPlay": false,
            "blockPurchase": false,
            "menuLanguage": "1",
            "vodLookStyle": "1",
            "vodContinuousPlay": "2",
            "isKidsMode": false,
            "stbType": "ANDROID",
            "isUHD": true,
            "isVisualImpaired": true,
            "supportSetRate": false,
            "localCode": "A118",
            "favChCount": 0,
            "enableSubsCancelBtn": false,
            "androidNoti": 0
        }
    }

    const tmp = []
    for (const [key, val] of Object.entries(mySearch)) {
        tmp.push(key + "=" + JSON.stringify(val))
    }

    location.search = '?' + tmp.join("&")
}
