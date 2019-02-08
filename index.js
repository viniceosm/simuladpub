var nomes = [
	'Vinícius', 'João', 'Luiz Guilherme', 'Kauã', 'Koreia', 'Maicon', 'Leb', 'Dalla', 'Willian', 'Gadotti',
	'Christopher', 'Carol', 'Julia S', 'Julia', 'Ayhra', 'Italo', 'Lucas', 'Maikel', 'Luciene', 'Jean', 'Rafael', 'Douglas', 'Stephani',
	'Clara', 'Gabriel', 'Felipe', 'Dhiego', 'Cristina', 'Lipinski', 'Johny', 'Isabelle', 'Larissa', 'Laura', 'Geovani',
	'Michael'
];

var nLimitePessoasPub = 24;
var dinheiroPub = 0;

var velocidadeAnimacao = 100;
var valocidadeEntraSai = {
	min: 200,
	max: 10 * 100
};

var pessoas = [];
var maxIdGerado = 0;
var pessoasNomes = [];
var mesas = [
	{ coords: { x: 4, y: 11 } },
	{ coords: { x: 7, y: 11 } },
	{ coords: { x: 10, y: 11 } },
	{ coords: { x: 4, y: 14 } },
	{ coords: { x: 7, y: 14 } },
	{ coords: { x: 10, y: 14  }}
];

var cadeirasMesas = [];

for (var mesa of mesas) {
	cadeirasMesas.push({ coords: { x: mesa.coords.x, y: mesa.coords.y - 1 }, livre: true });
	cadeirasMesas.push({ coords: { x: mesa.coords.x, y: mesa.coords.y + 1 }, livre: true });
	cadeirasMesas.push({ coords: { x: mesa.coords.x + 1, y: mesa.coords.y }, livre: true });
	cadeirasMesas.push({ coords: { x: mesa.coords.x - 1, y: mesa.coords.y }, livre: true });
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
}, 10);

function entraSai() {
	var demoraEntraSai = random(valocidadeEntraSai.min, valocidadeEntraSai.max);

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

	maxIdGerado++;

	var pessoaAdicionada = {
		id: maxIdGerado,
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
			await delay(velocidadeAnimacao);
		}
		for (var i = 0; i < 6; i++) {
			andaBaixo(pessoaAdicionada);
			await delay(velocidadeAnimacao);
		}

		var cadeiraDisponivel = cadeirasMesas.filter(cm => cm.livre == true)[0];

		if (cadeiraDisponivel !== undefined) {
			cadeiraDisponivel.livre = false;

			await caminhaPara(pessoaAdicionada, cadeiraDisponivel);

			pessoaAdicionada.sentou = true;
		}
	})();

	$html('spnPessoasPub', pessoas.length);
	$append('history', nome + ' entrou.');
}

async function removeRandomPessoa() {
	var pessoasSentadas = pessoas.filter(cm => cm.sentou == true);

	if (pessoasSentadas.length > 0) {
		var iPessoaSentadaRemover = random(0, pessoasSentadas.length - 1);

		var pessoaRemover = pessoas.find(p => p.id == pessoasSentadas[iPessoaSentadaRemover].id);
		var iPessoaRemover = pessoas.findIndex(p => p.id == pessoaRemover.id);

		await caminhaPara(pessoaRemover, { coords: {x: 6, y: 7} });

		for (var i = 0; i < 7; i++) {
			andaCima(pessoaRemover);
			await delay(velocidadeAnimacao);
		}
		for (var i = 0; i < 5; i++) {
			andaEsquerda(pessoaRemover);
			await delay(velocidadeAnimacao);
		}

		$append('history', pessoaRemover.nome + ' saiu.');
		pessoas.splice(iPessoaRemover, 1);
		pessoasNomes.splice(iPessoaRemover, 1);
		console.log('removeu cara')
		$html('spnPessoasPub', pessoas.length);
	}
}

async function caminhaPara (objeto, destino, cb) {
	return new Promise(async (resolve) => {
		if (destino.coords.x !== undefined && destino.coords.y !== undefined) {
			while (objeto.coords.y !== destino.coords.y) {
				if (objeto.coords.y < destino.coords.y) {
					andaBaixo(objeto);
				} else {
					andaCima(objeto);
				}

				await delay(velocidadeAnimacao);
			};

			while (objeto.coords.x !== destino.coords.x) {
				if (objeto.coords.x < destino.coords.x) {
					andaDireita(objeto);
				} else {
					andaEsquerda(objeto);
				}

				await delay(velocidadeAnimacao);
			};

			resolve();
		}
	});
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
		desenhaMesa(mesaCanvas.coords.x, mesaCanvas.coords.y);
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