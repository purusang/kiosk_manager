import { KioskClient, Network, KioskTransaction, KioskOwnerCap } from '@mysten/kiosk';
import { getFullnodeUrl, SuiClient } from '@mysten/sui.js/client';
import { Ed25519Keypair, } from '@mysten/sui.js/keypairs/ed25519';
import * as dotenv from 'dotenv';
// import { getFaucetHost, requestSuiFromFaucetV0 } from '@mysten/sui.js/faucet';
import { TransactionBlock } from "@mysten/sui.js/transactions";
import {getKeyAndClient, getEnv} from "./utils";

public fun new<T>(
    pub: &Publisher, ctx: &mut TxContext
)
public fun add_rule<T, Rule: drop, Config: store + drop>(
    _: Rule, policy: &mut TransferPolicy<T>, cap: &TransferPolicyCap<T>, cfg: Config
)