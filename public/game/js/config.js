const Config = {
    window: {
        // type stored in string
        width: '100%',
        height: '110%'
    },
    html: {
        main: 'html_game_block'
    },
    font: {
        Arial: {
            font: "16px Arial",
            fill: "#000000",
            align: "center"
        },
        Bold: {
            font: "64px Arial",
            fill: "#000000",
            align: "center"
        }
    },
    // Config.state is used verify state
    state: {
        start: 0,
        playerJoin: 0,
        toExistPlayer: 1,
        toNewPlayer: 2,
        playerJoinFinish: 3,
        requestMonster: 4,
        getMonsterInfo: 5,
        parseMonsterInfo: 6,
        spawnMonster: 7,
        finish: 7,
        current: 0
    },
    status: {
        left: -1,
        right: 1
    },
    currentUserName: $("#userName").html()
}
