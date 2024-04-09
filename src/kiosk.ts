import { KioskClient, Network, KioskTransaction, KioskOwnerCap } from '@mysten/kiosk';
import { getFullnodeUrl, SuiClient } from '@mysten/sui.js/client';
import { Ed25519Keypair, } from '@mysten/sui.js/keypairs/ed25519';
import * as dotenv from 'dotenv';
// import { getFaucetHost, requestSuiFromFaucetV0 } from '@mysten/sui.js/faucet';
import { TransactionBlock } from "@mysten/sui.js/transactions";
import { getKeyAndClient, getEnv } from "./utils";

// We need a Sui Client. You can re-use the SuiClient of your project
// (it's not recommended to create a new one).
// const client = new SuiClient({ url: getFullnodeUrl('testnet') });
// // Now we can use it to create a kiosk Client.
let mnemonics: string = getEnv("MNEMONICS1"); //...77ce308725b1ec84                    // caller/signer mnemonic  
const { keypair, client } = getKeyAndClient(mnemonics);
const kioskClient = new KioskClient({
    client,
    network: Network.TESTNET,
});
const address = "0x16b80901b9e6d3c8b5f54dc8a414bb1a75067db897e7a3624793176b97445ec6";   // caller address

const getKioskAndCaps = async (address: string) => {
    const { kioskOwnerCaps, kioskIds } = await kioskClient.getOwnedKiosks({ address });
    return { kioskOwnerCaps, kioskIds };
}


const getKioskInfo = async (id: string) => {
    return await kioskClient.getKiosk({
        id,
        options: {
            withKioskFields: true, // this flag also returns the `kiosk` object in the response, which includes the base setup
            withListingPrices: true, // This flag enables / disables the fetching of the listing prices.
        }
    });
}

const kioskAllowExtension = async (kiosk: string, item: string, itemType: string, cap: any) => {
    const tx = new TransactionBlock();
    tx.moveCall({
        target: `0x02::kiosk::allow_extension`,
        arguments: [
            tx.object(kiosk),
            tx.object(cap),
            tx.object(item),
        ],
        typeArguments: [itemType]
    });
    const result = await client.signAndExecuteTransactionBlock({
        signer: keypair,
        transactionBlock: tx
    });
    const res = await client.signAndExecuteTransactionBlock({ signer: keypair, transactionBlock: tx });
    console.log(`Tx hash: ${res.digest}`);
}

const place = async (kiosk: string, item: string, itemType: string, cap: any) => {
    const tx = new TransactionBlock();
    tx.moveCall({
        target: `0x02::kiosk::place`,
        arguments: [
            tx.object(kiosk),
            tx.object(cap),
            tx.object(item),
        ],
        typeArguments: [itemType]
    });
    const result = await client.signAndExecuteTransactionBlock({
        signer: keypair,
        transactionBlock: tx
    });
    const res = await client.signAndExecuteTransactionBlock({ signer: keypair, transactionBlock: tx });
    console.log(`Tx hash: ${res.digest}`);
}

