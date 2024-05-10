import getPackageId from "../../utils/setup";
import { addKioskToMarketplace } from "../addKioskToMarketplace";
import createKioskFn from "../kiosk/create_kiosk";
import { deList } from "../kiosk/delist";
import { allowKioskExtension } from "../kiosk/extension";
import { lock } from "../kiosk/lock_nft";
import { placeList } from "../kiosk/place_and_list";
import { purchaseItem } from "../kiosk/purchase";
import { take_item } from "../kiosk/take_item";
import { withdraw } from "../kiosk/withdraw";
import mintNfts from "../mint_nft/mint_nft";
import increaseCounter from "./movetest";
import { add_rule, createPolicy } from "../policy/policy";

const CALLER_ADDRESS = "0x0850b12520f4f23a1510cf23ae06a34c073c2582c47d59bdddc6b85a59253eb7";

async function main() {

    const resPackage = await getPackageId();
    let packageId = resPackage.packageId;
    let publisherId = resPackage.Publisher;
    let itemType = `${packageId}::nft::Sword`;

    const resNfts = await mintNfts(packageId);
    let nftList = resNfts
    const resKiosk = await createKioskFn(CALLER_ADDRESS);
    let kioskId = resKiosk.kioskId;
    let KioskOwnerCapId = resKiosk.kisokOwnerCapId;

    const resKioskBuyer = await createKioskFn(CALLER_ADDRESS);
    let buyerKioskId = resKioskBuyer.kioskId;
    let buyerKioskCapId = resKioskBuyer.kisokOwnerCapId;

    const resPolicy = await createPolicy(publisherId, itemType);
    await sleep(3000);
    let policyId = resPolicy.policyId;
    let policyCapId = resPolicy.policyCapId;

    await add_rule(policyId, policyCapId, packageId, itemType);
    for (let i = 0; i < 5; i++) {
        await placeList(kioskId, KioskOwnerCapId, nftList[i], itemType);
    }
    for (let i = 5; i < nftList.length; i++) {
        await lock(kioskId, KioskOwnerCapId, policyId, nftList[i], itemType);
    }
    for (let i = 2; i < 5; i++) {
        await purchaseItem(kioskId, nftList[i], buyerKioskId, buyerKioskCapId, policyId, itemType, packageId);
    }
    await deList(kioskId, KioskOwnerCapId, nftList[0], itemType);
    await take_item(kioskId, KioskOwnerCapId, nftList[1], itemType, CALLER_ADDRESS);
    await withdraw(kioskId, KioskOwnerCapId);
    await allowKioskExtension(kioskId, KioskOwnerCapId);
    await addKioskToMarketplace(kioskId, KioskOwnerCapId, packageId);
}

function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
async function run() {
    for (let i = 0; i < 20; i++) {
        console.log("Counter: ", i);
        await main();
        await sleep(9000);
    }
}
// run() 
main()

// async function increase() {
//     await increaseCounter("0xf8d782cca42dacddba55d935535b81bee71a99a6a2a09e21f8c896847eff10d7");
// }

// increase()