var nomes = [
	'Vinícius', 'João', 'Luiz Guilherme', 'Kauã', 'Koreia', 'Maicon', 'Leb', 'Dalla', 'Willian', 'Gadotti',
	'Christopher', 'Carol', 'Julia S', 'Julia', 'Ayhra', 'Italo', 'Lucas', 'Maikel', 'Luciene', 'Jean', 'Rafael', 'Douglas', 'Stephani',
	'Clara', 'Gabriel', 'Felipe', 'Dhiego', 'Cristina', 'Lipinski', 'Johny', 'Isabelle', 'Larissa', 'Laura', 'Geovani',
	'Michael'
];

var nLimitePessoasPub = 24;
var dinheiroPub = 0;

var pessoas = [];
var pessoasNomes = [];
var mesas = [
	{ x: 4, y: 11 },
	{ x: 7, y: 11 },
	{ x: 10, y: 11 },
	{ x: 4, y: 14 },
	{ x: 7, y: 14 },
	{ x: 10, y: 14 }
];

var cadeirasMesas = [];

for (var mesa of mesas) {
	cadeirasMesas.push({ x: mesa.x, y: mesa.y - 1, livre: true });
	cadeirasMesas.push({ x: mesa.x, y: mesa.y + 1, livre: true });
	cadeirasMesas.push({ x: mesa.x + 1, y: mesa.y, livre: true });
	cadeirasMesas.push({ x: mesa.x - 1, y: mesa.y, livre: true });
}

var produtos = [
	{
		nome: 'Heinekein',
		preco: 9,
		quantidade: 60
	},
	{
		nome: 'Budweiser',
		preco: 9,
		quantidade: 60
	},
	{
		nome: 'Eisenbahn',
		preco: 9,
		quantidade: 50
	},
	{
		nome: 'Porção de batata',
		preco: 29,
		quantidade: 100
	},
	{
		nome: 'Hamburguer',
		preco: 15,
		quantidade: 100
	},
	{
		nome: 'Cuba Libre',
		preco: 14,
		quantidade: 50
	}
];

var $html = (id, val) => document.getElementById(id).innerHTML = val;
var $append = (id, val) => document.getElementById(id).innerHTML = '<div>' + val + '</div>' + document.getElementById(id).innerHTML;
var delay = (ms) => {
	return new Promise((resolve) => {
		setTimeout(() => {
			resolve();
		}, ms);
	});
};

$html('spnLimitePessoasPub', nLimitePessoasPub);

document.getElementById('btnHamb').addEventListener('click', function () {
	if (document.getElementById('history').style.display == 'none') {
		document.getElementById('history').style.display = '';
		document.getElementById('areaCanvas').style.display = 'none';
	} else {
		document.getElementById('areaCanvas').style.display = '';
		document.getElementById('history').style.display = 'none';
	}
});

entraPessoaPub(); // começa entrando xD
entraSai();
loopCompra();

var loopMontaCanvas = setInterval(function () {
	montaCanvas();
}, 100);

function entraSai() {
	var demoraEntraSai = random(2000, 10 * 1000);

	setTimeout(function () {
		var iEntraSai = random(0, 1);
		if (iEntraSai == 0) {
			entraPessoaPub();
		} else {
			saiPessoaPub();
		}

		entraSai();
	}, demoraEntraSai);
}

function loopCompra() {
	var demoraLoopCompra = random(3000, 10 * 1000);

	setTimeout(function () {
		var pessoasSentadas = pessoas.filter(cm => cm.sentou == true);

		var iProdutoComprar = random(0, produtos.length - 1);
		var iPessoaQueComprara = random(0, pessoasSentadas.length - 1);

		var pessoaSorteada = pessoasSentadas[iPessoaQueComprara];
		var produtoSorteado = produtos[iProdutoComprar];

		if (pessoaSorteada) {
			if (pessoaSorteada.dinheiro >= produtoSorteado.preco && produtoSorteado.quantidade > 0) {
				usuarioCompraPeloApp(produtoSorteado, pessoaSorteada);
			} else {
				if (pessoaSorteada.tentouComprar !== true) {
					$append('history', pessoaSorteada.nome + ' não tem dinheiro suficiente');
					pessoaSorteada.tentouComprar = true;
				}
			}
		}

		loopCompra();
	}, demoraLoopCompra);
}

function usuarioCompraPeloApp(produtoSorteado, pessoaSorteada) {
	produtoSorteado.quantidade -= 1;
	pessoaSorteada.dinheiro -= produtoSorteado.preco;

	dinheiroPub += produtoSorteado.preco;
	$html('spnDinheiroPub', nLimitePessoasPub);

	$append('history', pessoaSorteada.nome + ' comprou 1 ' + produtoSorteado.nome);
}

