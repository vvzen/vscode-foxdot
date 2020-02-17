const child_process = require('child_process');

// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');

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
	let disposable = vscode.commands.registerCommand('foxdot.start', start);

	context.subscriptions.push(disposable);
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

module.exports = {
	activate,
	deactivate,
	start
}
