class Final extends Phaser.Scene {
    constructor() {
        super({
            key: "Final"
        })
    }

    //Carregar a imagem

    preload() {
        this.load.image("tela", "assets/Cenas/telaFinal.png");
    }

    create() {
        //Imagem de Game Over

        this.add.image(400, 300, "tela");
        this.enter = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);

        //Reniciar o jogo

        this.enter.on("down", event => {
            this.scene.start("Jogo");
        })
    }
}