import { TransactionBlock } from '@mysten/sui.js/transactions';
import * as dotenv from 'dotenv';
import getExecStuff from '../utils/execStuff';
import { Kiosk, TransferPolicyId, packageId } from '../utils/packageInfo';
dotenv.config();

async function placeItem() {
    const { keypair, client } = getExecStuff();
    let sender = "0xfeb221008ec20b3454f078975558913929007e9cb8dc6f2efa22ac64719032ed";
    const tx = new TransactionBlock();
    tx.moveCall({
        target: `${packageId}::ext::lock_item_in_marketplace`,
        arguments: [
            tx.object(Kiosk),
            tx.object("0x540af1836b56691a7726644eeb4756e8d6f27e823a7ff37538d51ebcc6a60d93"),
            tx.object(TransferPolicyId)
        ],
        typeArguments: [`${packageId}::minter::NFT`]
    })
    const result = await client.signAndExecuteTransactionBlock({
        signer: keypair,
        transactionBlock: tx,
    });
    console.log(result.digest);
}

placeItem();