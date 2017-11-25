let Monster = {
    goomba:{
        tileNumber: 42,
        spriteName: 'goomba',
        path: '/game/assets/goomba.png',
        animation: {
            name: 'walk',
            frame: [0, 1],
            frame_rate: 2
        },
        velocity: {
            x: -50,
            y: 0
        },
        gravity: {
            x: 0,
            y: 500
        },
        picture:{
            width: 32,
            height: 32
        }
    },
    spikeTurtle:{
        tileNumber: 41,
        spriteName: 'spikeTurtle',
        path:  '/game/assets/spikeTurtle.png',
        animation: {
            name: 'walk',
            frame: [0, 1],
            frame_rate: 2
        },
        velocity: {
            x: -50,
            y: 0
        },
        gravity: {
            x: 0,
            y: 500
        },
        picture:{
            width: 32,
            height: 32
        }
    },
}
