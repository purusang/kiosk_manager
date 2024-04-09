import { TransactionBlock } from '@mysten/sui.js/transactions';
import * as dotenv from 'dotenv';
import getExecStuff from '../../utils/execStuff';
import { packageId, Kiosk, KioskOwnerCap } from '../../utils/packageInfo';
dotenv.config();
const withdraw = async () => {
    const {client, keypair} = getExecStuff();
    const address = '0x16b80901b9e6d3c8b5f54dc8a414bb1a75067db897e7a3624793176b97445ec6';
    const tx = new TransactionBlock();
    console.log(Kiosk);
    console.log(KioskOwnerCap);

    let amtArg = tx.moveCall({
        target: '0x1::option::some',
        arguments: [tx.pure('90000000', 'u64')],
        typeArguments: ['u64'],
    })

    let coin = tx.moveCall({
        target: `0x2::kiosk::withdraw`,
        arguments: [
            tx.object(Kiosk),
            tx.object(KioskOwnerCap),
            amtArg
        ],
    });
    tx.transferObjects([coin], tx.pure.address(address));
    const result = await client.signAndExecuteTransactionBlock({
        signer: keypair,
        transactionBlock: tx
    });
    const res = await client.signAndExecuteTransactionBlock({ signer: keypair, transactionBlock: tx });
    console.log(`Tx hash: ${res.digest}`);

}
withdraw()