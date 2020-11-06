# Flaredrop

## A tool to claim the Flare airdrop for your XRP cold wallet.

I needed a simple tool to create the signatures required for the flare airdrop, without using other wallets.
Please read the code before you use it, to verify its integrity.

There is an offline api that is used to create the signature, and an online api to get the Sequence, required to build the tx object. The online api is only used to get the Sequence.
Nevertheless be carefull when using private keys on a computer connected to the internet.

I have used the code myself with 7 cold wallets, and I have not experienced any problems.
This is a tool for ADVANCED users. If the above explanation sounds life a foreign language to you, please don't use it.

You can also create your signed transaction by other means, and only use this tool to submit the tx, in that case simply click "Toggle sign/ submit form".

If you want to create a new cold wallet, click on "Create address", and be sure to save the data secure before you use it.

## Donations welcome

rPxt8CQbkLZPyGTJMGcuiSoATVAN47V6Y9

If someone would be interested in a bulk version for this tool, where you input a CSV, and get a CSV back with all the signed transactions, PM me on Github, I think I could make it in ~ 2 weeks, possibly faster.
