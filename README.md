# vscode-foxdot

[ ⚠️ This extension is currently very WIP ⚠️ ]

Perform your live coding music with FoxDot from Visual Studio Code.

## How to use

Once the extension is installed, use `cmd (or ctrl) + shift + P` to run the `FoxDot start` command,
which will make other the other commands ready to be used.

![images/foxdot_start.png](images/foxdot_start.png)

If everything goes well, you'll see a message telling you that FoxDot started correctly.

![images/foxdot_started.png](images/foxdot_started.png)

## Current Features

* Start FoxDot within vscode ✅

* Play the selected line/lines in FoxDot with `cmd (o ctrl)+Enter` ✅

## Future Features

* Custom theme for live coding (in progress at https://github.com/vvzen/vscode-foxdot-darktheme)

* Highlight the current selection after the execution

* Autocompletion for FoxDot

* ..anything people might feel useful?

## Requirements

FoxDot must be installed in the current active python environment (the one you can see in the lower left corner, in this case, the "algomusic" environment).

![images/python_env.png](images/python_env.png)

I suggest using conda and installing FoxDot in its own conda environment in order to avoid messing up your system python or your other modules.
VSCode plays nicely with conda, so once you created your conda env you will just need to click on the right bottom corner and select it:

![images/python_env.png](images/python_env_2.png)

## Extension Settings

This extension contributes the following settings:

* `foxdot.start`: starts FoxDot
* `foxdot.evaluateSelection`: (or cmd(ctrl)+enter) to send the selection to FoxDot
* `foxdot.openFolder`: open the current FoxDot folder in the python site-packages dir

## Known Issues

To do

## Release Notes

Add open folder support (tested only on mac)

### 0.0.5

Added logo

**Enjoy!**
