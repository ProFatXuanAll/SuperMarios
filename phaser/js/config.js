let Config = {
    window:{
        // type stored in string
        width: '100%',
        height: '100%'
    },
    frame:{
        leftFrame: 0,
        rightFrame: 4
    },
    velocity:{
        left:-200,
        right: 200,
        up: -600,
        gravity: 20,
        idle: 0
    },
    picture:{
        mario:{
            width: 32,
            height: 56
        },
        background:{
            width:8000,
            height:600,
            x:0,
            y:0
        }
    },
    animation:{
        left:[0,1,2,3],
        idle:[4],
        right:[4,5,6,7],
        frameRate:10
    }
}
