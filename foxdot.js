const child_process = require('child_process');

// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');

const editor = vscode.window.activeTextEditor;

let foxDotProcess;

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('activating "vscode-foxdot"..');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with  registerCommand
	// The commandId parameter must match the command field in package.json
	let disposables = [];
	disposables.push(vscode.commands.registerCommand('foxdot.start', start));
	disposables.push(vscode.commands.registerCommand('foxdot.evaluateSelection', evaluateSelection));

	disposables.forEach((disposable) => {
		context.subscriptions.push(disposable);
	});
}

exports.activate = activate;


function start(){

	const pythonPath = vscode.workspace.getConfiguration('python').get('pythonPath');
	console.log(`current python path: ${pythonPath}`);

	let command = ['-m', 'FoxDot', '--pipe'];
	foxDotProcess = child_process.spawn(pythonPath, command);

	foxDotProcess.stdout.on('data', (data) => {
		console.log(`FoxDot stdout: ${data}`);
	});

	foxDotProcess.stderr.on('data', (data) => {
		console.log(`FoxDot stderr: ${data}`);
	});

	foxDotProcess.on('close', (code) => {
		if (code) {
			vscode.window.showErrorMessage(`FoxDot has exited with code ${code}.`);
		} else {
			vscode.window.showInformationMessage(`FoxDot has closed correctly.`);
		}
		foxDotProcess = null;
	});

	vscode.window.showInformationMessage('FoxDot extension started');
}


// this method is called when your extension is deactivated
function deactivate() {
	console.log(`killing FoxDot..`);
	foxDotProcess.kill("SIGINT");
	foxDotProcess = null;
}

function evaluateSelection(){

	let selection = editor.selection;

	let firstSelectedLine = editor.document.lineAt(selection.start.line);
	let lastSelectedLine = editor.document.lineAt(selection.end.line);

	// Expand the selection to the start and end of the respective lines
	let firstChar = firstSelectedLine.range.start.character;
	if (firstChar != 0){
		firstSelectedLine.range.start.translate(-firstChar);
	}

	let lastChar = lastSelectedLine.range.end.character;
	if (lastChar != lastSelectedLine.text.length-1){
		lastSelectedLine.range.end.translate(lastSelectedLine.text.length + lastChar - 1);
	}

	let selectedRange = new vscode.Range(firstSelectedLine.range.start, lastSelectedLine.range.end);

	const selectedText = editor.document.getText(selectedRange);
	evaluateCode(selectedText);
}

/**
 * @param {string} code
 */
function evaluateCode(code) {
	foxDotProcess.stdin.write(`${code}\n\n`);
}

module.exports = {
	activate,
	deactivate,
	start
}