const take = async (kiosk: string, item: string, itemType: string, cap: any) => {
    const tx = new TransactionBlock();
    let nft_item = tx.moveCall({
        target: `0x02::kiosk::take`,
        arguments: [
            tx.object(kiosk),
            tx.object(cap),
            tx.pure(item),
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

const list = async (kiosk: string, item: string, itemType: string, cap: any) => {
    const tx = new TransactionBlock();
    tx.moveCall({
        target: `0x02::kiosk::list`,
        arguments: [
            tx.object(kiosk),
            tx.object(cap),
            tx.pure(item),
            tx.pure.u64(100000000)
        ],
        typeArguments: [itemType]
    });
    const result = await client.signAndExecuteTransactionBlock({
        signer: keypair,
        transactionBlock: tx
    });
    console.log(`Tx hash: ${result.digest}`);
}
const listWithPurhcasCap = async (kiosk: string, item: string, itemType: string, cap: any) => {
    const tx = new TransactionBlock();
    let pCap = tx.moveCall({
        target: `0x02::kiosk::list_with_purchase_cap`,
        arguments: [
            tx.object(kiosk),
            tx.object(cap),
            tx.pure(item),
            tx.pure.u64(100000000)
        ],
        typeArguments: [itemType]
    });
    tx.transferObjects([pCap], tx.pure.address(address));
    const result = await client.signAndExecuteTransactionBlock({
        signer: keypair,
        transactionBlock: tx
    });
    console.log(`Tx hash: ${result.digest}`);
}

const purchaseWithPurhcasCap = async (kiosk: string, item: string, itemType: string, cap: any, policy: string) => {
    const tx = new TransactionBlock();
    let pCap = tx.moveCall({
        target: `0x02::kiosk::purchase_with_cap`,
        arguments: [
            tx.object(kiosk),
            tx.object("0xe437aed441e68df0c48f351d625a2e99158da0b9327fb91c3c198a56b31b5ba4"),
            tx.object("0x8434d0fa6187759d2ecf725a70e3cbf01f7f96a14a57df23201e6341665233a2"),
        ],
        typeArguments: [itemType]
    });
    tx.moveCall({  // returns  (ID, u64, ID)
        target: `0x02::transfer_policy::confirm_request`,
        arguments: [
            tx.object(policy),
            pCap[1],
        ],
        typeArguments: [itemType]
    });
    tx.transferObjects([pCap[0]], tx.pure.address(address));
    const result = await client.signAndExecuteTransactionBlock({
        signer: keypair,
        transactionBlock: tx
    });
    console.log(`Tx hash: ${result.digest}`);
}

const deList = async (kiosk: string, item: string, itemType: string, cap: any) => {
    const tx = new TransactionBlock();
    tx.moveCall({
        target: `0x02::kiosk::delist`,
        arguments: [
            tx.object(kiosk),
            tx.object(cap),
            tx.pure(item),
        ],
        typeArguments: [itemType]
    });
    const result = await client.signAndExecuteTransactionBlock({
        signer: keypair,
        transactionBlock: tx
    });
    console.log(`Tx hash: ${result.digest}`);
}


const placeAndList = async (kiosk: string, item: string, itemType: string, cap: any) => {
    const tx = new TransactionBlock();
    tx.moveCall({
        target: `0x02::kiosk::place_and_list`,
        arguments: [
            tx.object(kiosk),
            tx.object(cap),
            tx.object(item),
            tx.pure.u64(100000000)
        ],
        typeArguments: [itemType]
    });
    const result = await client.signAndExecuteTransactionBlock({
        signer: keypair,
        transactionBlock: tx
    });
    console.log(`Tx hash: ${result.digest}`);
}
const createKiosk = async () => {
    const tx = new TransactionBlock();
    let kiosk = tx.moveCall({
        target: `0x02::kiosk::new`,
    });
    tx.moveCall({
        target: `0x02::transfer::public_share_object`,
        arguments: [
            kiosk[0]
        ],
        typeArguments: ["0x02::kiosk::Kiosk"]
    });
    tx.moveCall({
        target: `0x02::transfer::public_transfer`,
        arguments: [
            kiosk[1], tx.pure.address(address)
        ],
        typeArguments: ["0x02::kiosk::KioskOwnerCap"]
    });
    let res = await client.signAndExecuteTransactionBlock({ signer: keypair, transactionBlock: tx });
    console.log('Kiosk created digest: ',res.digest);
}

const lockItem = async (kiosk: string, cap: any, policy: string, item: string, itemType: string) => {
    const tx = new TransactionBlock();
    tx.moveCall({
        target: `0x02::kiosk::lock`,
        arguments: [
            tx.object(kiosk),
            tx.object(cap),
            tx.object(policy),
            tx.object(item)
        ],
        typeArguments: [itemType]
    });
    const result = await client.signAndExecuteTransactionBlock({
        signer: keypair,
        transactionBlock: tx
    });
    console.log(`Tx hash item locked: ${result.digest}`);
}

const purchaseItem = async (kiosk: string, itemId: string,  itemType: string, policy: string) => {
    const tx = new TransactionBlock();
    const coin = tx.splitCoins(tx.gas, [tx.pure(100000000)]); 
    const coin2 = tx.splitCoins(tx.gas, [tx.pure(1_0_000_000)]);
    const nested_result = tx.moveCall({  // returns  (T, TransferRequest<T>) 
        target: `0x02::kiosk::purchase`,
        arguments: [
            tx.object(kiosk),
            tx.pure.id(itemId),
            tx.object(coin),
        ],
        typeArguments: [itemType]
    });
    
    tx.moveCall({
        target: `0x02::kiosk::lock`,
        arguments: [
            tx.object("0x133304517ae77914cdcda1df11666c1187c33004a36d4d809595fddeeac54dc7"),
            tx.object("0xd165a3aa2597211f5ce1f62ca0863f9d70c15274054c10bcf0eeea5e57116e8d"),
            tx.object(policy),
            tx.object(nested_result[0])
        ],
        typeArguments: [itemType]
    });
    /*
        policy: &mut TransferPolicy<T>,
        request: &mut TransferRequest<T>,
        payment: &mut Coin<SUI>,
        ctx: &mut TxContext*/
    tx.moveCall({ 
        target: `0xf0d9c16afcc81c7ae0bdbf3b040feb1928272883649fb4ae5650c2d8eeee0e13::royalty_policy::pay`,
        arguments: [
            tx.object("0xfff082a759c18445b7aa12e8329675fde4b99ac268a599982df9e1f0ac77c424"),
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
            tx.object(policy),
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

const withdraw = async (kiosk: string, kiosk_cap: string) => {
    const tx = new TransactionBlock();
    console.log(kiosk);
    console.log(kiosk_cap);

    let amtArg = tx.moveCall({
        target: '0x1::option::some',
        arguments: [tx.pure('90000000', 'u64')],
        typeArguments: ['u64'],
    })

    let coin = tx.moveCall({
        target: `0x2::kiosk::withdraw`,
        arguments: [
            tx.object(kiosk),
            tx.object(kiosk_cap),
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

const setOwnerCustom = async (kiosk: string, kiosk_cap: string, owner: string) => {
    const tx = new TransactionBlock();
    tx.moveCall({
        target: `0x02::kiosk::set_owner_custom`,
        arguments: [
            tx.object(kiosk),
            tx.object(kiosk_cap),
            tx.pure(owner),
        ],
    });

    const result = await client.signAndExecuteTransactionBlock({
        signer: keypair,
        transactionBlock: tx
    });

    console.log(`Tx hash: ${result.digest}`);
}

const closeAndWithdraw = async (kioks: string, kiosk_cap: string) => {
    const tx = new TransactionBlock();
    let coin = tx.moveCall({
        target: `0x02::kiosk::close_and_withdraw`,
        arguments: [
            tx.object(kioks),
            tx.object(kiosk_cap),
        ],
    });
    tx.transferObjects([coin], tx.pure.address(address));
    const result = await client.signAndExecuteTransactionBlock({
        signer: keypair,
        transactionBlock: tx
    });
    
}

const allowKioskExtension = async (kiosk: string, kiosk_cap: string) => {
    const tx = new TransactionBlock();
    let coin = tx.moveCall({
        target: `0x02::kiosk::set_allow_extensions`,
        arguments: [
            tx.object(kiosk),
            tx.object(kiosk_cap),
            tx.pure.bool(true)
        ],
    });
    
    const result = await client.signAndExecuteTransactionBlock({
        signer: keypair,
        transactionBlock: tx
    });
    console.log("allow extension: ", result.digest);
    
}

const addExtension = async (kiosk: string, kiosk_cap: string) => {
    const tx = new TransactionBlock();
    let coin = tx.moveCall({
        target: `0x02::kiosk::set_allow_extensions`,
        arguments: [
            tx.object(kiosk),
            tx.object(kiosk_cap),
            tx.pure.bool(true)
        ],
    });
    
    const result = await client.signAndExecuteTransactionBlock({
        signer: keypair,
        transactionBlock: tx
    });
    console.log("allow extension: ", result.digest);
    
}
async function main() {
    const packageId = getEnv("PACKAGE"); // nft contract
    const nftId = getEnv("NFT");
    //const itemType = `${packageId}::nft::Sword`;
    const itemType = '0xf0d9c16afcc81c7ae0bdbf3b040feb1928272883649fb4ae5650c2d8eeee0e13::minter::NFT';
    const publisher = getEnv("PUBLISHER");
    const policy = getEnv("TRANSFER_POLICY");
    const coin = getEnv("COIN");
    const kiosk = getEnv("KIOSK");
    const kioskCap = getEnv("KIOSK_OWNER_CAP");
    // mint(address, packageId);
   // const res = await createKiosk();
    // const { kioskOwnerCaps, kioskIds } = await getKioskAndCaps(address);
    // console.log(kioskOwnerCaps[0], kioskIds[0]);
    // await placeAndList(kiosk, nftId, `${packageId}::nft::Sword`, kioskCap);
    // await place(kiosk, nftId, `${packageId}::nft::Sword`, kioskCap);
    // await take(kiosk, nftId, `${packageId}::nft::Sword`, kioskCap);
    // await list(kiosk, nftId,'0xf0d9c16afcc81c7ae0bdbf3b040feb1928272883649fb4ae5650c2d8eeee0e13::minter::NFT', kioskCap);
    // await listWithPurhcasCap(kiosk, nftId, `${packageId}::nft::Sword`, kioskCap);
    // await purchaseWithPurhcasCap(kiosk, nftId, `${packageId}::nft::Sword`, kioskCap, policy);
    // await deList(kiosk, nftId, `${packageId}::nft::Sword`, kioskCap);
    // await lockItem(kiosk, kioskCap, policy, nftId, itemType);
    await purchaseItem(kiosk, nftId, itemType, policy);
    // await withdraw(kiosk, kioskCap);
    // await setOwnerCustom(kiosk, kioskCap, "0xc1c90ab4fb7949a5107ee363cd9b95ed484095860f4ca0f3e8a9fd6ac210f551");
    // await closeAndWithdraw(kiosk, kioskCap);
    //await allowKioskExtension(kiosk, kioskCap);
}
main();