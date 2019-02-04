var nomes = [
	'Vinícius', 'João', 'Luiz Guilherme', 'Kauã', 'Koreia', 'Maicon', 'Leb', 'Dalla', 'Willian', 'Gadotti',
	'Christopher', 'Carol', 'Julia S', 'Julia', 'Ayhra', 'Italo', 'Lucas', 'Maikel', 'Luciene', 'Jean', 'Rafael', 'Douglas', 'Stephani',
	'Clara', 'Gabriel', 'Felipe', 'Dhiego', 'Cristina', 'Lipinski', 'Johny', 'Isabelle', 'Larissa', 'Laura', 'Geovani',
	'Michael'
];

var nLimitePessoasPub = nomes.length;
var dinheiroPub = 0;

var pessoas = [];
var pessoasNomes = [];

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

$html('spnLimitePessoasPub', nLimitePessoasPub);

entraPessoaPub(); // começa entrando xD
entraSai();
loopCompra();

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
		var iProdutoComprar = random(0, produtos.length - 1);
		var iPessoaQueComprara = random(0, pessoas.length - 1);

		var pessoaSorteada = pessoas[iPessoaQueComprara];
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

	pessoas.push({
		nome,
		dinheiro,
		tentouComprar: false,
		usaApp
	});
	pessoasNomes.push(nome);

	$html('spnPessoasPub', pessoas.length);
	$append('history', nome + ' entrou.');
}

function removeRandomPessoa() {
	var iPessoaRemover = random(0, pessoas.length - 1);

	$append('history', pessoas[iPessoaRemover].nome + ' saiu.');
	pessoas.splice(iPessoaRemover, 1);
	pessoasNomes.splice(iPessoaRemover, 1);
	$html('spnPessoasPub', pessoas.length);
}