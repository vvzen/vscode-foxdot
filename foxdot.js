const child_process = require('child_process');

// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const path = require('path');
const fs = require('fs');

const editor = vscode.window.activeTextEditor;

let foxDotProcess = null;

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
	disposables.push(vscode.commands.registerCommand('foxdot.stop', stop));
	disposables.push(vscode.commands.registerCommand('foxdot.evaluateSelection', evaluateSelection));
	disposables.push(vscode.commands.registerCommand('foxdot.openFolder', openFoxDotFolder));

	disposables.forEach((disposable) => {
		context.subscriptions.push(disposable);
	});
}

exports.activate = activate;


function start(){

	const pythonPath = vscode.workspace.getConfiguration('python').get('pythonPath');
	console.log(`current python path: ${pythonPath}`);

	if (foxDotProcess){
		vscode.window.showInformationMessage('FoxDot is already running');
		return;
	}

	let command = ['-m', 'FoxDot', '--pipe'];
	foxDotProcess = child_process.spawn(pythonPath, command);

	foxDotProcess.stdout.on('data', (data) => {
		console.log(`FoxDot stdout: ${data}`);
		vscode.window.showInformationMessage(`FoxDot message: ${data}`);
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

function stop(){
	console.log(`killing FoxDot..`);
	foxDotProcess.kill("SIGINT");
	foxDotProcess = null;
}


function deactivate() {
	stop();
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

function openFoxDotFolder(){
	let args = [];
	const pythonPath = vscode.workspace.getConfiguration('python').get('pythonPath');
	let command;

	if (process.platform === 'darwin'){
		command = 'open';
	}
	// FIXME: needs to be tested
	else if (process.platform === 'win32'){
		command = 'cmd.exe';
		args.push('/s', '/c', 'start', '""', '/b');
	}
	// FIXME: is this available in all linux windowing systems?
	else {
		command = 'gio open';
	}
	let targetDir = path.join(pythonPath, '..', '..', 'lib', 'python3.7', 'site-packages', 'FoxDot');

	if (!fs.existsSync(targetDir)){
		vscode.window.showErrorMessage(`FoxDot - Could not find ${targetDir} on disk, which is where I expected FoxDot to be.`)
		return;
	}

	console.log(`python path: ${pythonPath}`);
	console.log(` ${command} ${args.join(' ')}`);

	args.push(targetDir);
	let p = child_process.spawn(command, args);

	p.stderr.on('data', (data) => {
		let message = `error while trying to open foxdot dir: ${data}`;
		console.log(message);
		vscode.window.showErrorMessage(`FoxDot - ${message}`)
	});

}

module.exports = {
	activate,
	deactivate,
	start,
	stop,
	openFoxDotFolder
}
