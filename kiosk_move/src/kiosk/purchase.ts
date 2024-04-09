import { TransactionBlock } from '@mysten/sui.js/transactions';
import * as dotenv from 'dotenv';
import getExecStuff from '../../utils/execStuff';
import { packageId, Kiosk, KioskOwnerCap, itemType, TransferPolicyId } from '../../utils/packageInfo';
import { nft_6} from "../../utils/nft_id"
dotenv.config();
const purchaseItem = async () => {
    const { keypair, client } = getExecStuff();
    const address = "0x16b80901b9e6d3c8b5f54dc8a414bb1a75067db897e7a3624793176b97445ec6";
    const tx = new TransactionBlock();
    const coin = tx.splitCoins(tx.gas, [tx.pure(100000000)]); 
    const coin2 = tx.splitCoins(tx.gas, [tx.pure(1_0_000_000)]);
    const nested_result = tx.moveCall({  // returns  (T, TransferRequest<T>) 
        target: `0x02::kiosk::purchase`,
        arguments: [
            tx.object(Kiosk),
            tx.pure.id(nft_6),
            tx.object(coin),
        ],
        typeArguments: [itemType]
    });
    
    // tx.moveCall({
    //     target: `0x02::kiosk::lock`,
    //     arguments: [
    //         tx.object(Kiosk),
    //         tx.object(KioskOwnerCap),
    //         tx.object(TransferPolicyId),
    //         tx.object(nested_result[0])
    //     ],
    //     typeArguments: [itemType]
    // });
    /*
        policy: &mut TransferPolicy<T>,
        request: &mut TransferRequest<T>,
        payment: &mut Coin<SUI>,
        ctx: &mut TxContext*/
    tx.moveCall({ 
        target: `${packageId}::royalty_policy::pay`,
        arguments: [
            tx.object(TransferPolicyId),
            nested_result[1],
            //tx.object("0xaa2475a6b23a74768ff0107bcf55a5380b53fa2b36d9aacc79d56606c72474f8"),
            //tx.object("0xaa2475a6b23a74768ff0107bcf55a5380b53fa2b36d9aacc79d56606c72474f8"),
            coin2,
        ],
        typeArguments: [itemType]
    });


    // confirm the request
    tx.moveCall({
        target: `0x02::transfer_policy::confirm_request`,
        arguments: [
            tx.object(TransferPolicyId),
            nested_result[1],
        ],
        typeArguments: [itemType]
    });

    // tx.moveCall({  // returns  (ID, u64, ID)
    //     target: `0x02::transfer::public_transfer`,
    //     arguments: [
    //         nested_result[0],
    //         tx.pure.address(address),
    //     ],
    //     typeArguments: [itemType]
    // });

    // transfer item publisc
    tx.transferObjects([coin2], tx.pure.address(address));
    const result = await client.signAndExecuteTransactionBlock({
        signer: keypair,
        transactionBlock: tx
    });
    console.log(`Tx hash: ${result.digest}`);
}
purchaseItem();