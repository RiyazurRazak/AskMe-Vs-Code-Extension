import * as vscode from 'vscode';

import * as open from 'open';

import fetch from 'node-fetch'

export function activate(context: vscode.ExtensionContext) {


	let disposable = vscode.commands.registerCommand('askme.helloWorld', async () => {

		const editor = vscode.window.activeTextEditor
		if(!editor){
			vscode.window.showErrorMessage("Editor Not  Found")
			return
		}

		const selectedText = editor?.document.getText(editor.selection)

		const language = editor?.document.languageId


		const response = await fetch(`https://api.stackexchange.com/2.2/search?order=desc&max=20&sort=votes&tagged=${language}&intitle=${selectedText}&site=stackoverflow`);
		const json = await response.json();
		const data = await json.items

		if(data.length == 0){
			vscode.window.showInformationMessage(`Sorry No Data Found For The Query : ${selectedText}`)
			return
		}

		const quickPick = vscode.window.createQuickPick();

		quickPick.items = data.map((post: any)=> ({label: post.title, detail : post.link}))
		quickPick.onDidChangeSelection(async ([item])=>{
			if(item){
				await open(`${item.detail}`);
				quickPick.dispose()
			}

		})

		quickPick.onDidHide(()=> quickPick.dispose())
		quickPick.show()
	});

	context.subscriptions.push(disposable);

}

export function deactivate() {}
