class Jogo extends Phaser.Scene {
    constructor() {
        super({
            key: "Jogo",
            type: Phaser.AUTO,
            width: 800,
            height: 600,
            physics: {
                default: "arcade",
                arcade: {
                    gravity: {
                        y: 300
                    },

                    debug: false,
                },
            },
        })
    }

    // Criação das variáveis
    init() {
        this.jogador;
        this.obstáculo;
        this.moeda;
        this.borracha;
        this.pontos = 0;
        this.placar;
        this.tecla;
        this.ouro;
        this.direção = -1;
        this.posições = [250, 475, 125, 200, 500, 300]
    }

    //Carrega as imagens

    preload() {
        this.load.image("fundo", "assets/Cenas/fundo.png");
        this.load.spritesheet("stickman", "assets/New Piskel.png", {frameWidth: 32, frameHeight: 32});
        this.load.image("plataforma", "assets/cinza.png");
        this.load.image("Ouro", "assets/Ouro.png")
        this.load.spritesheet("Borracha", "assets/borracha.png", {frameWidth: 32, frameHeight: 32})
    }
    
    create() {
        this.add.image(400, 300, "fundo");

        //Criação dos obstáculos
    
        this.obstáculo = this.physics.add.staticGroup();

        this.obstáculo.create(400, 568, "plataforma").setScale(2).refreshBody();

        for(this.i = 0; this.i < 3; this.i++) {
            this.obstáculo.create(this.posições[this.i * 2], this.posições[this.i * 2 + 1], "plataforma")
        }

        //Criação do jogador
        
        this.jogador = this.physics.add.sprite(170, 500, "stickman");
        this.jogador.setBounce(0.2);
        this.jogador.setCollideWorldBounds(true);
    
        this.tecla = this.input.keyboard.createCursorKeys();
    
        this.anims.create({
            key: "Direita",
            frames: this.anims.generateFrameNumbers("stickman", {start: 0, end: 3}),
            frameRate: 10,
            repeat: -1,
        })
    
        this.anims.create({
            key: "Inativo",
            frames: [{key: "stickman", frame: 4}],
            frameRate: 20,
        })
    
        this.anims.create({
            key: "Esquerda",
            frames: this.anims.generateFrameNumbers("stickman", {start: 6, end: 9}),
            frameRate: 10,
            repeat: -1,
        })
    
        this.physics.add.collider(this.jogador, this.obstáculo);

        //Criação da moeda
    
        this.ouro = this.physics.add.group({
            key: "Ouro",
            repeat: 11,
            setXY: {
                x: 12,
                y: 0,
                stepX: 60,
            }
        })
    
        this.ouro.children.iterate(function (child) {
            child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
        })
    
        this.physics.add.collider(this.ouro, this.obstáculo);

        //Pontuação
    
        this.physics.add.overlap(this.jogador, this.ouro, coletar, null, this)
    
        function coletar(jogador, ouros) {
            ouros.disableBody(true, true);
            this.pontos += 5;
            this.placar.setText("Pontos: " + this.pontos)
        }
    
        this.placar = this.add.text(18, 18, "Moedas: 0", {fontSize: "32px", fill: "#000"})

        //Movimentos

        this.add.text(400, 572, "<: Esquerda, ^: Pular, >: Direita", {fontSize: "16px", fill: "#000"})

        //Criação do inimigo
    
        this.borracha = this.physics.add.sprite(300, 250, "Borracha")
        this.borracha.setBounce(0.2)
        this.borracha.setCollideWorldBounds(true)
    
        this.anims.create({
            key: "direita",
            frames: this.anims.generateFrameNumbers("Borracha", {start: 5, end: 8}),
            frameRate: 10,
            repeat: -1,
        })
    
        this.anims.create({
            key: "esquerda",
            frames: this.anims.generateFrameNumbers("Borracha", {start: 1, end: 4}),
            frameRate: 10,
            repeat: -1,
        })
    
        this.anims.create({
            key: "inativo",
            frames: [{key: "Borracha", frame: 0}],
            frameRate: 20,
        })
    
        this.physics.add.collider(this.borracha, this.obstáculo);

        //Fim de jogo
    
        this.physics.add.collider(this.borracha, this.jogador, apagar, null, this);
    
        function apagar() {
            this.physics.pause();
    
            this.jogador.setTint("0xff0000");
    
            this.jogador.anims.play("Inativo");
    
            this.perdeu = true;

            this.scene.start("Final")
        }
    
    }
    
    update() {
        //Movimento do personagem

        if(this.tecla.left.isDown) {
            this.jogador.setVelocityX(-160);
    
            this.jogador.anims.play("Esquerda", true);
        }
    
        else if(this.tecla.right.isDown) {
            this.jogador.setVelocityX(160);
    
            this.jogador.anims.play("Direita", true);
        }
    
        else {
            this.jogador.setVelocityX(0);
    
            this.jogador.anims.play("Inativo");
        }
    
        if(this.tecla.up.isDown && this.jogador.body.touching.down) {
            this.jogador.setVelocityY(-330);
        }

        //Movimento do inimigo
    
        if(this.direção == 1) {
            this.borracha.setVelocityX(160);
            this.borracha.anims.play("direita");
            if(this.borracha.x >= 675) {
                this.borracha.setVelocityX(0);
                this.borracha.anims.play("inativo");
                this.direção = -1
            }
        }
    
        if(this.direção == -1) {
            this.borracha.setVelocityX(-160);
            this.borracha.anims.play("esquerda")
            if(this.borracha.x == 300) {
                this.borracha.setVelocityX(0);
                this.borracha.anims.play("inativo");
                this.direção = 1
            }
        }
    }
};