function entraPessoaPub() {
	if (pessoas.length == 0 || pessoas.length < nLimitePessoasPub) {
		addRandomPessoa();
	}
}

function saiPessoaPub() {
	if (pessoas.length > 0) {
		removeRandomPessoa();
	}
}

function random(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

function addRandomPessoa() {
	var dinheiro = random(100, 300);

	do {
		var nome = nomes[random(0, nomes.length - 1)];
	} while (pessoasNomes.includes(nome));

	var usaApp = !random(0, 1);

	var pessoaAdicionada = {
		nome,
		dinheiro,
		tentouComprar: false,
		usaApp,
		coords: { x: 1, y: 1 },
		sentou: false
	};

	pessoas.push(pessoaAdicionada);
	pessoasNomes.push(nome);

	(async function() {
		// vai até o meio do pub pra dps fazer o calculo em que mesa ele vai
		for (var i = 0; i < 5; i++) {
			andaDireita(pessoaAdicionada);
			await delay(500);
		}
		for (var i = 0; i < 6; i++) {
			andaBaixo(pessoaAdicionada);
			await delay(500);
		}

		var cadeiraDisponivel = cadeirasMesas.filter(cm => cm.livre == true)[0];

		if (cadeiraDisponivel !== undefined) {
			cadeiraDisponivel.livre = false;
		}

		if (cadeiraDisponivel.x !== undefined && cadeiraDisponivel.y !== undefined) {
			while (pessoaAdicionada.coords.y !== cadeiraDisponivel.y) {
				andaBaixo(pessoaAdicionada);
				await delay(500);
			};

			while (pessoaAdicionada.coords.x !== cadeiraDisponivel.x) {
				if (pessoaAdicionada.coords.x < cadeiraDisponivel.x) {
					andaDireita(pessoaAdicionada);
				} else {
					andaEsquerda(pessoaAdicionada);
				}

				await delay(500);
			};

			pessoaAdicionada.sentou = true;
		}
	})();

	$html('spnPessoasPub', pessoas.length);
	$append('history', nome + ' entrou.');
}

function removeRandomPessoa() {
	var pessoasSentadas = pessoas.filter(cm => cm.sentou == true);

	var iPessoaRemover = random(0, pessoasSentadas.length - 1);

	$append('history', pessoas[iPessoaRemover].nome + ' saiu.');
	pessoas.splice(iPessoaRemover, 1);
	pessoasNomes.splice(iPessoaRemover, 1);
	$html('spnPessoasPub', pessoas.length);
}

function montaCanvas() {
	// quadrados = 10px x 10px
	// grid canvas 130 x 18
	// canvas tera 130px x 180px

	limpaCanvas();

	desenhaPorta();
	desenhaCaixa();
	desenhaBalcao();

	for (var mesaCanvas of mesas) {
		desenhaMesa(mesaCanvas.x, mesaCanvas.y);
	}

	for (var pessoaCanvas of pessoas) {
		desenhaPessoa(pessoaCanvas.coords.x, pessoaCanvas.coords.y);
	}
}

function andaCima (pessoa) {
	pessoa.coords.y --;
}

function andaBaixo (pessoa) {
	pessoa.coords.y ++;
}

function andaEsquerda(pessoa) {
	pessoa.coords.x--;
}

function andaDireita(pessoa) {
	pessoa.coords.x++;
}

function desenhaPorta() {
	pintaCoord(0, 0, 'brown');
	pintaCoord(0, 1, 'brown');
}

function desenhaPessoa(x, y) {
	pintaCoord(x, y);
}
function desenhaMesa(x, y) {
	pintaCoord(x, y, 'brown');
}
function desenhaBalcao() {
	pintaCoord(12, 6, 'brown');
	pintaCoord(12, 7, 'brown');
	pintaCoord(12, 8, 'brown');
	pintaCoord(12, 9, 'brown');
}

function desenhaCaixa() {
	pintaCoord(0, 4, 'green');
	pintaCoord(1, 4, 'green');
	pintaCoord(2, 4, 'green');
}

function pintaCoord (x, y, cor = 'black') {
	var [ wQuad, hQuad ] = [10, 10];

	var c = document.getElementById("myCanvas");
	var ctx = c.getContext("2d");

	ctx.fillStyle = cor;
	ctx.fillRect(x * wQuad, y * hQuad, wQuad, hQuad);

	// ctx.font = "14px Arial";
	// ctx.fillText("@", 10, 50);
}

function limpaCanvas () {
	var c = document.getElementById("myCanvas");
	var context = c.getContext("2d");
	context.clearRect(0, 0, c.width, c.height);
}