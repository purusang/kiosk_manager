import { TransactionBlock } from '@mysten/sui.js/transactions';
import * as dotenv from 'dotenv';
import getExecStuff from '../../utils/execStuff';
import { packageId, Kiosk, KioskOwnerCap, itemType } from '../../utils/packageInfo';
import { nft_1 } from '../../utils/nft_id';
dotenv.config();

async function take_item() { 
    const address = '0x16b80901b9e6d3c8b5f54dc8a414bb1a75067db897e7a3624793176b97445ec6';
    const tx = new TransactionBlock();
    const { client, keypair } = getExecStuff();
    let nft_item = tx.moveCall({
        target: `0x02::kiosk::take`,
        arguments: [
            tx.object(Kiosk),
            tx.object(KioskOwnerCap),
            tx.pure(nft_1),
        ],
        typeArguments: [itemType]
    });
    tx.transferObjects([nft_item], tx.pure.address(address));
    const result = await client.signAndExecuteTransactionBlock({
        signer: keypair,
        transactionBlock: tx
    });
    const res = await client.signAndExecuteTransactionBlock({ signer: keypair, transactionBlock: tx });
    console.log(`Tx hash: ${res.digest}`);
}
take_item();